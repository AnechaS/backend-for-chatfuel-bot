import React, { useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { Chart } from "chart.js";
import { max, sum } from "lodash";
import moment from "moment";
import { metronic } from "../../_metronic";
import numberWithCommas from "../utils/numberWithCommas";

export default function DailyNewChatbotUsers({ data }) {
  const ref = useRef();

  const { brandColor, darkColor, shape2Color, shape3Color } = useSelector(
    (state) => ({
      brandColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.brand"
      ),
      darkColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.dark"
      ),
      shape2Color: metronic.builder.selectors.getConfig(
        state,
        "colors.base.shape.2"
      ),
      shape3Color: metronic.builder.selectors.getConfig(
        state,
        "colors.base.shape.3"
      ),
    })
  );

  const chartData = useMemo(() => {
    return Object.assign(
      {},
      {
        x: [],
        y: {
          "Blocked users": [],
          "New Blocked users": [],
          "Total New users": [],
          "Total users": [],
        },
      },
      data
    );
  }, [data]);

  useEffect(() => {
    // For more information about the chartjs, visit this link
    // https://www.chartjs.org/docs/latest/getting-started/usage.html

    const chart = new Chart(ref.current, {
      data: {
        labels: chartData.x.map((val) => moment(val).toDate()),
        datasets: [
          {
            fill: true,
            type: "line",
            backgroundColor: Chart.helpers
              .color(brandColor)
              .alpha(0.6)
              .rgbString(),

            borderColor: brandColor,
            data: chartData.y["Total New users"],
          },
        ],
      },
      type: "line",
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: false,
        elements: {
          line: {
            tension: 0.0000001,
          },
          point: {
            radius: 0,
          },
        },
        animation: {
          duration: 0,
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit: "day",
                tooltipFormat: "D MMM, YYYY",
                displayFormats: {
                  day: "D MMM",
                },
                distribution: "series",
              },
              distribution: "series",
              categoryPercentage: 0.35,
              barPercentage: 0.7,
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Month",
              },
              gridLines: false,
              ticks: {
                display: true,
                fontColor: shape3Color,
                fontSize: 13,
                padding: 10,

                major: {
                  enabled: true,
                  fontStyle: "bold",
                },
                source: "data",
                autoSkip: true,
                autoSkipPadding: 75,
                maxRotation: 0,
                sampleSize: 100,
              },
            },
          ],
          yAxes: [
            {
              categoryPercentage: 0.35,
              barPercentage: 0.7,
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Value",
              },
              gridLines: {
                color: shape2Color,
                drawBorder: false,
                offsetGridLines: false,
                drawTicks: false,
                borderDash: [3, 4],
                zeroLineWidth: 1,
                zeroLineColor: shape2Color,
                zeroLineBorderDash: [3, 4],
              },
              ticks: {
                display: true,
                beginAtZero: true,
                lineHeight: 3,
                fontColor: shape3Color,
                fontSize: 13,
                padding: 10,
              },
            },
          ],
        },
        title: {
          display: false,
        },
        hover: {
          mode: "nearest",
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
          backgroundColor: darkColor,
          titleFontColor: "#ffffff",
          cornerRadius: 4,
          footerSpacing: 0,
          titleSpacing: 0,
          callbacks: {
            label: ({ value }) => {
              return "รายใหม่: " + numberWithCommas(value) + " คน";
            },
            afterLabel: ({ index }) => {
              const value = numberWithCommas(chartData.y["Total users"][index]);
              return "ทั้งหมด: " + value + " คน";
            },
          },
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 5,
            bottom: 5,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [brandColor, darkColor, shape2Color, shape3Color, chartData]);

  return (
    <div className="kt-widget12">
      <div className="kt-widget12__content">
        <div className="kt-widget12__item">
          <div className="kt-widget12__info">
            <span className="kt-widget12__desc">ผู้ใช้งานแชทบอททั้งหมด</span>
            <span className="kt-widget12__value">
              {numberWithCommas(max(chartData.y["Total users"], 0))} คน
            </span>
          </div>
          <div className="kt-widget12__info">
            <span className="kt-widget12__desc">ผู้ใช้งานแชทบอทรายใหม่</span>
            <span className="kt-widget12__value">
              {numberWithCommas(sum(chartData.y["Total New users"]))} คน
            </span>
          </div>
        </div>
      </div>
      <div className="kt-widget12__chart" style={{ height: "250px" }}>
        <canvas
          ref={ref}
          width={683}
          height={312}
          id="kt_chart_order_statistics"
        />
      </div>
    </div>
  );
}
