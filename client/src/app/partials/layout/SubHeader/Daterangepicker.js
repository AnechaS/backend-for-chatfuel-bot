import React, { useMemo, useCallback, useState, useEffect } from "react";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import KTUtil from "../../../../_metronic/_assets/js/util";

export default function Daterangepicker({ initialSettings, onChange }) {
  const initSetting = useMemo(() => {
    return {
      buttonClasses: " btn",
      applyClass: "btn-primary",
      // cancelClass: 'btn-secondary',
      direction: KTUtil.isRTL(),
      opens: "left",
      locale: {
        customRangeLabel: "กำหนดเอง",
      },
      ranges: {
        วันนี้: [moment(), moment()],
        เมื่อวาน: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "7 วันสุดท้าย": [moment().subtract(6, "days"), moment()],
        "30 วันสุดท้าย": [moment().subtract(29, "days"), moment()],
        เดือนนี้: [moment().startOf("month"), moment().endOf("month")],
        เดือนสุดท้าย: [
          moment()
            .subtract(1, "month")
            .startOf("month"),
          moment()
            .subtract(1, "month")
            .endOf("month"),
        ],
      },
      ...initialSettings,
    };
  }, [initialSettings]);

  const [range, setRange] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (initSetting.startDate && initSetting.endDate) {
      setStartDate(initSetting.startDate);
      setEndDate(initSetting.endDate);
    } else if (initSetting.startDate) {
      setStartDate(initSetting.startDate);
    } else {
      const index = Object.keys(initSetting.ranges).shift();
      const dates = initSetting.ranges[index];

      if (initSetting.endDate) {
        setStartDate(dates[0]);
        setEndDate(initSetting.endDate);
      } else {
        setStartDate(dates[0]);
        setStartDate(dates[1]);
      }
    }
  }, [initSetting.startDate, initSetting.endDate, initSetting.ranges]);

  useEffect(() => {
    let text = "";
    if (startDate) {
      text = startDate.format("DD MMM YYYY");
    }

    if (
      startDate &&
      endDate &&
      !moment(startDate.format("YYYY-MM-DD")).isSame(
        endDate.format("YYYY-MM-DD")
      )
    ) {
      text += " — ";
      text += endDate.format("DD MMM YYYY");
    }

    setRange(text);
  }, [startDate, endDate]);

  const onApply = useCallback(
    (event, picker) => {
      onChange(picker.startDate, picker.endDate);
    },
    [onChange]
  );

  const onCallback = (start, end /* , label */) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <DateRangePicker
      initialSettings={initSetting}
      onCallback={onCallback}
      onApply={onApply}
    >
      <button
        className="btn kt-subheader__btn-daterange"
        id="kt_dashboard_daterangepicker"
      >
        <span className="kt-subheader__btn-daterange-date">{range}</span>
        <i className="flaticon2-calendar-1"></i>
      </button>
    </DateRangePicker>
  );
}

Daterangepicker.defaultProps = {
  onChange: () => {},
};
