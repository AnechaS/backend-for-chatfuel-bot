export const actionTypes = {
  PEOPLE_REQUESTED: "PEOPLE_REQUESTED"
};

const initialState = {
  count: 0,
  items: []
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PEOPLE_REQUESTED: {
      const { items, count } = action.payload;
      return { items, count };
    }

    default: {
      return state;
    }
  }
};

export const actions = {
  requestedPeoples: ({ items, count }) => ({
    type: actionTypes.PEOPLE_REQUESTED,
    payload: { items, count }
  })
};
