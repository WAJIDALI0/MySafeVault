"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  title?: string;
  h?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class WidgetErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Widget error caught by boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className={`w-full bg-[#0b1120] border border-red-900/50 rounded-xl ${this.props.h || 'min-h-[250px]'} flex flex-col items-center justify-center p-6 text-center`}>
          <div className="w-10 h-10 rounded-full bg-red-900/20 flex items-center justify-center mb-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-sm font-medium text-slate-200 mb-1">
            {this.props.title ? `Failed to load ${this.props.title}` : 'Failed to load widget'}
          </h3>
          <p className="text-xs text-slate-500 max-w-[200px]">
            Please refresh the page to try again.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
