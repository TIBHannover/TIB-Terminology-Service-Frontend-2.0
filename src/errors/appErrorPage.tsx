import * as React from 'react';
import AlertBox from '../components/common/Alerts/Alerts';
import ContactForm from '../components/User/ContactForm/ContactForm';

type CompState = {
  hasError: boolean;
  errorContent?: string;
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
    this.setState({ hasError: this.state.hasError, errorContent: error.message });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <AlertBox message="Something went wrong. If you’d like, please use the form below to let us know about this error." type='danger' />
          <ContactForm appErrorUrl={window.location.href} appErrorContent={this.state.errorContent} />
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
