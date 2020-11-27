import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider, /*useDispatch*/ } from 'react-redux';
import store from "./redux/store";
// import { agregar_sesion } from './actions/index';

/* const store = createStore(todosLosReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()); */

// useDispatch(navegar('GALERIA_ARTICULOS'));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
