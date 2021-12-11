import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';

import AppRouter from './AppRouter';
import ErrorFallback from './ErrorFallback';

import './index.css';
import './fonts.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {error: null};
  }

  static getDerivedStateFromError(error) {
    return {error};
  }

  render() {
    const {error} = this.state;
    if (error)
      return <ErrorFallback error={error} />;
    return this.props.children;
  }
}

ReactDOM.render(
  <ErrorBoundary>
    <AppRouter />
  </ErrorBoundary>,
  document.getElementById('root')
);
