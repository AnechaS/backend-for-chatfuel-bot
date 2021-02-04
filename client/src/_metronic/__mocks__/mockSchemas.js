import { SCHEMAS_URL } from "../../app/crud/schemas.crud";

export default function mockSchemas(mock) {
  mock.onGet(SCHEMAS_URL).reply((config) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([200, { results: schemas }]);
      }, 2000);
    });
  });
}

const schemas = [
  {
    className: "User",
    fields: {
      _id: {
        type: "ObjectId",
      },
      email: {
        type: "String",
      },
      password: {
        type: "String",
      },
      name: {
        type: "String",
      },
      pic: {
        type: "String",
      },
      createdAt: {
        type: "Date",
      },
      updatedAt: {
        type: "Date",
      },
    },
  },
  {
    className: "People",
    fields: {
      _id: {
        type: "ObjectId",
      },
      firstname: {
        type: "String",
      },
      lastname: {
        type: "String",
      },
      gender: {
        type: "String",
      },
      pic: {
        type: "String",
      },
      createdAt: {
        type: "Date",
      },
      updatedAt: {
        type: "Date",
      },
    },
  },
];
