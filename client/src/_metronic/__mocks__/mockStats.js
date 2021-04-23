import moment from "moment";
import {
  TOTAL_CHATBOT_USERS_URL,
  EVENT_CHATBOT_USERS_URL,
  UASGE_CHATBOT_URL,
  CHATBOT_URLS_URL,
} from "../../app/crud/stats.crud";

export default function mockStats(mock) {
  mock.onGet(TOTAL_CHATBOT_USERS_URL).reply((config) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          200,
          {
            x: [
              moment()
                .subtract(6, "day")
                .format("YYYY-MM-DD"),
              moment()
                .subtract(5, "day")
                .format("YYYY-MM-DD"),
              moment()
                .subtract(4, "day")
                .format("YYYY-MM-DD"),
              moment()
                .subtract(3, "day")
                .format("YYYY-MM-DD"),
              moment()
                .subtract(2, "day")
                .format("YYYY-MM-DD"),
              moment()
                .subtract(1, "day")
                .format("YYYY-MM-DD"),
              moment().format("YYYY-MM-DD"),
            ],
            y: {
              "Total New users": [5, 1, 14, 17, 17, 12, 25],
              "New Blocked users": [0, 0, 0, 0, 0, 0, 0],
              "Total users": [3642, 3643, 3657, 3674, 3691, 3703, 3728],
              "Blocked users": [7, 7, 7, 7, 7, 7, 7],
            },
          },
        ]);
      }, 3000);
    });
  });

  mock.onGet(EVENT_CHATBOT_USERS_URL).reply((config) => {
    return [
      200,
      {
        x: [
          moment()
            .subtract(6, "day")
            .format("YYYY-MM-DD"),
          moment()
            .subtract(5, "day")
            .format("YYYY-MM-DD"),
          moment()
            .subtract(4, "day")
            .format("YYYY-MM-DD"),
          moment()
            .subtract(3, "day")
            .format("YYYY-MM-DD"),
          moment()
            .subtract(2, "day")
            .format("YYYY-MM-DD"),
          moment()
            .subtract(1, "day")
            .format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD"),
        ],
        y: {
          "input from user received": [
            349.0,
            355.0,
            365.0,
            379.0,
            362.0,
            353.0,
            448.0,
          ],
          "broadcast read": [184.0, 177.0, 190.0, 194.0, 179.0, 179.0, 171.0],
          "user creation info": [5.0, 7.0, 8.0, 13.0, 5.0, 5.0, 55.0],
          "ym:ce:users": [351.0, 358.0, 366.0, 382.0, 363.0, 354.0, 451.0],
        },
      },
    ];
  });

  mock.onGet(UASGE_CHATBOT_URL).reply((config) => {
    return [
      200,
      {
        "button pressed": [
          {
            name: "โอเค 😁✌",
            value: 329,
          },
          {
            name: "กดตรงนี้ 👋",
            value: 162,
          },
          {
            name: "ทราบแล้ว",
            value: 159,
          },
          {
            name: "ภาคใต้",
            value: 156,
          },
          {
            name: "ไปดูกันเลย",
            value: 135,
          },
          {
            name: "คุยเลย!",
            value: 134,
          },
          {
            name: "จบแล้ว",
            value: 130,
          },
          {
            name: "โอเค 👌",
            value: 125,
          },
          {
            name: "ไม่ใช่",
            value: 111,
          },
          {
            name: "ถูกทุกข้อ",
            value: 105,
          },
          {
            name: "เริ่มคุยวันที่ 11 ❤️",
            value: 89,
          },
          {
            name: "เริ่มคุยวันที่8 ",
            value: 88,
          },
          {
            name: "เล่นเกมส์กัน✊",
            value: 88,
          },
          {
            name: "ได้เลย",
            value: 87,
          },
          {
            name: "🚗 ไปดูกันเล้ย",
            value: 87,
          },
          {
            name: "เริ่มคุยวันที่ 10 ❤️",
            value: 86,
          },
          {
            name: "เริ่มคุยวันที่ 12 ❤️",
            value: 86,
          },
        ],
        blocks: [
          {
            name: "Welcome Message",
            value: 364,
          },
          {
            name: "Game",
            value: 170,
          },
          {
            name: "Question1",
            value: 170,
          },
          {
            name: "Question2",
            value: 170,
          },
          {
            name: "Question3",
            value: 170,
          },
          {
            name: "Question4",
            value: 170,
          },
          {
            name: "Question5",
            value: 170,
          },
          {
            name: "Score",
            value: 170,
          },
        ],
        "user input": [
          {
            name: "โอเค",
            value: 33,
          },
          {
            name: "ค่ะ",
            value: 28,
          },
          {
            name: "ข้อมูลฟันพุ",
            value: 25,
          },
          {
            name: "ขอเบอร์คุณหมอ",
            value: 10,
          },
          {
            name: "ลูกไม่อยากกินข้าว",
            value: 3,
          },
          {
            name: "เยี่ยม",
            value: 3,
          },
        ],
      },
    ];
  });

  mock.onGet(CHATBOT_URLS_URL).reply((config) => {
    return [
      200,
      [
        {
          url: "https://www.facebook.com/Funsuayfapha/",
          count: 2,
        },
      ],
    ];
  });
}
