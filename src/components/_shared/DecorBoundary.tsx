import { Component, type ReactNode } from "react";

export interface DecorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface DecorBoundaryState {
  failed: boolean;
}

export class DecorBoundary extends Component<DecorBoundaryProps, DecorBoundaryState> {
  state: DecorBoundaryState = { failed: false };

  static getDerivedStateFromError(): DecorBoundaryState {
    return { failed: true };
  }

  render() {
    const { children, fallback = null } = this.props;
    return this.state.failed ? fallback : children;
  }
}
