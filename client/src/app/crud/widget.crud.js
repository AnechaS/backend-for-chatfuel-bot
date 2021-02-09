import axios from "axios";

export const WIDGET_URL = "/widgets";

export function getWidgetById(id, params) {
  return axios.get(`${WIDGET_URL}/${id}`, { params });
}
