import React, { useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { Chart } from "chart.js";
import moment from "moment";
import { metronic } from "../../_metronic";

export default function ChatbotUserActivities({ data }) {
  const ref = useRef();

  const {
    brandColor,
    warningColor,
    successColor,
    darkColor,
    shape2Color,
    shape3Color,
  } = useSelector((state) => ({
    brandColor: metronic.builder.selectors.getConfig(
      state,
      "colors.state.brand"
    ),
    warningColor: metronic.builder.selectors.getConfig(
      state,
      "colors.state.warning"
    ),
    successColor: metronic.builder.selectors.getConfig(
      state,
      "colors.state.success"
    ),
    darkColor: metronic.builder.selectors.getConfig(state, "colors.state.dark"),
    shape2Color: metronic.builder.selectors.getConfig(
      state,
      "colors.base.shape.2"
    ),
    shape3Color: metronic.builder.selectors.getConfig(
      state,
      "colors.base.shape.3"
    ),
  }));

  const chartData = useMemo(() => {
    return Object.assign(
      {},
      {
        x: [],
        y: {
          "broadcast read": [],
          "input from user received": [],
          "user creation info": [],
          "ym:ce:users": [],
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
            fill: false,
            label: "ใช้งานอยู่",
            backgroundColor: Chart.helpers
              .color(brandColor)
              .alpha(0.6)
              .rgbString(),
            borderColor: brandColor,
            data: chartData.y["ym:ce:users"],
          },
          {
            fill: false,
            label: "อ่านแล้ว",
            backgroundColor: Chart.helpers
              .color(warningColor)
              .alpha(0.6)
              .rgbString(),
            borderColor: warningColor,
            data: chartData.y["broadcast read"],
          },
          {
            fill: false,
            label: "ได้รับอินพุตแล้ว",
            backgroundColor: Chart.helpers
              .color(successColor)
              .alpha(0.6)
              .rgbString(),
            borderColor: successColor,
            data: chartData.y["input from user received"],
          },
        ],
      },
      type: "line",
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
        legend: false,
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Month",
              },
              type: "time",
              time: {
                unit: "day",
                tooltipFormat: "D MMM, YYYY",
                displayFormats: {
                  day: "D MMM",
                },
              },
              distribution: "series",
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
              categoryPercentage: 0.35,
              barPercentage: 0.7,
              gridLines: false,
            },
          ],
          yAxes: [
            {
              display: true,
              categoryPercentage: 0.35,
              barPercentage: 0.7,
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
          intersect: true,
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: "index",
          bodySpacing: 5,
          yPadding: 10,
          xPadding: 10,
          caretPadding: 0,
          backgroundColor: darkColor,
          cornerRadius: 4,
          footerSpacing: 0,
          titleSpacing: 0,
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
  }, [chartData, brandColor, darkColor, successColor, warningColor, shape2Color, shape3Color]);

  return (
    <div className="kt-widget21">
      <div className="kt-widget21__content kt-portlet__space-x">
        <div className="kt-widget21__item">
          <div href="#" className="kt-widget21__icon kt-bg-fill-brand">
            <i className="flaticon-information"></i>
          </div>
          <div className="kt-widget21__info">
            <span className="kt-widget21__title">ใช้งานอยู่</span>
            <span className="kt-widget21__sub">Active Chatbot Users</span>
          </div>
        </div>
        <div className="kt-widget21__item">
          <div href="#" className="kt-widget21__icon kt-bg-fill-warning">
            <i className="flaticon-information"></i>
          </div>
          <div className="kt-widget21__info">
            <span className="kt-widget21__title">อ่านแล้ว</span>
            <span className="kt-widget21__sub">Chatbot User Reengage Read</span>
          </div>
        </div>
        <div className="kt-widget21__item">
          <div href="#" className="kt-widget21__icon kt-bg-fill-success">
            <i className="flaticon-information"></i>
          </div>
          <div className="kt-widget21__info">
            <span className="kt-widget21__title">ได้รับอินพุตแล้ว</span>
            <span className="kt-widget21__sub">
              Chatbot User Input Received
            </span>
          </div>
        </div>
      </div>
      <div className="kt-widget21__chart" style={{ height: "250px" }}>
        <canvas ref={ref} height={312} />
      </div>
    </div>
  );
}
