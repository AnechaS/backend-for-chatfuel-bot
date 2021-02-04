import axios from "axios";

export const TOTAL_CHATBOT_USERS_URL = "/stats/totalChatbotUsers";
export const EVENT_CHATBOT_USERS_URL = "/stats/eventChatbotUsers";
export const UASGE_CHATBOT_URL = "/stats/usageChatbot";
export const CHATBOT_URLS_URL = "/stats/chatbotUrls";

export function getTotalChatbotUsers(startDate, endDate) {
  return axios.get(TOTAL_CHATBOT_USERS_URL, {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });
}

export function getEventChatbotUsers(startDate, endDate) {
  return axios.get(EVENT_CHATBOT_USERS_URL, {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });
}

export function getUsageChatbot(startDate, endDate) {
  return axios.get(UASGE_CHATBOT_URL, {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });
}

export function getChatbotUrls(startDate, endDate) {
  return axios.get(CHATBOT_URLS_URL, {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });
}

