import moment from "moment";
import { CLASSES_URL } from "../../app/crud/classes.crud";

export default function mockClassPeople(mock) {
  mock.onGet(`${CLASSES_URL}/People`).reply(({ params }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const response = {};

        const skip = Math.max((params.skip || 0) - 1, 0);
        const limit = params.limit + skip;
        response.results = peoples.slice(skip, limit);

        if (params.count === 1) {
          response.count = peoples.length;
        }

        resolve([200, response]);
      }, 500);
    });
  });

  /* mock.onGet(`${CLASSES_URL}/People`).reply(({ params }) => {
    return [401, { message: 'Unauthorized' }]
  }); */
}

const peoples = [
  {
    _id: "1",
    firstname: "Leanne",
    lastname: "Graham",
    gender: "male",
    pic:
      "https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_1.jpg",
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  },
  {
    _id: "2",
    firstname: "Ervin",
    lastname: "Howell",
    gender: "female",
    pic:
      "https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_2.jpg",
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  },
  {
    _id: "3",
    firstname: "Clementine",
    lastname: "Bauch",
    gender: "male",
    pic:
      "https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_3.jpg",
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  },
  {
    _id: "4",
    firstname: "Patricia",
    lastname: "Lebsack",
    gender: "female",
    pic:
      "https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_4.jpg",
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  },
  {
    _id: "5",
    firstname: "Chelsey",
    lastname: "Dietrich",
    gender: "male",
    pic:
      "https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_5.jpg",
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  },
  {
    _id: "6",
    firstname: "Mrs. Dennis",
    lastname: "Schulist",
    gender: "male",
    pic:
      "https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_6.jpg",
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  },
  {
    _id: "7",
    firstname: "Kurtis",
    lastname: "Weissnat",
    gender: "male",
    pic:
      "https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_7.jpg",
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  },
  {
    _id: "8",
    firstname: "Nicholas",
    lastname: "Runolfsdottir",
    gender: "female",
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  },
  {
    _id: "9",
    firstname: "Luca",
    lastname: "Doncic",
    gender: "male",
    pic:
      "https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_8.jpg",
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  },
  {
    _id: "10",
    firstname: "Anna",
    lastname: "Krox",
    gender: "male",
    pic:
      "https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_9.jpg",
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  },
  {
    _id: "11",
    firstname: "Jason",
    lastname: "Muller",
    gender: "female",
    pic:
      "https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_10.jpg",
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  },
  {
    _id: "12",
    firstname: "Charlie",
    lastname: "Stone",
    gender: "female",
    pic:
      "https://preview.keenthemes.com/metronic/theme/html/demo1/dist/assets/media/users/300_11.jpg",
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  },
];
