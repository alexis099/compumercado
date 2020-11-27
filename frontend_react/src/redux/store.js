import { createStore, combineReducers } from "redux";
import usuarioReducer from "./reducers/usuarioReducer.js"; 

const reducer = combineReducers({
  usuario: usuarioReducer
});
const store = createStore(reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
