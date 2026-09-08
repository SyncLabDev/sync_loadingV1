import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProgressDisplay } from './ProgressDisplay'
import { initialLoadingState, loadingReducer } from '../state/loadingReducer'

describe('ProgressDisplay', () => {
  it('renders real percentage state', () => {
    const state = loadingReducer(initialLoadingState(), { type: 'PROGRESS', progress: .67 })
    render(<ProgressDisplay state={state} />)
    expect(screen.getByLabelText('Loading 67 percent')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '67')
  })

  it('hides hidden and stage-only modes', () => {
    const state = initialLoadingState()
    state.config = { ...state.config, Progress: { ...state.config.Progress, style: 'hidden' } }
    const { container } = render(<ProgressDisplay state={state} />)
    expect(container).toBeEmptyDOMElement()
  })
})
