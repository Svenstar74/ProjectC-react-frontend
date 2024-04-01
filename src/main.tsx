import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import './index.css'

import * as Sentry from "@sentry/react";

import { Provider } from 'react-redux'
import { store } from './store/redux/store';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: "https://73cae18d7127695229f0f397e099064a@o4506712580161536.ingest.sentry.io/4506712582389760",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

const maintanance = false;
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    {!maintanance && <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </QueryClientProvider>}

    {maintanance && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2 style={{ textAlign: 'center' }}>Scheduled maintanance for about 15 minutes</h2>
    </div>}
  </>,
);
