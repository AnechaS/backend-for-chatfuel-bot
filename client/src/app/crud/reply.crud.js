import axios from "axios";

export const REPLY_URL = "/replies";

export function getReply(params) {
  return axios.get(REPLY_URL, { params });
}

export function getReplyById(id) {
  return axios.get(`${REPLY_URL}/${id}`);
}

export function createReply(object = {}) {
  return axios.post(REPLY_URL, object);
}

export function updateReply(id, object = {}) {
  return axios.put(`${REPLY_URL}/${id}`, object);
}

export function deleteReply(id) {
  return axios.delete(`${REPLY_URL}/${id}`);
}
