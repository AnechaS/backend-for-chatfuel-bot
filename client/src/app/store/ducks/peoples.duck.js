import * as auth from "./auth.duck";

export const actionTypes = {
  LOAD_PEOPLES: "LOAD_PEOPLES",
};

const initialState = {
  count: 0,
  rows: [],
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_PEOPLES: {
      return action.payload;
    }
    case auth.actionTypes.LOGOUT_USER: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export const actions = {
  loadPeoples: (rows, count) => ({
    type: actionTypes.LOAD_PEOPLES,
    payload: { rows, count },
  }),
};
