import { persistReducer, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { get } from "lodash";
import * as routerHelpers from "../../router/RouterHelpers";
import { getUserByToken } from "../../crud/users.crud";

export const actionTypes = {
  LOGIN_USER: "LOGIN_USER",
  LOGOUT_USER: "LOGOUT_USER",
  LOAD_USER: "LOAD_USER",
  UPDATE_USER: "UPDATE_USER",
  CHANGE_AUTH_TOKEN: "CHANGE_AUTH_TOKEN",
};

const initialAuthState = {
  user: undefined,
  authToken: undefined,
};

export const reducer = persistReducer(
  {
    storage,
    key: "auth",
    whitelist: ["user", "authToken"],
  },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.LOGIN_USER: {
        const { authToken, user } = action.payload;
        return { authToken, user };
      }
      case actionTypes.LOGOUT_USER: {
        routerHelpers.forgotLastLocation();
        return initialAuthState;
      }
      case actionTypes.LOAD_USER: {
        return { ...state, user: action.payload };
      }
      case actionTypes.UPDATE_USER: {
        const { field, value } = action.payload;
        return {
          ...state,
          user: {
            ...state.user,
            [field]: value,
          },
        };
      }
      case actionTypes.CHANGE_AUTH_TOKEN: {
        return {
          ...state,
          authToken: action.payload,
        };
      }
      default: {
        return state;
      }
    }
  }
);

export const actions = {
  login: (authToken, user) => ({
    type: actionTypes.LOGIN_USER,
    payload: { authToken, user },
  }),
  logout: () => ({ type: actionTypes.LOGOUT_USER }),
  loadUser: (payload) => ({
    type: actionTypes.LOAD_USER,
    payload,
  }),
  updateUser: (field, value) => ({
    type: actionTypes.UPDATE_USER,
    payload: { field, value },
  }),
  changeToken: (payload) => ({
    type: actionTypes.CHANGE_AUTH_TOKEN,
    payload,
  }),
};

export function* saga() {
  yield takeLatest(
    ({ type, key, payload }) =>
      type === REHYDRATE && key === "auth" && get(payload, "authToken"),
    function* userLoaded() {
      try {
        const { data } = yield getUserByToken();
        delete data.sessionToken;
        yield put(actions.loadUser(data));
      } catch (error) {
        yield put(actions.logout());
      }
    }
  );
}
