import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js";
import { useSelector } from "react-redux";
import _ from "lodash";
import Skeleton from "@material-ui/lab/Skeleton";
import { metronic } from "../../../_metronic";
import { getWidgetById } from "../../crud/widget.crud";
import {
  PortletBody,
  Portlet,
  PortletHeader
} from "../../partials/content/Portlet";

function ChartComponent({ data }) {
  const ref = useRef();
  const { brandColor, successColor, shape2Color, shape3Color } = useSelector(
    state => ({
      brandColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.brand"
      ),
      successColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.success"
      ),
      shape2Color: metronic.builder.selectors.getConfig(
        state,
        "colors.base.shape.2"
      ),
      shape3Color: metronic.builder.selectors.getConfig(
        state,
        "colors.base.shape.3"
      )
    })
  );

  useEffect(() => {
    const labels = data.map(o => o.x);
    const values = data.map(o => o.y);
    const chart = new Chart(ref.current, {
      data: {
        labels,
        datasets: [
          {
            data: values,
            fill: true,
            // borderWidth: 0,
            backgroundColor: successColor,
            borderColor: successColor,
            pointBackgroundColor: Chart.helpers
              .color("#000000")
              .alpha(0)
              .rgbString(),
            pointBorderColor: Chart.helpers
              .color("#000000")
              .alpha(0)
              .rgbString(),
            pointHoverBackgroundColor: brandColor,
            pointHoverBorderColor: Chart.helpers
              .color("#000000")
              .alpha(0.1)
              .rgbString(),
            categoryPercentage: 0.35,
            barPercentage: 2
          }
        ]
      },
      type: "bar",
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: false,
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Days"
              },
              gridLines: false,
              ticks: {
                display: true,
                beginAtZero: true,
                fontColor: shape3Color,
                fontSize: 12,
                padding: 10
              }
            }
          ],
          yAxes: [
            {
              categoryPercentage: 0.35,
              barPercentage: 0.7,
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Percentag"
              },
              gridLines: {
                color: shape2Color,
                drawBorder: false,
                offsetGridLines: false,
                drawTicks: false,
                borderDash: [3, 4],
                zeroLineWidth: 1,
                zeroLineColor: shape2Color,
                zeroLineBorderDash: [3, 4]
              },
              ticks: {
                max: 100,
                display: true,
                beginAtZero: true,
                fontColor: shape3Color,
                fontSize: 12,
                padding: 10
              }
            }
          ]
        },
        title: {
          display: false
        },
        hover: {
          mode: "ErrorsPage.js"
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: "nearest",
          bodySpacing: 5,
          yPadding: 10,
          xPadding: 10,
          caretPadding: 0,
          displayColors: false,
          titleFontColor: "#ffffff",
          cornerRadius: 4,
          footerSpacing: 0,
          titleSpacing: 0,
          callbacks: {
            label: ({ yLabel, index }) => {
              return `${yLabel} % จำนวน ${data[index].count} คน`;
            }
          }
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 5,
            bottom: 5
          }
        }
      }
    });

    return () => {
      chart.destroy();
    };
  }, [data, brandColor, shape2Color, shape3Color, successColor]);

  return (
    <>
      <canvas
        ref={ref}
        width={683}
        height={312}
        id="kt_chart_order_statistics"
      />
    </>
  );
}

export default function ScheduleCompletedChart({ height, query }) {
  const [data, setDate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meanComplate, setMeanComplate] = useState(0);
  const [meanNotComplate, setMeanNotComplate] = useState(0);

  useEffect(() => {
    getWidgetById(9, { q: JSON.stringify(query) })
      .then(response => {
        const body = response.data;
        const mean = _.meanBy(body.data, "y");
        const subtractMean = Math.max(0, 100 - mean);
        setMeanComplate(mean);
        setMeanNotComplate(subtractMean);

        setDate(body.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query]);

  return (
    <Portlet fluidHeight={true}>
      <PortletHeader title="สถิติการคุยกับแชทบอท 21 วัน" />
      <PortletBody>
        <div className="kt-widget12">
          <div className="kt-widget12__content kt-portlet__space-x kt-portlet__space-y">
            <div className="kt-widget12__item" style={{ marginBottom: "0px" }}>
              <div className="kt-widget12__info">
                <span className="kt-widget12__desc">
                  {!isLoading ? (
                    "อัตตราที่ผู้ใช้งานคุยกับแชทบอทจนครบ 21 วัน"
                  ) : (
                    <Skeleton width="80%" />
                  )}
                </span>
                <span className="kt-widget12__value">
                  {!isLoading ? (
                    `${meanComplate.toFixed(2)}%`
                  ) : (
                    <Skeleton width="60%" />
                  )}
                </span>
              </div>
              <div className="kt-widget12__info">
                <span className="kt-widget12__desc">
                  {!isLoading ? (
                    "อัตตราที่ผู้ใช้งานคุยกับแชทบอทไม่ครบ 21 วัน"
                  ) : (
                    <Skeleton width="80%" />
                  )}
                </span>
                <span className="kt-widget12__value">
                  {!isLoading ? (
                    `${meanNotComplate.toFixed(2)}%`
                  ) : (
                    <Skeleton width="60%" />
                  )}
                </span>
              </div>
            </div>
          </div>
          {!isLoading ? (
            <div className="kt-widget12__chart" style={{ height }}>
              <ChartComponent data={data} />
            </div>
          ) : (
            <div className="d-flex justify-content-center" style={{ height }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="80px"
                height="80px"
                className="m-auto"
                viewBox="0 0 24 24"
                version="1.1"
              >
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <rect x="0" y="0" width="24" height="24" />
                  <rect
                    fill="rgba(0, 0, 0, 0.04)"
                    x="12"
                    y="4"
                    width="3"
                    height="13"
                    rx="1.5"
                  />
                  <rect
                    fill="rgba(0, 0, 0, 0.04)"
                    x="7"
                    y="9"
                    width="3"
                    height="8"
                    rx="1.5"
                  />
                  <path
                    d="M5,19 L20,19 C20.5522847,19 21,19.4477153 21,20 C21,20.5522847 20.5522847,21 20,21 L4,21 C3.44771525,21 3,20.5522847 3,20 L3,4 C3,3.44771525 3.44771525,3 4,3 C4.55228475,3 5,3.44771525 5,4 L5,19 Z"
                    fill="rgba(0, 0, 0, 0.04)"
                    fillRule="nonzero"
                  />
                  <rect
                    fill="rgba(0, 0, 0, 0.04)"
                    x="17"
                    y="11"
                    width="3"
                    height="6"
                    rx="1.5"
                  />
                </g>
              </svg>
            </div>
          )}
        </div>
      </PortletBody>
    </Portlet>
  );
}
