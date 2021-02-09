import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js";
import { useSelector } from "react-redux";
import { metronic } from "../../../_metronic";
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from "../../partials/content/Portlet";
import { getWidgetById } from "../../crud/widget.crud";

function ChartComponent({ data }) {
  const ref = useRef();
  const { brandColor, shape2Color, shape3Color } = useSelector(state => ({
    brandColor: metronic.builder.selectors.getConfig(
      state,
      "colors.state.brand"
    ),
    shape2Color: metronic.builder.selectors.getConfig(
      state,
      "colors.base.shape.2"
    ),
    shape3Color: metronic.builder.selectors.getConfig(
      state,
      "colors.base.shape.3"
    )
  }));

  useEffect(() => {
    const chart = new Chart(ref.current, {
      data: {
        datasets: [
          {
            data,
            type: "line",
            fill: true,
            borderWidth: 0,
            backgroundColor: Chart.helpers
              .color(brandColor)
              .alpha(0.6)
              .rgbString(),
            borderColor: Chart.helpers
              .color(brandColor)
              .alpha(0)
              .rgbString(),
            pointHoverRadius: 4,
            pointHoverBorderWidth: 12,
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
              .rgbString()
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: false,
        animation: {
          duration: 0
        },
        scales: {
          xAxes: [
            {
              type: "time",
              scaleLabel: {
                display: false,
                labelString: "Date"
              },
              gridLines: false,
              distribution: "series",
              // offset: true,
              time: {
                tooltipFormat: "ll"
                // unit: "year"
              },
              ticks: {
                major: {
                  enabled: true,
                  fontStyle: "bold"
                },
                source: "data",
                autoSkip: true,
                autoSkipPadding: 75,
                maxRotation: 0,
                sampleSize: 100,
                fontColor: shape3Color,
                fontSize: 12,
                padding: 8
                // callback: (value, index, values) => {
                //   const d = moment(values[index].value);
                //   if (d.date() === 1) {
                //     return d.format("MMM Y");
                //   }
                //   return d.format("D MMM");
                // }
              }
              // afterBuildTicks: (scale, ticks) => {
              //   if (ticks) {
              //     const majorUnit = scale._majorUnit;
              //     const firstTick = ticks[0];
              //     let i, ilen, val, tick, currMajor, lastMajor;

              //     val = moment(ticks[0].value);
              //     if (
              //       (majorUnit === "minute" && val.second() === 0) ||
              //       (majorUnit === "hour" && val.minute() === 0) ||
              //       (majorUnit === "day" && val.hour() === 9) ||
              //       (majorUnit === "month" &&
              //         val.date() <= 3 &&
              //         val.isoWeekday() === 1) ||
              //       (majorUnit === "year" && val.month() === 0)
              //     ) {
              //       firstTick.major = true;
              //     } else {
              //       firstTick.major = false;
              //     }
              //     lastMajor = val.get(majorUnit);

              //     for (i = 1, ilen = ticks.length; i < ilen; i++) {
              //       tick = ticks[i];
              //       val = moment(tick.value);
              //       currMajor = val.get(majorUnit);
              //       tick.major = currMajor !== lastMajor;
              //       lastMajor = currMajor;
              //     }

              //     return ticks;
              //   }
              // }
            }
          ],
          yAxes: [
            {
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
              scaleLabel: {
                display: false,
                labelString: "Count"
              },
              ticks: {
                display: data.length > 0,
                beginAtZero: true,
                fontColor: shape3Color,
                fontSize: 12,
                padding: 10,
                suggestedMin: 0,
                suggestedMax: 8
              }
            }
          ]
        },
        title: {
          display: false
        },
        tooltips: {
          intersect: false,
          mode: "index",
          bodySpacing: 5,
          yPadding: 10,
          xPadding: 10,
          caretPadding: 0,
          displayColors: false,
          backgroundColor: brandColor,
          titleFontColor: "#ffffff",
          cornerRadius: 4,
          footerSpacing: 0,
          titleSpacing: 0,
          callbacks: {
            label: tooltipItems => {
              return tooltipItems.yLabel + " คน";
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
  }, [brandColor, shape2Color, shape3Color, data]);

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

export default function PeoplesStatisticsChart({ height, startDate, endDate }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [period, setPeriod] = useState("day");

  useEffect(() => {
    getWidgetById(4, { period, startDate, endDate })
      .then(response => {
        const body = response.data;
        setData(body.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [period, startDate, endDate]);

  return (
    <>
      <Portlet fluidHeight={true}>
        <PortletHeader
          title="สถิติผู้ใช้งาน"
          toolbar={
            <PortletHeaderToolbar>
              <div className="dropdown dropdown-inline">
                <button
                  type="button"
                  className="btn btn-clean btn-sm btn-icon btn-icon-md"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="flaticon-more-1"></i>
                </button>
                <div className="dropdown-menu dropdown-menu-right">
                  <ul className="kt-nav">
                    <li className="kt-nav__item">
                      <button
                        className="kt-nav__link dropdown-item"
                        onClick={() => setPeriod("day")}
                      >
                        <span className="kt-nav__link-text">วัน</span>
                      </button>
                    </li>
                    <li className="kt-nav__item">
                      <button
                        className="kt-nav__link dropdown-item"
                        onClick={() => setPeriod("month")}
                      >
                        <span className="kt-nav__link-text">เดือน</span>
                      </button>
                    </li>
                    <li className="kt-nav__item">
                      <button
                        className="kt-nav__link dropdown-item"
                        onClick={() => setPeriod("year")}
                      >
                        <span className="kt-nav__link-text">ปี</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </PortletHeaderToolbar>
          }
        />
        <PortletBody>
          <div className="kt-widget12" style={{ height }}>
            {!isLoading ? (
              <ChartComponent data={data} />
            ) : (
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
            )}
          </div>
        </PortletBody>
      </Portlet>
    </>
  );
}
