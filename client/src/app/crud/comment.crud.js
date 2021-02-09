import axios from "axios";

export const COMMENT_URL = "/comments";

export function getComment(params) {
  return axios.get(COMMENT_URL, { params });
}

export function getCommentById(id) {
  return axios.get(`${COMMENT_URL}/${id}`);
}

export function createComment(object = {}) {
  return axios.post(COMMENT_URL, object);
}

export function updateComment(id, object = {}) {
  return axios.put(`${COMMENT_URL}/${id}`, object);
}

export function deleteComment(id) {
  return axios.delete(`${COMMENT_URL}/${id}`);
}
