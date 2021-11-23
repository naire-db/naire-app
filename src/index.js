import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';

import './index.css';
import AppRouter from './AppRouter';

ReactDOM.render(
  <AppRouter />,
  // <React.StrictMode>
  // </React.StrictMode>,
  document.getElementById('root')
);
