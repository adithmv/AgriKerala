import { runPlannerAgent } from '../../../lib/gemini'
import { supabase } from '../../../lib/supabase'
import { getPlannerQuotaError } from '../../../lib/plannerError'

export async function POST(request) {
  try {
    const body = await request.json()

    const { district, length, width, roofType, sunlight, purpose, timePerWeek } = body

    // Validate inputs
    if (!district || !length || !width || !roofType || !sunlight || !purpose || !timePerWeek) {
      return Response.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (![length, width].every(value => Number.isFinite(Number(value)) && Number(value) > 0)) {
      return Response.json({ error: 'Rooftop dimensions must be positive numbers.' }, { status: 400 })
    }

    // Measure the planner itself, excluding database logging.
    const startedAt = performance.now()
    const result = await runPlannerAgent({
      district,
      length: parseFloat(length),
      width: parseFloat(width),
      roofType,
      sunlight,
      purpose,
      timePerWeek
    })

    const durationMs = Math.round(performance.now() - startedAt)

    // A logging failure must not discard a successful plan.
    const { error: logError } = await supabase.from('planner_logs').insert({
      district,
      rooftop_length: parseFloat(length),
      rooftop_width: parseFloat(width),
      roof_type: roofType,
      purpose,
      recommendations: result.crops,
      duration_ms: durationMs
    })
    if (logError) console.error('Planner logging failed:', logError.message)

    return Response.json({ success: true, data: result })

  } catch (error) {
    const quotaError = getPlannerQuotaError(error)
    if (quotaError) {
      console.warn('Planner quota limit:', quotaError.code)
      return Response.json(quotaError, {
        status: 429,
        headers: quotaError.retryAfterSeconds ? { 'Retry-After': String(quotaError.retryAfterSeconds) } : {}
      })
    }
    console.error('Planner API error:', error)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
