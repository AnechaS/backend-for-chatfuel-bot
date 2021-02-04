import { persistReducer, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { isEqual, get } from "lodash";
import * as auth from "./auth.duck";
import { put, takeLatest, select, delay, fork, take } from "redux-saga/effects";
import { metronic } from "../../../_metronic";

export const actionTypes = {
  LOAD_SCHEMAS: "LOAD_SCHEMAS",
};

const initialState = {
  items: [],
};

export const reducer = persistReducer(
  {
    storage,
    key: "schemas",
  },
  (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.LOAD_SCHEMAS: {
        return { items: action.payload.slice() };
      }
      case auth.actionTypes.LOGOUT_USER: {
        return initialState;
      }
      default: {
        return state;
      }
    }
  }
);

export const actions = {
  loadSchemas: (payload) => ({
    type: actionTypes.LOAD_SCHEMAS,
    payload,
  }),
};

function addSubmenuDatabaseToAside(aside, schemas) {
  const submenu = schemas.map(({ className }) => ({
    title: className,
    root: true,
    page: `database/${className}`,
  }));

  const items = aside.items.map((item) => {
    if (item.title === "Database") {
      return {
        ...item,
        submenu,
      };
    }

    return item;
  });

  return { ...aside, items };
}

export function* saga() {
  yield fork(function*() {
    while (true) {
      yield take(({ type, key }) => type === REHYDRATE && key === "schemas");
      const prevSchemas = yield select((state) => state.schemas);

      yield take(actionTypes.LOAD_SCHEMAS);
      const { builder, schemas } = yield select((state) => ({
        builder: state.builder,
        schemas: state.schemas,
      }));

      if (isEqual(prevSchemas.items, schemas.items)) {
        return;
      }

      yield put(
        metronic.builder.actions.setMenuConfig({
          ...builder.menuConfig,
          aside: addSubmenuDatabaseToAside(
            builder.menuConfig.aside,
            schemas.items
          ),
        })
      );
    }
  });

  yield takeLatest(
    ({ type, key }) => type === REHYDRATE && key === "schemas",
    function* schemasLoaded({ payload }) {
      if (!get(payload, 'items', []).length) {
        return;
      }

      const builder = yield select((state) => state.builder);
      yield delay(250);
      yield put(
        metronic.builder.actions.setMenuConfig({
          ...builder.menuConfig,
          aside: addSubmenuDatabaseToAside(
            builder.menuConfig.aside,
            payload.items
          ),
        })
      );
    }
  );
}
