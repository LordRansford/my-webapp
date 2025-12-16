'use client'

import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Tool error', error, info)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (this.props.onReset) this.props.onReset()
  }

  render() {
    if (this.state.hasError) {
      const { FallbackComponent } = this.props
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} resetErrorBoundary={this.handleReset} />
      }
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <p className="font-semibold">Something went wrong in this tool.</p>
          <button
            onClick={this.handleReset}
            className="mt-2 rounded-full border px-3 py-1 text-xs text-red-800 hover:bg-red-100 focus:outline-none focus:ring focus:ring-red-200"
          >
            Reset tool
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
