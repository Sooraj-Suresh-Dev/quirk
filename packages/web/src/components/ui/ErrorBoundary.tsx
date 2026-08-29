import { Component, ReactNode } from 'react';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-8">
          <div className="bg-soft-white rounded-card border-3 border-deep-black shadow-card p-8 max-w-md text-center">
            <AlertTriangle size={48} className="text-coral mx-auto mb-4" />
            <h2 className="font-mono text-lg font-bold text-charcoal mb-2">Something went wrong</h2>
            <p className="font-serif text-sm text-warm-gray mb-6">
              An unexpected error occurred. You can try again or reload the page.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={this.handleRetry}>
                TRY AGAIN
              </Button>
              <Button onClick={this.handleReload}>
                RELOAD PAGE
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
