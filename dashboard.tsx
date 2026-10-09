'use client'

import { useState } from 'react'
import type { Analysis } from '@/lib/analysis-schema'
import { AppHeader } from './app-header'
import { InputPanel } from './input-panel'
import { OutputPanel } from './output-panel'

export type AnalysisState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Analysis; completedAt: Date }

export function Dashboard() {
  const [state, setState] = useState<AnalysisState>({ status: 'idle' })

  async function runAnalysis(image: File, report: string) {
    setState({ status: 'loading' })
    const body = new FormData()
    body.append('image', image)
    body.append('report', report)

    try {
      const res = await fetch('/api/analyze', { method: 'POST', body })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Analysis request failed.')
      setState({ status: 'success', data: json as Analysis, completedAt: new Date() })
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Unexpected error during analysis.',
      })
    }
  }

  return (
    <div className="bg-grid flex min-h-dvh flex-col">
      <AppHeader state={state} />
      <main className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:p-6">
        <InputPanel onSubmit={runAnalysis} isLoading={state.status === 'loading'} />
        <OutputPanel state={state} />
      </main>
    </div>
  )
}
