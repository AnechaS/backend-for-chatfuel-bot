import axios from "axios";

export const PURGE_URL = "/purge"

export function removeAllDocuments(modelName, config) {
    return axios.delete(`${PURGE_URL}/${modelName}`, config);
}