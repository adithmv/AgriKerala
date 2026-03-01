import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function runPlannerAgent(formData) {
  const { district, length, width, roofType, sunlight, purpose, timePerWeek } = formData
  const area = length * width

  // Agent 1 — Climate Analysis
  const climatePrompt = `
You are an expert Urbancultural climate analyst specializing in Kerala, India.
Analyze the following rooftop farming context and provide a detailed climate assessment.

Location: ${district} district, Kerala
Rooftop Area: ${area} square feet (${length}ft x ${width}ft)
Roof Type: ${roofType}
Sunlight Availability: ${sunlight}
Current Season: ${getCurrentSeason()}

Provide a structured climate analysis covering:
1. Climate characteristics of ${district} district
2. Current season suitability for farming
3. Rainfall and humidity considerations
4. Temperature range and its impact
5. Key challenges for rooftop farming in this location

Keep it concise and practical. Return plain text only.
`

  const climateResult = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: climatePrompt
  })
  const climateAnalysis = climateResult.text

  // Agent 2 — Crop Recommendations
  const cropPrompt = `
You are a Kerala rooftop farming expert with 20 years of experience.
Based on this climate analysis and farmer profile, recommend exactly 5 crops.

Climate Analysis:
${climateAnalysis}

Farmer Profile:
- Purpose: ${purpose}
- Time available per week: ${timePerWeek} hours
- Rooftop area: ${area} sq ft
- Roof type: ${roofType}

For each crop provide exactly this JSON structure:
{
  "crops": [
    {
      "name": "crop name",
      "malayalamName": "name in Malayalam transliteration",
      "difficulty": "Easy/Medium/Hard",
      "timeToHarvest": "X weeks/months",
      "expectedYield": "approximate yield",
      "whyRecommended": "2 sentence explanation specific to their location and setup",
      "containerSize": "recommended pot/grow bag size",
      "bestSeason": "best time to grow in Kerala"
    }
  ]
}

Return only valid JSON, no other text.
`

  const cropResult = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: cropPrompt
  })
  let cropText = cropResult.text
  cropText = cropText.replace(/```json|```/g, '').trim()
  const cropData = JSON.parse(cropText)

  // Agent 3 — Care Guides
  const carePrompt = `
You are a Kerala Urbancultural extension officer providing practical farming guidance.
Create a care guide for these crops for a rooftop garden in ${district}, Kerala.

Crops: ${cropData.crops.map(c => c.name).join(', ')}
Rooftop Area: ${area} sq ft
Purpose: ${purpose}

For each crop provide exactly this JSON structure:
{
  "careGuides": [
    {
      "cropName": "crop name",
      "soilMix": "recommended soil mixture",
      "watering": "watering frequency and amount",
      "fertilizing": "fertilizing schedule and type",
      "sunlight": "sunlight requirements",
      "commonPests": "common pests and organic solutions",
      "monthlyTips": {
        "month1": "tip for first month",
        "month2": "tip for second month",
        "month3": "tip for third month"
      },
      "harvestTips": "how and when to harvest"
    }
  ]
}

Return only valid JSON, no other text.
`

  const careResult = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: carePrompt
  })
  let careText = careResult.text
  careText = careText.replace(/```json|```/g, '').trim()
  const careData = JSON.parse(careText)

  return {
    climateAnalysis,
    crops: cropData.crops,
    careGuides: careData.careGuides,
    area,
    district
  }
}

function getCurrentSeason() {
  const month = new Date().getMonth() + 1
  if (month >= 6 && month <= 9) return 'Southwest Monsoon (June-September)'
  if (month >= 10 && month <= 11) return 'Northeast Monsoon (October-November)'
  if (month >= 12 || month <= 2) return 'Winter/Cool Season (December-February)'
  return 'Summer/Pre-monsoon (March-May)'
}