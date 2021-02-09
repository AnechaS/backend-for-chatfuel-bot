import axios from "axios";

export const CLASSES_URL = "/classes";

export function getDocuments(modelName, config) {
  return axios.get(`${CLASSES_URL}/${modelName}`, config);
}

export function createDocument(modelName, data, config) {
  return axios.post(`${CLASSES_URL}/${modelName}`, data, config);
}

export function getDocumentById(modelName, id, config) {
  return axios.get(`${CLASSES_URL}/${modelName}/${id}`, config);
}

export function updateDocument(modelName, id, data, config) {
  return axios.put(`${CLASSES_URL}/${modelName}/${id}`, data, config);
}

export function removeDocument(modelName, id) {
  return axios.delete(`${CLASSES_URL}/${modelName}/${id}`);
}
