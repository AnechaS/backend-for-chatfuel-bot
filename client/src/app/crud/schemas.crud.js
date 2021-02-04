import axios from "axios";

export const SCHEMAS_URL = "/schemas";

export function getSchemas() {
    return axios.get(SCHEMAS_URL);
}

export function getSchema(schema) {
    return axios.get(`${SCHEMAS_URL}/${schema}`);
}