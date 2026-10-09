export type RiskTone = 'success' | 'warning' | 'destructive'

export function toneForScore(score: number): RiskTone {
  if (score >= 60) return 'destructive'
  if (score >= 35) return 'warning'
  return 'success'
}

export const toneText: Record<RiskTone, string> = {
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
}

export const toneBg: Record<RiskTone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
}

export const toneStroke: Record<RiskTone, string> = {
  success: 'stroke-success',
  warning: 'stroke-warning',
  destructive: 'stroke-destructive',
}

export const toneBorder: Record<RiskTone, string> = {
  success: 'border-success/40',
  warning: 'border-warning/40',
  destructive: 'border-destructive/40',
}
