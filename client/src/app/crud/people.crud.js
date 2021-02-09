import axios from "axios";

export const PEOPLE_URL = "/peoples";

export function getPeople(params) {
  return axios.get(PEOPLE_URL, { params });
}

export function getPeopleById(id) {
  return axios.get(`${PEOPLE_URL}/${id}`);
}

export function getProvinceOfPeople(params) {
  return axios.get(`${PEOPLE_URL}/provinces`, { params });
}

export function getDistrictOfPeople(params) {
  return axios.get(`${PEOPLE_URL}/districts`, { params });
}

export function createPeople(object = {}) {
  return axios.post(PEOPLE_URL, object);
}

export function updatePeople(id, object = {}) {
  return axios.put(`${PEOPLE_URL}/${id}`, object);
}

export function deletePeople(id) {
  return axios.delete(`${PEOPLE_URL}/${id}`);
}
