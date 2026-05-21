import { Component } from 'react'

export default class HubErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="hub-gate">
          <div className="hub-gate__panel">
            <p className="hub-gate__tag">// ERROR</p>
            <h1 className="hub-gate__title">Hub failed to load</h1>
            <p className="hub-gate__error">{this.state.error.message}</p>
            <button
              type="button"
              className="hub-btn hub-btn--accent hub-btn--block"
              onClick={() => {
                localStorage.removeItem('thub-auth')
                document.cookie = 'thub-auth=; path=/; max-age=0'
                window.location.reload()
              }}
            >
              Clear session & reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
