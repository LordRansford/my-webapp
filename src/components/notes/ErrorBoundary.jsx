'use client'

import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // #region agent log
    if (typeof window !== 'undefined') {
      fetch('http://127.0.0.1:7243/ingest/5c42012f-fdd0-45fd-8860-75c06576ec81',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ErrorBoundary.jsx:getDerivedStateFromError',message:'Error state derived',data:{errorMessage:error?.message,errorName:error?.name,errorStack:error?.stack?.substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:['H1','H2','H3','H4','H5','H6','H7']})}).catch(()=>{});
    }
    // #endregion
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/5c42012f-fdd0-45fd-8860-75c06576ec81',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ErrorBoundary.jsx:componentDidCatch',message:'Error caught by boundary',data:{errorMessage:error?.message,errorName:error?.name,errorStack:error?.stack?.substring(0,1000),componentStack:info?.componentStack?.substring(0,1000)},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:['H1','H2','H3','H4','H5','H6','H7']})}).catch(()=>{});
    // #endregion
    console.error('[ErrorBoundary]', error, info);
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
      const errorMsg = this.state.error?.message || "Unknown error";
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <p className="font-semibold">Something went wrong.</p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs mt-1 font-mono">{errorMsg}</p>
          )}
          <button
            onClick={this.handleReset}
            className="mt-2 rounded-full border px-3 py-1 text-xs text-red-800 hover:bg-red-100 focus:outline-none focus:ring focus:ring-red-200"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
