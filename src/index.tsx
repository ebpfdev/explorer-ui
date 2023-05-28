import React from 'react';
import {Provider} from "react-redux";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {BaseStyles, ThemeProvider} from '@primer/react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {store} from "./store/root";
import {ProgramPage} from "./pages/program/ProgramPage";
import {MapPage} from "./pages/map/MapPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "program/:programId",
        element: <ProgramPage />,
      },
      {
        path: "map/:mapId",
        element: <MapPage />,
      },
    ],
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function getConfig(): Promise<{agent_url?: string}> {
  return fetch('/config.json')
    .then(
      response => response.json()
    )
    .catch(error => {
      console.log('Couldn\'t fetch config', error);
      return {};
    });
}

getConfig()
  .then(
    (config) => {
      const client = new ApolloClient({
        uri: (config.agent_url ?? 'http://localhost:8080') + '/query',
        cache: new InMemoryCache(),
      })

      root.render(
        <ThemeProvider>
          <ApolloProvider client={client}>
            <Provider store={store}>
              <React.StrictMode>
                <RouterProvider router={router} />
              </React.StrictMode>
            </Provider>
          </ApolloProvider>
        </ThemeProvider>
      );
    }
  )

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();
