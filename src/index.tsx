import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { store } from './store';
import App from './App';

const queryClient = new QueryClient();
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <QueryClientProvider client={queryClient}> */}
      <App />
      {/* </QueryClientProvider> */}
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
