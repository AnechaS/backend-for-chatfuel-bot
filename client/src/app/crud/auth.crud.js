import axios from "axios";

export const LOGIN_URL = "/auth/login";
export const LOGOUT_URL = "/auth/logout";

export function login(email, password) {
  return axios.post(LOGIN_URL, { email, password });
}

export function logout() {
  return axios.post(LOGOUT_URL);
}
