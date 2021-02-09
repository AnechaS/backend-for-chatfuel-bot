// TODO: calculat score quiz

import React, { Component } from "react";
import { groupBy, round } from "lodash";
import moment from "moment";
import SubHeader from "../../partials/layout/SubHeader";
import KTContent from "../../../_metronic/layout/KtContent";
import { getPeopleById } from "../../crud/people.crud";
import { getSchedule } from "../../crud/schedule.crud";
import { getReply } from "../../crud/reply.crud";
import { getQuiz } from "../../crud/quiz.crud";
import { ProfileCard } from "../../widgets/general/ProfileCard";
import { REPLY_SUBMITTED_TYPES } from "../../utils/constants";
import {
  Portlet,
  PortletHeader,
  PortletBody,
  PortletFooter
} from "../../partials/content/Portlet";
import Spin from "../../partials/content/Spin";
import clsx from "clsx";

export default class PeoplesDetailPage extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    const people = this.props.location.state;

    this.state = {
      people: people || {},
      isLoading: true,
      items: [],
      countSchedule: 22,
      percentUsage: 0,
      scoreQuiz: 0,
      scoreFullQuiz: 0
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const { location } = this.props;
    if (!location.state) {
      this.fetchPeople();
    }

    this.fetchItems();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchPeople = async () => {
    const { match, history } = this.props;
    try {
      const response = await getPeopleById(match.params.id);
      const { data } = response;
      if (this._isMounted) {
        this.setState({ people: data });
      }
    } catch (error) {
      // TODO: handle error request people
      history.push("/peoples");
    }
  };

  fetchItems = async () => {
    try {
      const { match } = this.props;

      const schedules = await getSchedule({ sort: "_id" }).then(({ data }) => {
        return data.results;
      });

      const replies = await getReply({
        where: JSON.stringify({ people: match.params.id }),
        limit: 0,
        sort: "createdAt"
      }).then(({ data }) => data.results);
      const repliesGroup = groupBy(replies, "schedule");

      const quizzes = await getQuiz({
        where: JSON.stringify({ people: match.params.id }),
        populate: "question",
        limit: 0,
        sort: "createdAt"
      }).then(({ data }) => data.results);
      const quizzesGroup = groupBy(quizzes, "schedule");

      const items = schedules.reduce((results, schedule) => {
        const repliesOfSchedule = repliesGroup[schedule._id];
        const quizzesOfSchedule = quizzesGroup[schedule._id];
        if (!(!repliesOfSchedule && !quizzesOfSchedule)) {
          results.push({
            id: schedule._id,
            schedule,
            replies: repliesOfSchedule,
            quizzes: quizzesOfSchedule
          });
        }

        return results;
      }, []);

      const percentUsage = round((items.length / schedules.length) * 100);
      // TODO: do add code calculate score quiz
      /* let scoreQuiz = 0;
      quizzes.forEach(({ isCorrect }) => {
        if (isCorrect) {
          scoreQuiz += 1;
        }
      }); */

      if (this._isMounted) {
        this.setState({
          items: items,
          percentUsage,
          scoreQuiz: quizzes.length,
          scoreFullQuiz: quizzes.length,
          countSchedule: schedules.length
        });
      }
    } catch (error) {
      // TODO: handle error request schedule
      console.error(error);
    } finally {
      if (this._isMounted) {
        this.setState({ isLoading: false });
      }
    }
  };

  renderActivityItem = item => {
    return (
      <Portlet key={item.id}>
        <PortletHeader title={item.schedule.name} />
        <PortletBody>
          <div className="kt-timeline-v2">
            <div className="kt-timeline-v2__items">
              {item.replies &&
                item.replies.map(reply => (
                  <div key={reply._id} className="kt-timeline-v2__item">
                    <span className="kt-timeline-v2__item-time">
                      {moment(reply.createdAt).format("hh:mm")}
                    </span>
                    <div className="kt-timeline-v2__item-cricle">
                      <i className="fa fa-genderless kt-font-danger"></i>
                    </div>
                    <div className="kt-timeline-v2__item-text  kt-padding-top-5">
                      {REPLY_SUBMITTED_TYPES[reply.submittedType] + " "}
                      <span className="kt-font-bolder">{reply.text} </span>
                      <span className="font-weight-light">
                        {">> " + moment(reply.createdAt).format("ll")}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </PortletBody>
        {typeof item.quizzes !== "undefined" && (
          <PortletFooter>
            <div className="text-muted mb-4">การตอบคำถามและการทดสอบ</div>
            <div className="kt-widget1 kt-widget1--fit">
              {item.quizzes.map(quiz => {
                return (
                  <div key={quiz._id} className="kt-widget1__item">
                    <div className="kt-widget1__info">
                      <h3 className="kt-widget1__title">
                        {quiz.question.name}
                      </h3>
                      <span className="kt-widget1__desc">
                        <u className="kt-font-boldest">ตอบ</u>
                        {` ข้อ ${quiz.answer}. ${quiz.answerText}`}
                      </span>
                    </div>
                    <span
                      className={clsx("kt-widget1__number", {
                        "kt-font-success": true,
                        "kt-font-danger": false
                      })}
                    >
                      <i
                        className={clsx("fa", {
                          "fa-check": true,
                          "fa-times": false
                        })}
                      ></i>
                    </span>
                  </div>
                );
              })}
            </div>
          </PortletFooter>
        )}
      </Portlet>
    );
  };

  renderActivity = () => {
    const { items, isLoading } = this.state;
    return (
      <Spin spinning={isLoading}>
        {items.map(item => this.renderActivityItem(item))}
        {!isLoading && !items.length && (
          <>
            <div className="alert alert-warning" role="alert">
              <div className="alert-icon">
                <i className="flaticon-warning"></i>
              </div>
              <div className="alert-text">
                ผู้ใช้งานท่านนี้ ยังไม่มีข้อมูลการใช้งานแชทบอท
              </div>
            </div>
          </>
        )}
      </Spin>
    );
  };

  render() {
    const {
      people,
      percentUsage,
      countSchedule,
      scoreQuiz,
      scoreFullQuiz
    } = this.state;
    const percentScoreQuiz = round((scoreQuiz / scoreFullQuiz) * 100);
    return (
      <>
        <SubHeader>
          <SubHeader.Main title="Peoples"></SubHeader.Main>
        </SubHeader>
        <KTContent>
          <div className="kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app">
            <div className="kt-grid__item kt-app__toggle kt-app__aside">
              <ProfileCard
                loading={!Object.keys(people).length}
                data={people}
              />
              <div className="kt-portlet">
                <div className="kt-portlet__head">
                  <div className="kt-portlet__head-label">
                    <span className="kt-portlet__head-icon">
                      <i className="fa fa-info-circle"></i>
                    </span>
                    <h3 className="kt-portlet__head-title">ข้อมูลการใช้งาน</h3>
                  </div>
                </div>
                <div className="kt-portlet__body">
                  <div className="kt-section kt-section--space-md">
                    <div className="kt-widget24 kt-widget24--solid">
                      <div className="kt-widget24__details">
                        <div className="kt-widget24__info">
                          <span className="kt-widget24__title">
                            สถิติการใช้งาน
                          </span>
                          <span className="kt-widget24__desc">
                            การใช้งานแชทบอทจนสิ่นสุด
                          </span>
                        </div>
                        <span className="kt-widget24__stats kt-font-brand">
                          {percentUsage}%
                        </span>
                      </div>
                      <div className="progress progress--sm">
                        <div
                          className="progress-bar kt-bg-brand"
                          role="progressbar"
                          style={{ width: percentUsage + "%" }}
                          aria-valuenow={percentUsage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <div className="kt-widget24__action">
                        <span className="kt-widget24__change">ระยะเวลา</span>
                        <span className="kt-widget24__number">
                          {countSchedule} วัน
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="kt-section kt-section--space-md">
                    <div className="kt-widget24 kt-widget24--solid">
                      <div className="kt-widget24__details">
                        <div className="kt-widget24__info">
                          <span className="kt-widget24__title">คะแนน</span>
                          <span className="kt-widget24__desc">
                            ผลจากกิจกรรมตอบถำถาม
                          </span>
                        </div>
                        <span className="kt-widget24__stats kt-font-success">
                          {scoreQuiz}
                        </span>
                      </div>
                      <div className="progress progress--sm">
                        <div
                          className="progress-bar kt-bg-success"
                          role="progressbar"
                          style={{ width: percentScoreQuiz + "%" }}
                          aria-valuenow={percentScoreQuiz}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <div className="kt-widget24__action">
                        <span className="kt-widget24__change">
                          คะแนนทั้งหมด
                        </span>
                        <span className="kt-widget24__number">
                          {scoreFullQuiz} คะแนน
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="kt-grid__item kt-grid__item--fluid kt-app__content">
              {this.renderActivity()}
            </div>
          </div>
        </KTContent>
      </>
    );
  }
}
