import React, { useState, useEffect } from "react";
import _ from "lodash";
import Skeleton from "@material-ui/lab/Skeleton";
import Table from "../../partials/content/Table";
import { getWidgetById } from "../../crud/widget.crud";
import {
  Portlet,
  PortletHeader,
  PortletBody
} from "../../partials/content/Portlet";

export default function ProvinceDatatable1({ height }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setDate] = useState([]);
  const [max, setMax] = useState("");
  const [maxDId, setMaxDId] = useState("");
  const [maxG, setMaxG] = useState("");

  useEffect(() => {
    getWidgetById(6)
      .then(response => {
        const body = response.data;
        const _max = _.maxBy(body.data, "count");
        if (_max) {
          setMax(`จ.${_max.province} ${_max.count} คน`);
        }

        const _maxDId = _.maxBy(body.data, "countDId");
        if (_maxDId) {
          setMaxDId(`จ.${_maxDId.province} ${_maxDId.countDId} คน`);
        }

        const _maxG = _.maxBy(body.data, "countG");
        if (_maxG) {
          setMaxG(`จ.${_maxG.province} ${_maxG.countG} คน`);
        }

        setDate(body.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Portlet fluidHeight={true}>
      <PortletHeader title="จังหวัด" />
      <PortletBody fit={true}>
        <div className="kt-widget34" style={{ height }}>
          <div className="kt-widget34__content kt-portlet__space-x kt-portlet__space-y">
            <div className="kt-widget34__item">
              <div className="kt-widget34__info">
                <span className="kt-widget34__desc">
                  {!isLoading ? (
                    "จำนวน"
                  ) : (
                    <Skeleton variant="text" width="80%" />
                  )}
                </span>
                <span className="kt-widget34__value">
                  {!isLoading ? (
                    data.length
                  ) : (
                    <Skeleton variant="text" width="50%" />
                  )}
                </span>
              </div>
              <div className="kt-widget34__info">
                <span className="kt-widget34__desc">
                  {!isLoading ? (
                    "ผู้ใช้งานเยอะที่สุด"
                  ) : (
                    <Skeleton variant="text" width="80%" />
                  )}
                </span>
                <span className="kt-widget34__value">
                  {!isLoading ? max : <Skeleton variant="text" width="50%" />}
                </span>
              </div>
            </div>
            <div className="kt-widget34__item">
              <div className="kt-widget34__info">
                <span className="kt-widget34__desc">
                  {!isLoading ? (
                    "มีผู้ใช้งานที่มี ID เยอะที่สุด"
                  ) : (
                    <Skeleton variant="text" width="80%" />
                  )}
                </span>
                <span className="kt-widget34__value">
                  {!isLoading ? (
                    maxDId
                  ) : (
                    <Skeleton variant="text" width="50%" />
                  )}
                </span>
              </div>
              <div className="kt-widget34__info">
                <span className="kt-widget34__desc">
                  {!isLoading ? (
                    "มีผู้ใช้งานทั่วไปเยอะที่สุด"
                  ) : (
                    <Skeleton variant="text" width="80%" />
                  )}
                </span>
                <span className="kt-widget34__value">
                  {!isLoading ? maxG : <Skeleton variant="text" width="50%" />}
                </span>
              </div>
            </div>
          </div>
          {isLoading ? (
            <Skeleton variant="rect" style={{ height: 350 }} />
          ) : (
            <div className="kt-widget34__table" style={{ height: 350 }}>
              <Table
                minHeight={260}
                sortable={Boolean(data.length > 0)}
                pagination={{
                  pageSize: 5,
                  display: Boolean(data.length > 0),
                  showTotal: true,
                  showSizePerPage: false
                }}
                data={data}
                columns={[
                  {
                    Header: "จังหวัด",
                    accessor: "province",
                    width: 100,
                    sortable: false
                  },
                  {
                    Header: "ผู้ใข้ที่มี ID",
                    accessor: "countDId",
                    width: 80,
                    sortable: true
                  },
                  {
                    Header: "ผู้ใข้ทั่วไป",
                    accessor: "countG",
                    width: 80,
                    sortable: true
                  },
                  {
                    Header: "จำนวน",
                    accessor: "count",
                    width: 80,
                    sortable: true
                  }
                ]}
                loading={isLoading}
              />
            </div>
          )}
        </div>
      </PortletBody>
    </Portlet>
  );
}
