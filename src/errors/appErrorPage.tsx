import * as React from "react";
import AlertBox from "../components/common/Alerts/Alerts";
import ContactForm from "../components/User/ContactForm/ContactForm";

type CompState = {
  hasError: boolean;
  errorContent?: string;
};

const CHUNK_LOAD_RETRY_KEY = "chunk-load-retry";
const CHUNK_LOAD_RETRY_WINDOW_KEY = "chunk-load-retry-at:";
const CHUNK_LOAD_RETRY_TTL = 30000;

export function isChunkLoadError(error: Error) {
  return (
    error.name === "ChunkLoadError" ||
    /Loading chunk \S+ failed/i.test(error.message)
  );
}

function shouldReloadForChunkError() {
  try {
    const lastRetry = Number(sessionStorage.getItem(CHUNK_LOAD_RETRY_KEY));
    if (lastRetry && Date.now() - lastRetry < CHUNK_LOAD_RETRY_TTL) {
      return false;
    }
    sessionStorage.setItem(CHUNK_LOAD_RETRY_KEY, String(Date.now()));
    return true;
  } catch {
    const lastRetry = window.name.startsWith(CHUNK_LOAD_RETRY_WINDOW_KEY)
      ? Number(window.name.replace(CHUNK_LOAD_RETRY_WINDOW_KEY, ""))
      : 0;
    if (lastRetry && Date.now() - lastRetry < CHUNK_LOAD_RETRY_TTL) {
      return false;
    }
    window.name = CHUNK_LOAD_RETRY_WINDOW_KEY + Date.now();
    return true;
  }
}

function clearChunkLoadRetry() {
  try {
    sessionStorage.removeItem(CHUNK_LOAD_RETRY_KEY);
  } catch {
    if (window.name.startsWith(CHUNK_LOAD_RETRY_WINDOW_KEY)) {
      window.name = "";
    }
  }
}

class ErrorBoundary extends React.Component {
  state: CompState;
  props: any;
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, errorContent: "" };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (isChunkLoadError(error) && shouldReloadForChunkError()) {
      window.location.reload();
      return;
    }

    if (!isChunkLoadError(error)) {
      clearChunkLoadRetry();
    }

    this.setState({
      hasError: this.state.hasError,
      errorContent: error.message,
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <AlertBox
            message="Something went wrong. If you’d like, please use the form below to let us know about this error."
            type="danger"
          />
          <ContactForm
            appErrorUrl={window.location.href}
            appErrorContent={this.state.errorContent}
          />
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
