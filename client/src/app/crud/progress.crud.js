import axios from "axios";

export const PROGRESS_URL = "/progresses";

export function getProgress(params) {
  return axios.get(PROGRESS_URL, { params });
}

export function getProgressById(id) {
  return axios.get(`${PROGRESS_URL}/${id}`);
}

export function createProgress(object = {}) {
  return axios.post(PROGRESS_URL, object);
}

export function updateProgress(id, object = {}) {
  return axios.put(`${PROGRESS_URL}/${id}`, object);
}

export function deleteProgress(id) {
  return axios.delete(`${PROGRESS_URL}/${id}`);
}
