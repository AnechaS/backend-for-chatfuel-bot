import {
  LOGIN_URL,
  LOGOUT_URL,
  USER_URL,
  ME_URL,
} from "../../app/crud/users.crud";

export default function mockAuth(mock) {
  mock.onPost(LOGIN_URL).reply(({ data }) => {
    const { email, password } = JSON.parse(data);

    if (email && password) {
      const user = users.find(
        (x) =>
          x.email.toLowerCase() === email.toLowerCase() &&
          x.password === password
      );

      if (user) {
        return [200, { ...user, password: undefined }];
      }
    }

    return [400];
  });

  mock.onPost(LOGOUT_URL).reply(() => {
    return [203, {}];
  });

  mock.onPut(new RegExp(`${USER_URL}/\\w`)).reply((config) => {
    const id = parseInt(config.url.split("/").pop());
    const data = JSON.parse(config.data);
    const i = Object.keys(data)[0];
    const user = users.find(({ _id }) => _id === id);
    user[i] = data[i];
    return [200, { ...user, password: undefined }];
  });

  mock.onGet(ME_URL).reply(({ headers }) => {
    const user = users.find(
      ({ sessionToken }) => sessionToken === headers["X-Session-Token"]
    );
    if (user) {
      return [200, { ...user, password: undefined }];
    }

    return [401, { message: "Unauthorized" }];
  });
}

const users = [
  {
    _id: 1,
    name: "admin",
    password: "demo",
    email: "admin@demo.com",
    sessionToken: "8f3ae836da744329a6f93bf20594b5cc",
    role: "admin",
  },
  {
    _id: 2,
    name: "user",
    password: "demo",
    email: "user@demo.com",
    sessionToken: "6829bba69dd3421d8762-991e9e806dbf",
    role: "readWrite",
  },
];
