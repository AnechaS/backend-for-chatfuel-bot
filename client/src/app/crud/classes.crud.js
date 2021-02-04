import axios from "axios";

export const CLASSES_URL = "/classes";

export function getDocuments(className, config) {
  return axios.get(`${CLASSES_URL}/${className}`, config);
}

export function createDocument(className, data, config) {
  return axios.post(`${CLASSES_URL}/${className}`, data, config);
}

export function getDocumentById(className, id, config) {
  return axios.get(`${CLASSES_URL}/${className}/${id}`, config);
}

export function updateDocument(className, id, data, config) {
  return axios.put(`${CLASSES_URL}/${className}/${id}`, data, config);
}

export function removeDocument(className, id) {
  return axios.delete(`${CLASSES_URL}/${className}/${id}`);
}
