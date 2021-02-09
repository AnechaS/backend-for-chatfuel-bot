import axios from "axios";

export const QUIZ_URL = "/quizzes";

export function getQuiz(params) {
  return axios.get(QUIZ_URL, { params });
}

export function getQuizById(id) {
  return axios.get(`${QUIZ_URL}/${id}`);
}

export function createQuiz(object = {}) {
  return axios.post(QUIZ_URL, object);
}

export function updateQuiz(id, object = {}) {
  return axios.put(`${QUIZ_URL}/${id}`, object);
}

export function deleteQuiz(id) {
  return axios.delete(`${QUIZ_URL}/${id}`);
}
