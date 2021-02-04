import axios from "axios";

export const SESSION_URL = "/sessions";

export function cleanSessions(object = {}) {
  return axios.put(`${SESSION_URL}/me/clean`, object);
}
