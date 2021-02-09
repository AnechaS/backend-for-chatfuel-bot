import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { getUserByToken } from "../../crud/user.crud";
import * as routerHelpers from "../../router/RouterHelpers";

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API",
  RefreshToken: "[Refresh Token] Auth API"
};

const initialAuthState = {
  user: undefined,
  authToken: undefined
};

export const reducer = persistReducer(
  {
    storage,
    key: "auth",
    whitelist: ["user", "authToken"]
  },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.Login: {
        const { authToken } = action.payload;
        return { authToken, user: undefined };
      }

      case actionTypes.Register: {
        const { authToken } = action.payload;
        return { authToken, user: undefined };
      }

      case actionTypes.Logout: {
        routerHelpers.forgotLastLocation();
        return initialAuthState;
      }

      case actionTypes.UserLoaded: {
        const { user } = action.payload;
        return {
          ...state,
          user: {
            ...state.user,
            ...user
          }
        };
      }

      case actionTypes.RefreshToken: {
        const { authToken } = action.payload;
        return { ...state, authToken };
      }

      default: {
        return state;
      }
    }
  }
);

export const actions = {
  login: (authToken, user) => ({
    type: actionTypes.Login,
    payload: { authToken, user }
  }),
  register: authToken => ({
    type: actionTypes.Register,
    payload: { authToken }
  }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: user => ({ type: actionTypes.UserRequested, payload: { user } }),
  fulfillUser: user => ({ type: actionTypes.UserLoaded, payload: { user } }),
  refreshToken: authToken => ({
    type: actionTypes.RefreshToken,
    payload: { authToken }
  })
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    const { data: user } = yield getUserByToken();
    yield put(actions.fulfillUser(user));
  });
}
