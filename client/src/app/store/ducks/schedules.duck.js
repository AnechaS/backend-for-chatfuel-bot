export const actionTypes = {
  SchedulesRequested: "SCHEDULES_REQUESTED"
};

const initialState = [];

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SchedulesRequested: {
      return action.payload;
    }

    default: {
      return state;
    }
  }
};

export const actions = {
  requestSchedules: data => ({
    type: actionTypes.SchedulesRequested,
    payload: data
  })
};
