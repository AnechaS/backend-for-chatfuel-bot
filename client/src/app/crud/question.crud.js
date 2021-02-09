import axios from "axios";

export const QUESTION_URL = "/questions";

export function getQuestion(params) {
  return axios.get(QUESTION_URL, { params });
}

export function getQuestionById(id) {
  return axios.get(`${QUESTION_URL}/${id}`);
}

export function createQuestion(object = {}) {
  return axios.post(QUESTION_URL, object);
}

export function updateQuestion(id, object = {}) {
  return axios.put(`${QUESTION_URL}/${id}`, object);
}

export function deleteQuestion(id) {
  return axios.delete(`${QUESTION_URL}/${id}`);
}
