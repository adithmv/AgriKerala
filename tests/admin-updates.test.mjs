import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { getPlannerQuotaError } from '../lib/plannerError.js'

const dashboard = await readFile(new URL('../app/admin/dashboard/page.js', import.meta.url), 'utf8')
const formatter = dashboard.match(/function formatDuration\(ms\) \{[\s\S]*?\n\}/)[0]
const formatDuration = new Function(`${formatter}; return formatDuration`)()
const route = (await readFile(new URL('../app/api/planner/route.js', import.meta.url), 'utf8'))
  .replace(/^import .*\n/gm, '').replace('export async function POST', 'async function POST')
const ordersPage = await readFile(new URL('../app/admin/orders/page.js', import.meta.url), 'utf8')
const saveSource = ordersPage.match(/async function saveOrder\(e\) \{[\s\S]*?\n  \}/)[0]

function orderHarness(overrides = {}, databaseError = null, editingOrder = null) {
  const state = { open: true, saving: false, error: '', refreshed: false, payload: null }
  const form = {
    customer_name: ' Customer ', customer_phone: ' 123 ', product_name: ' Grow Bag ',
    quantity: '2', total_price: '0', address: ' Address ', status: 'pending', ...overrides
  }
  const query = {
    insert(payload) { state.operation = 'insert'; state.payload = payload; return this },
    update(payload) { state.operation = 'update'; state.payload = payload; return this },
    eq(column, value) { state.match = [column, value]; return this },
    select() { return this },
    async single() { return { data: databaseError ? null : { id: 1 }, error: databaseError } }
  }
  const save = new Function('form', 'saving', 'editingOrder', 'supabase', 'setFormError',
    'setSaving', 'setShowModal', 'setEditingOrder', 'setForm', 'EMPTY_FORM', 'fetchOrders',
    `${saveSource}; return saveOrder`)(
    form, false, editingOrder, { from: () => query },
    value => { state.error = value }, value => { state.saving = value },
    value => { state.open = value }, () => {}, () => {}, {},
    async () => { state.refreshed = true }
  )
  return { state, save: () => save({ preventDefault() {} }) }
}

test('manual order preserves zero price and trims address and names', async () => {
  const { state, save } = orderHarness()
  await save()
  assert.equal(state.operation, 'insert')
  assert.equal(state.payload.total_price, 0)
  assert.equal(state.payload.quantity, 2)
  assert.equal(state.payload.address, 'Address')
  assert.equal(state.payload.product_name, 'Grow Bag')
  assert.equal(state.open, false)
  assert.equal(state.refreshed, true)
})

test('edit saves decimal prices and targets the existing order', async () => {
  const { state, save } = orderHarness({ total_price: '12.50' }, null, { id: 42 })
  await save()
  assert.equal(state.operation, 'update')
  assert.deepEqual(state.match, ['id', 42])
  assert.equal(state.payload.total_price, 12.5)
})

test('failed save retains the modal and exposes the database error', async () => {
  const { state, save } = orderHarness({}, { message: 'Permission denied' })
  await save()
  assert.equal(state.open, true)
  assert.equal(state.refreshed, false)
  assert.equal(state.saving, false)
  assert.match(state.error, /Permission denied/)
})

test('invalid manual order values never reach the database', async () => {
  for (const invalid of [{ product_name: ' ' }, { quantity: '1.5' }, { quantity: '0' }, { total_price: '-1' }]) {
    const { state, save } = orderHarness(invalid)
    await save()
    assert.equal(state.payload, null)
    assert.equal(state.open, true)
    assert.ok(state.error)
  }
})

test('duration formatting handles missing data, zero, seconds and minute carry', () => {
  assert.equal(formatDuration(null), '—')
  assert.equal(formatDuration(NaN), '—')
  assert.equal(formatDuration(-1), '—')
  assert.equal(formatDuration(0), '0.0s')
  assert.equal(formatDuration(1250), '1.3s')
  assert.equal(formatDuration(60000), '1m 0s')
  assert.equal(formatDuration(119600), '2m 0s')
})

const body = {
  district: 'Kozhikode', length: '10', width: '20', roofType: 'flat',
  sunlight: 'full', purpose: 'food', timePerWeek: '5'
}

function createRoute({ logError = null, agentError = null } = {}) {
  const inserts = []
  const errors = []
  const ticks = [100, 1334.6]
  const result = { crops: ['tomato'] }
  let agentInput
  const POST = new Function('runPlannerAgent', 'supabase', 'performance', 'console', 'getPlannerQuotaError', `${route}; return POST`)(
    async input => {
      agentInput = input
      if (agentError) throw agentError
      return result
    },
    { from: table => ({ insert: async payload => {
      inserts.push({ table, payload })
      return { error: logError }
    } }) },
    { now: () => ticks.shift() },
    { error: (...args) => errors.push(args), warn: (...args) => errors.push(args) },
    getPlannerQuotaError
  )
  return { POST, inserts, errors, result, getAgentInput: () => agentInput }
}

test('planner persists measured duration with the original log fields', async () => {
  const harness = createRoute()
  const response = await harness.POST({ json: async () => body })
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { success: true, data: harness.result })
  assert.equal(harness.getAgentInput().length, 10)
  assert.deepEqual(harness.inserts, [{ table: 'planner_logs', payload: {
    district: 'Kozhikode', rooftop_length: 10, rooftop_width: 20,
    roof_type: 'flat', purpose: 'food', recommendations: ['tomato'], duration_ms: 1235
  } }])
})

test('database logging error preserves a successful planner response', async () => {
  const harness = createRoute({ logError: { message: 'Database unavailable' } })
  const response = await harness.POST({ json: async () => body })
  assert.equal(response.status, 200)
  assert.equal(harness.errors.length, 1)
})

test('invalid request does not run the planner or insert a log', async () => {
  const harness = createRoute()
  const response = await harness.POST({ json: async () => ({}) })
  assert.equal(response.status, 400)
  assert.equal(harness.getAgentInput(), undefined)
  assert.equal(harness.inserts.length, 0)
})

test('failed planner does not record a successful duration', async () => {
  const harness = createRoute({ agentError: new Error('AI unavailable') })
  const response = await harness.POST({ json: async () => body })
  assert.equal(response.status, 500)
  assert.equal(harness.inserts.length, 0)
})

test('daily quota exhaustion returns 429 without the misleading short retry delay', async () => {
  const agentError = Object.assign(new Error(JSON.stringify({ error: {
    code: 429, status: 'RESOURCE_EXHAUSTED',
    details: [
      { '@type': 'type.googleapis.com/google.rpc.QuotaFailure', violations: [
        { quotaId: 'GenerateRequestsPerDayPerProjectPerModel-FreeTier', quotaValue: '20' }
      ] },
      { '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '33s' }
    ]
  } })), { status: 429 })
  const harness = createRoute({ agentError })
  const response = await harness.POST({ json: async () => body })
  const payload = await response.json()
  assert.equal(response.status, 429)
  assert.equal(payload.code, 'AI_DAILY_QUOTA_EXHAUSTED')
  assert.match(payload.error, /daily usage limit/)
  assert.equal(payload.retryAfterSeconds, undefined)
  assert.equal(response.headers.get('Retry-After'), null)
  assert.equal(harness.inserts.length, 0)
})

test('temporary quota error exposes the provider delay and retry header', async () => {
  const agentError = Object.assign(new Error(JSON.stringify({ error: {
    code: 429, details: [{ '@type': 'type.googleapis.com/google.rpc.RetryInfo', retryDelay: '33.8s' }]
  } })), { status: 429 })
  const harness = createRoute({ agentError })
  const response = await harness.POST({ json: async () => body })
  assert.equal(response.status, 429)
  assert.equal(response.headers.get('Retry-After'), '34')
  assert.equal((await response.json()).code, 'AI_RATE_LIMITED')
})

test('plain-text 429 has a conservative retry delay', () => {
  const result = getPlannerQuotaError(Object.assign(new Error('Too many requests'), { status: 429 }))
  assert.equal(result.retryAfterSeconds, 60)
  assert.equal(getPlannerQuotaError(new Error('Other failure')), null)
})

test('invalid numeric inputs never consume an AI request', async () => {
  for (const change of [{ length: '-1' }, { width: 'abc' }, { width: 'Infinity' }]) {
    const harness = createRoute()
    const response = await harness.POST({ json: async () => ({ ...body, ...change }) })
    assert.equal(response.status, 400)
    assert.equal(harness.getAgentInput(), undefined)
  }
})

test('weekly time ranges offered by the form are accepted', async () => {
  for (const timePerWeek of ['1 to 2', '3 to 5', '5 to 10', 'More than 10']) {
    const harness = createRoute()
    const response = await harness.POST({ json: async () => ({ ...body, timePerWeek }) })
    assert.equal(response.status, 200)
    assert.equal(harness.getAgentInput().timePerWeek, timePerWeek)
  }
})
