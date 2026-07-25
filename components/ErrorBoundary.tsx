import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render/runtime errors anywhere in the component tree and shows a
 * minimal, on-brand fallback instead of a blank white page. Without this, a
 * single throwing component unmounts the entire app (React default behaviour).
 */
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Surface the real error in the console for debugging.
    console.error('App error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <h1 className="font-display text-2xl font-black mb-3">Klinika Dentare Medident</h1>
          <p className="text-slate-600 mb-8">
            Something went wrong loading this page. Please refresh — or reach us directly, we're happy to help.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="tel:+38349272803"
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold"
            >
              Call +383 49 272 803
            </a>
            <a
              href="https://wa.me/38349772307"
              className="w-full py-3 rounded-xl border border-slate-300 font-bold"
            >
              WhatsApp +383 49 772 307
            </a>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-xl text-slate-500 font-semibold"
            >
              Refresh page
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
