import { runPlannerAgent } from '../../../lib/gemini'
import { supabase } from '../../../lib/supabase'

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

    // Run AI agent
    const result = await runPlannerAgent({
      district,
      length: parseFloat(length),
      width: parseFloat(width),
      roofType,
      sunlight,
      purpose,
      timePerWeek
    })

    // Log to Supabase
    await supabase.from('planner_logs').insert({
      district,
      rooftop_length: parseFloat(length),
      rooftop_width: parseFloat(width),
      roof_type: roofType,
      purpose,
      recommendations: result.crops
    })

    return Response.json({ success: true, data: result })

  } catch (error) {
    console.error('Planner API error:', error)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}