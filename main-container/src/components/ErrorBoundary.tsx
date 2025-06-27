import React from "react";

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    // You can log error or info here if needed
    console.log(error,info)
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>Something went wrong in the Music Library. Please try refreshing the page.</div>;
    }
    return this.props.children;
  }
}