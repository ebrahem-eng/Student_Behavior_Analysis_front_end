import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RiskBadge } from '@/components/shared/RiskBadge'

describe('RiskBadge', () => {
  it('renders correctly with low risk', () => {
    render(<RiskBadge level="low" />)
    expect(screen.getByText('Low Risk')).toBeInTheDocument()
  })

  it('renders correctly with medium risk', () => {
    render(<RiskBadge level="medium" />)
    expect(screen.getByText('Medium Risk')).toBeInTheDocument()
  })

  it('renders correctly with high risk', () => {
    render(<RiskBadge level="high" />)
    expect(screen.getByText('High Risk')).toBeInTheDocument()
  })
})
