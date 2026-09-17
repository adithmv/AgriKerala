export function getPlannerQuotaError(error) {
  let providerError = error
  try {
    const parsed = JSON.parse(error.message)
    providerError = parsed.error || parsed
  } catch {
    // Some SDK/network errors contain plain text rather than a JSON envelope.
  }
  if (Number(error?.status) !== 429 && Number(providerError?.code) !== 429) return null
  const details = Array.isArray(providerError?.details) ? providerError.details : []
  const daily = details.some(detail => Array.isArray(detail.violations) &&
    detail.violations.some(violation => /PerDay/i.test(violation.quotaId || '')))
  if (daily) {
    return {
      code: 'AI_DAILY_QUOTA_EXHAUSTED',
      error: 'The AI planner has reached its daily usage limit. Please try again after the daily reset, or contact us for help with your plan.'
    }
  }
  const retryInfo = details.find(detail => detail['@type']?.endsWith('/google.rpc.RetryInfo'))
  const delay = Number.parseFloat(retryInfo?.retryDelay)
  const retryAfterSeconds = Number.isFinite(delay) && delay > 0 ? Math.ceil(delay) : 60
  return {
    code: 'AI_RATE_LIMITED',
    error: `The AI planner is temporarily busy. Please wait ${retryAfterSeconds} seconds before trying again.`,
    retryAfterSeconds
  }
}
