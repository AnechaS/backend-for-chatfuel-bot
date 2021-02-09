import { LOGIN_URL } from "../../app/crud/auth.crud";
import userTableMock from "./userTableMock";

export default function mockAuth(mock) {
  mock.onPost(LOGIN_URL).reply(({ data }) => {
    const { email, password } = JSON.parse(data);

    if (email && password) {
      const user = userTableMock.find(
        x =>
          x.email.toLowerCase() === email.toLowerCase() &&
          x.password === password
      );

      if (user) {
        return [200, { ...user, password: undefined }];
      }
    }

    return [400];
  });
}
