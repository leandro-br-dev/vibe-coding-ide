import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
          <h1 style={{ color: '#dc3545', marginBottom: '1rem' }}>
            Something went wrong
          </h1>
          <div style={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #dee2e6',
            borderRadius: '0.375rem',
            padding: '1.5rem',
            textAlign: 'left',
            maxWidth: '600px',
            width: '100%',
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#495057' }}>Error Details:</h3>
            <pre style={{ 
              fontSize: '0.875rem', 
              color: '#6c757d',
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              borderRadius: '0.25rem',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
            }}>
              {this.state.error && this.state.error.toString()}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
          <button 
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}