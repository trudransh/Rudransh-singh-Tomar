import { Component, ReactNode } from 'react';

// If WebGL is unavailable or the scene throws, drop the 3D layer entirely and
// render the DOM fallback — the hero typography still reads on its own.
export class SceneBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
