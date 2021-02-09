import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistStore } from "redux-persist";
import logger from "redux-logger";

import { rootReducer, rootSaga } from "./rootDuck";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);

/**
 * @see https://github.com/rt2zz/redux-persist#persiststorestore-config-callback
 * @see https://github.com/rt2zz/redux-persist#persistor-object
 */
export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export default store;
