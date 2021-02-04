import * as auth from "./auth.duck";

export const actionTypes = {
  LOAD_TOTAL_CHATBOT_USERS: "LOAD_TOTAL_CHATBOT_USERS",
  LOAD_EVENT_CHATBOT_USERS: "LOAD_EVENT_CHATBOT_USERS",
  LOAD_POPULAR_USAGE_IN_CHATBOT: "LOAD_POPULAR_USAGE_IN_CHATBOT",
  LOAD_POPULAR_URLS_IN_CHATBOT: "LOAD_POPULAR_URLS_IN_CHATBOT",
};

const initialState = {
  totalChatbotUsers: undefined,
  eventChatbotUsers: undefined,
  popularUsageInChatbot: undefined,
  popularURLsInChatbot: undefined,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_TOTAL_CHATBOT_USERS: {
      const newState = Object.assign({}, state);
      newState.totalChatbotUsers = action.payload;
      return newState;
    }
    case actionTypes.LOAD_EVENT_CHATBOT_USERS: {
      const newState = Object.assign({}, state);
      newState.eventChatbotUsers = action.payload;
      return newState;
    }
    case actionTypes.LOAD_POPULAR_USAGE_IN_CHATBOT: {
      const newState = Object.assign({}, state);
      newState.popularUsageInChatbot = action.payload;
      return newState;
    }
    case actionTypes.LOAD_POPULAR_URLS_IN_CHATBOT: {
      const newState = Object.assign({}, state);
      newState.popularURLsInChatbot = action.payload;
      return newState;
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
  loadTotalChatbotUsers: (data) => ({
    type: actionTypes.LOAD_TOTAL_CHATBOT_USERS,
    payload: data,
  }),
  loadEventChatbotUsers: (data) => ({
    type: actionTypes.LOAD_EVENT_CHATBOT_USERS,
    payload: data,
  }),
  loadPopularUsageInChatbot: (data) => ({
    type: actionTypes.LOAD_POPULAR_USAGE_IN_CHATBOT,
    payload: data,
  }),
  loadPopularURLsInChatbot: (data) => ({
    type: actionTypes.LOAD_POPULAR_URLS_IN_CHATBOT,
    payload: data,
  }),
};
