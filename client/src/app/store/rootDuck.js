import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import { metronic } from "../../_metronic";
import * as auth from "./ducks/auth.duck";
import * as schemas from "./ducks/schemas.duck";
import * as statistics from "./ducks/statistics.duck";
import * as peoples from "./ducks/peoples.duck";

export const rootReducer = combineReducers({
  builder: metronic.builder.reducer,
  auth: auth.reducer,
  schemas: schemas.reducer,
  statistics: statistics.reducer,
  peoples: peoples.reducer,
});

export function* rootSaga() {
  yield all([auth.saga(), schemas.saga()]);
}