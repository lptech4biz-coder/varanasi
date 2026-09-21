import { Component, type ErrorInfo, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches unexpected runtime errors anywhere in the component tree below it
 * and shows a recoverable fallback instead of a blank white screen. This is
 * a safety net for genuine bugs/edge cases -- expected error states (missing
 * village, invalid input) are handled inline by the form itself, not here.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Unhandled error in valuation app:', error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className={styles.wrap} role="alert">
          <h1>कुछ गड़बड़ हो गयी / Something went wrong</h1>
          <p>
            कृपया पेज पुनः लोड करें। यदि समस्या बनी रहे तो अपनी भरी गयी जानकारी दोबारा दर्ज करें।
            <br />
            Please reload the page. If the problem persists, re-enter your details.
          </p>
          <button className={styles.reloadButton} onClick={this.handleReload}>
            पुनः लोड करें / Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
