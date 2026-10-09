import { AlertTriangle, Radar } from 'lucide-react'
import type { AnalysisState } from './dashboard'
import { Panel } from './panel'
import { ProcessingState } from './processing-state'
import { AnalysisResults } from './analysis-results'

export function OutputPanel({ state }: { state: AnalysisState }) {
  return (
    <Panel
      title="Risk Synthesis Output"
      code="[02]"
      action={
        state.status === 'success' ? (
          <span className="font-mono text-[11px] text-muted-foreground">
            {state.completedAt.toISOString().replace('T', ' ').slice(0, 19)} UTC
          </span>
        ) : null
      }
      className="min-h-[560px]"
    >
      <div aria-live="polite" aria-busy={state.status === 'loading'} className="flex flex-1 flex-col">
        {state.status === 'idle' && <IdleState />}
        {state.status === 'loading' && <ProcessingState />}
        {state.status === 'error' && <ErrorState message={state.message} />}
        {state.status === 'success' && <AnalysisResults data={state.data} />}
      </div>
    </Panel>
  )
}

function IdleState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
        <Radar className="size-7" aria-hidden="true" />
      </div>
      <div className="flex max-w-sm flex-col gap-1">
        <p className="text-sm font-medium">Awaiting input streams</p>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          Upload satellite imagery and a field report, then execute the synthesis to generate a composite risk
          score and 30/60/90 day forecast.
        </p>
      </div>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full border border-destructive/40 bg-destructive/10 text-destructive">
        <AlertTriangle className="size-7" aria-hidden="true" />
      </div>
      <div className="flex max-w-sm flex-col gap-1">
        <p className="text-sm font-medium">Synthesis fault</p>
        <p role="alert" className="text-sm leading-relaxed text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  )
}
