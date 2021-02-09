export default {
  header: {
    self: {},
    items: [
      {
        title: "Dashboards",
        root: true,
        alignment: "left",
        page: "dashboard",
        translate: "MENU.DASHBOARD"
      }
    ]
  },
  aside: {
    self: {},
    items: [
      {
        title: "Dashboard",
        root: true,
        icon: "flaticon2-graphic",
        page: "dashboard/2",
        translate: "MENU.DASHBOARD",
        bullet: "dot"
      },
      {
        title: "Peoples",
        root: true,
        icon: "flaticon2-group",
        page: "peoples"
      },
      {
        title: "Database",
        root: true,
        bullet: "line",
        icon: "flaticon2-cube",
        submenu: [
          {
            title: "Comment",
            root: true,
            page: "database/comment"
          },
          {
            title: "People",
            root: true,
            page: "database/people"
          },
          {
            title: "Progress",
            root: true,
            page: "database/progress"
          },
          {
            title: "Question",
            root: true,
            page: "database/question"
          },
          {
            title: "Quiz",
            root: true,
            page: "database/quiz"
          },
          {
            title: "Reply",
            root: true,
            page: "database/reply"
          },
          {
            title: "Schedule",
            root: true,
            page: "database/schedule"
          },
          {
            title: "User",
            root: true,
            page: "database/user"
          }
        ]
      },
      {
        title: "Help",
        root: true,
        bullet: "dot",
        icon: "flaticon2-start-up",
        page: "#"
      },
      { section: "Setting" },
      {
        title: "General",
        root: true,
        icon: "flaticon2-gear",
        page: "setting"
      }
    ]
  }
};
