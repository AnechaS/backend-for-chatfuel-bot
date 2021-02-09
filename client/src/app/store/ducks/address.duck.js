export const actionTypes = {
  AddressRequested: "ADDRESS_REQUESTED"
};

const initialState = [];

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AddressRequested: {
      return action.payload;
    }

    default: {
      return state;
    }
  }
};

export const actions = {
  requestAddress: data => ({
    type: actionTypes.AddressRequested,
    payload: data
  })
};
