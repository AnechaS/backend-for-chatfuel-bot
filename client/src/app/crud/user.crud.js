import axios from "axios";

export const USER_URL = "/users";
export const ME_URL = "/users/me";

export function getUser(params) {
  return axios.get(USER_URL, { params });
}

export function getUserById(id) {
  return axios.get(`${USER_URL}/${id}`);
}

export function createUser(object) {
  return axios.post(USER_URL, object);
}

export function getUserByToken() {
  return axios.get(ME_URL);
}

export function updateUser(id, object = {}) {
  return axios.put(`${USER_URL}/${id}`, object);
}

export function deleteUser(id) {
  return axios.delete(`${USER_URL}/${id}`);
}
