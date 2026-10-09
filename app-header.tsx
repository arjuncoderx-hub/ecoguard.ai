import { Satellite } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnalysisState } from './dashboard'

const statusLabel: Record<AnalysisState['status'], string> = {
  idle: 'Standby',
  loading: 'Synthesizing',
  error: 'Fault',
  success: 'Analysis Ready',
}

export function AppHeader({ state }: { state: AnalysisState }) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary">
            <Satellite className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-balance">
              EcoGuard <span className="text-primary">AI</span>
            </h1>
            <p className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
              Multimodal Environmental Risk Analyzer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px] tracking-wider uppercase">
          <span className="hidden text-muted-foreground sm:inline">Model: GPT-4o</span>
          <span
            className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1"
            role="status"
            aria-live="polite"
          >
            <span
              className={cn(
                'size-2 rounded-full',
                state.status === 'idle' && 'bg-muted-foreground',
                state.status === 'loading' && 'animate-pulse bg-warning',
                state.status === 'error' && 'bg-destructive',
                state.status === 'success' && 'bg-primary',
              )}
              aria-hidden="true"
            />
            {statusLabel[state.status]}
          </span>
        </div>
      </div>
    </header>
  )
}
