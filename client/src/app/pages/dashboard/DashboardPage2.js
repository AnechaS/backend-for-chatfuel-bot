import React, { Component } from "react";
import moment from "moment";
import PeopleScoreCard from "../../widgets/dashboard/PeopleScoreCard";
import ScheduleCompletedChart from "../../widgets/dashboard/ScheduleCompletedChart";
import NewPeoples from "../../widgets/dashboard/NewPeoples";
import ProvinceDatatable2 from "../../widgets/dashboard/ProvinceDatatable2";
import DistrictDatatable2 from "../../widgets/dashboard/DistrictDatatable2";
import PeoplesStatisticsChart from "../../widgets/dashboard/PeopleStatisticsChart";

class DashboardPage2 extends Component {
  render() {
    return (
      <>
        <div className="row">
          <div className="col-xl-3">
            <PeopleScoreCard title="ผู้ใช้งานทั้งหมด" desc="Total Peoples" />
            <div className="kt-space-20" />
            <PeopleScoreCard
              title="ผู้ใช้งานรายใหม่"
              desc="New Peoples"
              query={{
                createdAt: {
                  $gte: moment()
                    .startOf("day")
                    .toDate(),
                  $lte: moment()
                    .endOf("day")
                    .toDate()
                }
              }}
            />
          </div>

          <div className="col-xl-9">
            <PeoplesStatisticsChart height={312} />
          </div>
        </div>

        <div className="row">
          <div className="col-xl-3">
            <NewPeoples limit={6} />
          </div>
          <div className="col-xl-4">
            <ProvinceDatatable2 />
          </div>
          <div className="col-xl-5">
            <DistrictDatatable2 />
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <ScheduleCompletedChart height={250} />
          </div>
        </div>
      </>
    );
  }
}

export default DashboardPage2;
