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

export default function ProvinceDatatable2() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setDate] = useState([]);
  const [max, setMax] = useState("-");

  useEffect(() => {
    getWidgetById(5)
      .then(response => {
        const body = response.data;
        const _max = _.maxBy(body.data, "count");
        if (_max) {
          setMax(`จ.${_max.province} ${_max.count} คน`);
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
        <div className="kt-widget34">
          <div
            className="kt-widget34__content kt-portlet__space-x"
            style={{ flexGrow: 0, paddingTop: 15, paddingBottom: 10 }}
          >
            <div className="kt-widget34__item" style={{ marginBottom: 0 }}>
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
                    <Skeleton variant="text" width="60%" />
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
                  {!isLoading ? max : <Skeleton variant="text" width="60%" />}
                </span>
              </div>
            </div>
          </div>
          {!isLoading ? (
            <div className="kt-widget34__table" style={{ height: 350 }}>
              <Table
                minHeight={260}
                sortable={Boolean(data.length > 0)}
                pagination={{
                  pageSize: 5,
                  display: Boolean(data.length > 0),
                  showTotal: false,
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
                    Header: "จำนวน",
                    accessor: "count",
                    width: 80,
                    sortable: true
                  }
                ]}
                loading={isLoading}
              />
            </div>
          ) : (
            <Skeleton variant="rect" style={{ height: 350 }} />
          )}
        </div>
      </PortletBody>
    </Portlet>
  );
}
