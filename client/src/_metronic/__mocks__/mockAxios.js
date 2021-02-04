import MockAdapter from "axios-mock-adapter";
import mockUsers from "./mockUsers";
import mockStats from "./mockStats";
import mockClassPeople from "./mockClassPeople";
import mockSchemas from "./mockSchemas";

export default function mockAxios(axios) {
  const mock = new MockAdapter(axios);

  mockUsers(mock);
  mockStats(mock);
  mockClassPeople(mock);
  mockSchemas(mock);

  return mock;
}