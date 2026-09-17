import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = (await readFile(new URL('../lib/gemini.js', import.meta.url), 'utf8'))
  .replace(/^import .*\n/gm, '').replace('export async function runPlannerAgent', 'async function runPlannerAgent')

function completePlan() {
  const crops = ['Tomato', 'Chilli', 'Curry leaf', 'Okra', 'Amaranth'].map(name => ({
    name, malayalamName: 'Transliteration', difficulty: 'Easy', timeToHarvest: '8 weeks',
    expectedYield: '1kg', whyRecommended: 'Suitable for the conditions.', containerSize: '20L', bestSeason: 'Winter'
  }))
  return {
    climateAnalysis: 'Warm and humid.', crops,
    careGuides: crops.map(crop => ({
      cropName: crop.name, soilMix: 'Soil and compost', watering: 'Check daily',
      fertilizing: 'Compost monthly', sunlight: 'Six hours', commonPests: 'Inspect leaves',
      monthlyTips: { month1: 'Sow', month2: 'Feed', month3: 'Harvest' }, harvestTips: 'Pick when ripe'
    }))
  }
}

function harness({ plan = completePlan(), error = null, raw } = {}) {
  const calls = []
  class FakeGoogleGenAI {
    models = {
      generateContent: async input => {
        calls.push(input)
        if (error) throw error
        return { text: raw === undefined ? JSON.stringify(plan) : raw }
      }
    }
  }
  const run = new Function('GoogleGenAI', `${source}; return runPlannerAgent`)(FakeGoogleGenAI)
  return { calls, run: () => run({ district: 'Kozhikode', length: 10, width: 20, roofType: 'flat', sunlight: 'full', purpose: 'food', timePerWeek: 5 }) }
}

test('complete plan uses one structured request and preserves the UI contract', async () => {
  const { calls, run } = harness()
  const result = await run()
  assert.equal(calls.length, 1)
  assert.equal(calls[0].config.responseMimeType, 'application/json')
  assert.equal(calls[0].config.httpOptions.retryOptions.attempts, 1)
  assert.deepEqual(calls[0].config.responseJsonSchema.required, ['climateAnalysis', 'crops', 'careGuides'])
  assert.equal(result.area, 200)
  assert.equal(result.district, 'Kozhikode')
  assert.equal(result.crops.length, 5)
  assert.equal(result.careGuides.length, 5)
})

test('quota error is propagated without requesting more AI work', async () => {
  const error = Object.assign(new Error('Quota exceeded'), { status: 429 })
  const { calls, run } = harness({ error })
  await assert.rejects(run, err => err === error)
  assert.equal(calls.length, 1)
})

test('incomplete and malformed responses do not reach the results UI', async () => {
  const plan = completePlan()
  delete plan.careGuides[0].monthlyTips
  await assert.rejects(harness({ plan }).run, /incomplete/)
  await assert.rejects(harness({ raw: 'not JSON' }).run, SyntaxError)
})

test('care guides must match every recommended crop', async () => {
  const plan = completePlan()
  plan.careGuides[0].cropName = 'Unknown crop'
  await assert.rejects(harness({ plan }).run, /mismatched/)
})

test('case and whitespace differences in care guide names are normalized', async () => {
  const plan = completePlan()
  plan.careGuides[0].cropName = ' TOMATO '
  const result = await harness({ plan }).run()
  assert.equal(result.careGuides[0].cropName, 'Tomato')
})
