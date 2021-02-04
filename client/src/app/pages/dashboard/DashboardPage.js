import React, { PureComponent } from "react";
import { connect } from "react-redux";
import moment from "moment";
import clsx from "clsx";
import { isEmpty, get } from "lodash";
import SubHeader from "../../partials/layout/SubHeader";
import KTContent from "../../../_metronic/layout/KtContent";
import * as statistics from "../../store/ducks/statistics.duck";
import {
  getTotalChatbotUsers,
  getEventChatbotUsers,
  getUsageChatbot,
  getChatbotUrls,
} from "../../crud/stats.crud";

import {
  Portlet,
  PortletBody,
  PortletHeader,
} from "../../partials/content/Portlet";
import BlockLoading from "../../partials/content/BlockLoading";
import DailyNewChatbotUsers from "../../widgets/DailyNewChatbotUsers";
import ChatbotUserActivities from "../../widgets/ChatbotUserActivities";
import ListColumns from "../../widgets/ListColumns";

class DashboardPage extends PureComponent {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this._startDate = moment().subtract(1, "week");
    this._endDate = moment();
    this._isSameInitalDate = (startDate, endDate) => {
      return (
        moment(this._startDate.format("YYYY-MM-DD")).isSame(
          startDate.format("YYYY-MM-DD")
        ) &&
        moment(this._endDate.format("YYYY-MM-DD")).isSame(
          endDate.format("YYYY-MM-DD")
        )
      );
    };

    this.state = {
      startDate: this._startDate,
      endDate: this._endDate,
      unit: "week",

      totalChatbotUsers: {
        spinning: isEmpty(props.totalChatbotUsers),
        data: props.totalChatbotUsers,
        error: false,
      },
      eventChatbotUsers: {
        spinning: isEmpty(props.eventChatbotUsers),
        data: props.eventChatbotUsers,
        error: false,
      },
      popularUsageInChatbot: {
        spinning: isEmpty(props.popularUsageInChatbot),
        data: props.popularUsageInChatbot,
        error: false,
      },
      popularURLsInChatbot: {
        spinning: isEmpty(props.popularURLsInChatbot),
        data: props.popularURLsInChatbot,
        error: false,
      },
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadData = (isSetSpinning) => {
    this.requestTotalChatbotUsers(isSetSpinning);
    this.requestEventChatbotUsers(isSetSpinning);
    this.requestUsageChatbot(isSetSpinning);
    this.requestUrlStats(isSetSpinning);
  };

  requestTotalChatbotUsers = (isSetSpinning = false) => {
    const { startDate, endDate } = this.state;
    const startDateString = startDate.format("YYYY-MM-DD");
    const endDateString = endDate.format("YYYY-MM-DD");

    this.setState(({ totalChatbotUsers }) => {
      if (!totalChatbotUsers.error && !isSetSpinning) {
        return {};
      }

      return {
        totalChatbotUsers: {
          ...totalChatbotUsers,
          spinning: isSetSpinning || totalChatbotUsers.spinning,
          error: false,
        },
      };
    });

    getTotalChatbotUsers(startDateString, endDateString)
      .then(({ data }) => {
        if (this._isMounted) {
          this.setState((prevState) => ({
            totalChatbotUsers: {
              ...prevState.totalChatbotUsers,
              data,
              spinning: false,
            },
          }));

          if (this._isSameInitalDate(startDate, endDate)) {
            this.props.loadTotalChatbotUsers(data);
          }
        }
      })
      .catch((/* error */) => {
        if (this._isMounted) {
          this.setState((prevState) => ({
            totalChatbotUsers: {
              ...prevState.totalChatbotUsers,
              spinning: false,
              error: true,
            },
          }));
        }
      });
  };

  requestEventChatbotUsers = (isSetSpinning = false) => {
    const { startDate, endDate } = this.state;
    const startDateString = startDate.format("YYYY-MM-DD");
    const endDateString = endDate.format("YYYY-MM-DD");

    this.setState(({ eventChatbotUsers }) => {
      if (!eventChatbotUsers.error && !isSetSpinning) {
        return {};
      }

      return {
        eventChatbotUsers: {
          ...eventChatbotUsers,
          spinning: isSetSpinning || eventChatbotUsers.spinning,
          error: false,
        },
      };
    });

    getEventChatbotUsers(startDateString, endDateString)
      .then(({ data }) => {
        if (this._isMounted) {
          this.setState(({ eventChatbotUsers }) => ({
            eventChatbotUsers: {
              ...eventChatbotUsers,
              data,
              spinning: false,
            },
          }));

          if (this._isSameInitalDate(startDate, endDate)) {
            this.props.loadEventChatbotUsers(data);
          }
        }
      })
      .catch((/* error */) => {
        if (this._isMounted) {
          this.setState(({ eventChatbotUsers }) => ({
            eventChatbotUsers: {
              ...eventChatbotUsers,
              spinning: false,
              error: true,
            },
          }));
        }
      });
  };

  requestUsageChatbot = (isSetSpinning = false) => {
    const { startDate, endDate } = this.state;
    const startDateString = startDate.format("YYYY-MM-DD");
    const endDateString = endDate.format("YYYY-MM-DD");

    this.setState(({ popularUsageInChatbot }) => {
      if (!popularUsageInChatbot.error && !isSetSpinning) {
        return {};
      }

      return {
        popularUsageInChatbot: {
          ...popularUsageInChatbot,
          spinning: isSetSpinning || popularUsageInChatbot.spinning,
          error: false,
        },
      };
    });

    getUsageChatbot(startDateString, endDateString)
      .then(({ data }) => {
        if (this._isMounted) {
          this.setState(({ popularUsageInChatbot }) => ({
            popularUsageInChatbot: {
              ...popularUsageInChatbot,
              data,
              spinning: false,
            },
          }));
          if (this._isSameInitalDate(startDate, endDate)) {
            this.props.loadPopularUsageInChatbot(data);
          }
        }
      })
      .catch((/* error */) => {
        if (this._isMounted) {
          this.setState(({ popularUsageInChatbot }) => ({
            popularUsageInChatbot: {
              ...popularUsageInChatbot,
              spinning: false,
              error: true,
            },
          }));
        }
      });
  };

  requestUrlStats = (isSetSpinning = false) => {
    const { startDate, endDate } = this.state;
    const startDateString = startDate.format("YYYY-MM-DD");
    const endDateString = endDate.format("YYYY-MM-DD");

    this.setState(({ popularURLsInChatbot }) => {
      if (!popularURLsInChatbot.error && !isSetSpinning) {
        return {};
      }

      return {
        popularURLsInChatbot: {
          ...popularURLsInChatbot,
          spinning: isSetSpinning || popularURLsInChatbot.spinning,
          error: false,
        },
      };
    });

    getChatbotUrls(startDateString, endDateString)
      .then(({ data }) => {
        if (this._isMounted) {
          this.setState(({ popularURLsInChatbot }) => ({
            popularURLsInChatbot: {
              ...popularURLsInChatbot,
              data,
              spinning: false,
            },
          }));

          if (this._isSameInitalDate(startDate, endDate)) {
            this.props.loadPopularURLsInChatbot(data);
          }
        }
      })
      .catch((error) => {
        if (this._isMounted) {
          this.setState(({ popularURLsInChatbot }) => ({
            popularURLsInChatbot: {
              ...popularURLsInChatbot,
              spinning: false,
              error: true,
            },
          }));
        }
      });
  };

  handleDatepickerChange = (startDate, endDate) => {
    this.setState(
      {
        unit: "",
        startDate,
        endDate,
      },
      () => {
        this.loadData(true);
      }
    );
  };

  handleUnitChange = (value) => {
    this.setState(
      {
        unit: value,
        startDate: moment().subtract(1, value),
        endDate: moment(),
      },
      () => {
        this.loadData(true);
      }
    );
  };

  render() {
    const {
      unit,
      startDate,
      endDate,
      totalChatbotUsers,
      eventChatbotUsers,
      popularUsageInChatbot,
      popularURLsInChatbot,
    } = this.state;

    return (
      <>
        <SubHeader>
          <SubHeader.Main title="Dashboard"></SubHeader.Main>
          <SubHeader.Toolbar>
            <SubHeader.Button
              className={clsx({ active: unit === "week" })}
              onClick={() => this.handleUnitChange("week")}
            >
              สัปดาห์
            </SubHeader.Button>
            <SubHeader.Button
              className={clsx({ active: unit === "month" })}
              onClick={() => this.handleUnitChange("month")}
            >
              เดือน
            </SubHeader.Button>
            <SubHeader.Button
              className={clsx({ active: unit === "quarter" })}
              onClick={() => this.handleUnitChange("quarter")}
            >
              ไตรมาส
            </SubHeader.Button>
            <SubHeader.Daterangepicker
              initialSettings={{
                startDate,
                endDate,
              }}
              onChange={this.handleDatepickerChange}
            />
          </SubHeader.Toolbar>
        </SubHeader>
        <KTContent>
          <div className="row">
            <div className="col-xl-12">
              <Portlet fluidHeight={true}>
                <PortletHeader title="สถิติผู้ใช้งานแชทบอทรายใหม่" />
                <PortletBody>
                  <div style={{ height: 348 }}>
                    <BlockLoading
                      spinning={totalChatbotUsers.spinning}
                      error={totalChatbotUsers.error}
                      onRefetch={() => {
                        this.requestTotalChatbotUsers(true);
                      }}
                    >
                      <DailyNewChatbotUsers data={totalChatbotUsers.data} />
                    </BlockLoading>
                  </div>
                </PortletBody>
              </Portlet>
            </div>

            <div className="col-xl-12">
              <Portlet fluidHeight={true}>
                <PortletHeader title="กิจกรรมของผู้ใช้งานแชทบอท" />
                <PortletBody>
                  <div style={{ height: 348 }}>
                    <BlockLoading
                      spinning={eventChatbotUsers.spinning}
                      error={eventChatbotUsers.error}
                      onRefetch={() => {
                        this.requestEventChatbotUsers(true);
                      }}
                    >
                      <ChatbotUserActivities data={eventChatbotUsers.data} />
                    </BlockLoading>
                  </div>
                </PortletBody>
              </Portlet>
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-3 col-md-6">
              <Portlet fluidHeight={true}>
                <PortletHeader title="Blocks ยอดนิยม" />
                <PortletBody fit>
                  <div style={{ height: 365 }}>
                    <BlockLoading
                      spinning={popularUsageInChatbot.spinning}
                      error={popularUsageInChatbot.error}
                      onRefetch={() => {
                        this.requestUsageChatbot(true);
                      }}
                    >
                      <ListColumns
                        columns={[
                          { name: "Block", field: "name" },
                          { name: "จำนวน", field: "value" },
                        ]}
                        data={get(popularUsageInChatbot.data, "blocks")}
                      />
                    </BlockLoading>
                  </div>
                </PortletBody>
              </Portlet>
            </div>
            <div className="col-xxl-3 col-md-6">
              <Portlet>
                <PortletHeader title="Bottons ยอดนิยม" />
                <PortletBody fit>
                  <div style={{ height: 365 }}>
                    <BlockLoading
                      spinning={popularUsageInChatbot.spinning}
                      error={popularUsageInChatbot.error}
                      onRefetch={() => {
                        this.requestUsageChatbot(true);
                      }}
                    >
                      <ListColumns
                        columns={[
                          { name: "Button", field: "name" },
                          { name: "จำนวน", field: "value" },
                        ]}
                        data={get(popularUsageInChatbot.data, "button pressed")}
                      />
                    </BlockLoading>
                  </div>
                </PortletBody>
              </Portlet>
            </div>
            <div className="col-xxl-3 col-md-6">
              <Portlet fluidHeight={true}>
                <PortletHeader title="Inputs ที่ผู้ใช่ส่งมาโดย AI ไม่รู้จัก" />
                <PortletBody fit>
                  <div style={{ height: 365 }}>
                    <BlockLoading
                      spinning={popularUsageInChatbot.spinning}
                      error={popularUsageInChatbot.error}
                      onRefetch={() => {
                        this.requestUsageChatbot(true);
                      }}
                    >
                      <ListColumns
                        columns={[
                          { name: "ข้อความ", field: "name" },
                          { name: "จำนวน", field: "value" },
                        ]}
                        data={get(popularUsageInChatbot.data, "user input")}
                      />
                    </BlockLoading>
                  </div>
                </PortletBody>
              </Portlet>
            </div>
            <div className="col-xxl-3 col-md-6">
              <Portlet fluidHeight={true}>
                <PortletHeader title="URLs ยอดนิยม" />
                <PortletBody fit>
                  <div style={{ height: 365 }}>
                    <BlockLoading
                      spinning={popularURLsInChatbot.spinning}
                      error={popularURLsInChatbot.error}
                      onRefetch={() => {
                        this.requestUrlStats(true);
                      }}
                    >
                      <ListColumns
                        columns={[
                          { name: "Url", field: "url" },
                          { name: "จำนวน", field: "count" },
                        ]}
                        data={popularURLsInChatbot.data}
                      />
                    </BlockLoading>
                  </div>
                </PortletBody>
              </Portlet>
            </div>
          </div>
        </KTContent>
      </>
    );
  }
}

const mapStateToProps = ({ statistics }) => statistics;

const mapDispatchToProps = statistics.actions;

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
