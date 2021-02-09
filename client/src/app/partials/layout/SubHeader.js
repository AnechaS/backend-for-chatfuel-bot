import React, {
  Component,
  useMemo,
  useCallback,
  useState,
  forwardRef,
  useEffect
} from "react";
import { connect } from "react-redux";
import objectPath from "object-path";
import moment from "moment";
import { withRouter } from "react-router-dom";
import clsx from "clsx";
import { LayoutContextConsumer } from "../../../_metronic/layout/LayoutContext";
import * as builder from "../../../_metronic/ducks/builder";
import { ReactComponent as SearchIcon } from "../../../_metronic/layout/assets/layout-svg-icons/Search.svg";
import Daterangepicker from "./Daterangepicker";
import KTUtil from "../../../_metronic/_assets/js/util";

const Main = ({ children, title: titleDefault, subheaderMobileToggle }) => (
  <div className="kt-subheader__main">
    {subheaderMobileToggle && (
      <button
        className="kt-subheader__mobile-toggle kt-subheader__mobile-toggle--left"
        id="kt_subheader_mobile_toggle"
      >
        <span />
      </button>
    )}
    <LayoutContextConsumer>
      {({ subheader: { title } }) => (
        <>
          <h3 className="kt-subheader__title">{titleDefault || title}</h3>
        </>
      )}
    </LayoutContextConsumer>
    <span className="kt-subheader__separator kt-subheader__separator--v" />
    {children}
  </div>
);

const MainContainer = connect(store => ({
  subheaderMobileToggle: objectPath.get(
    store.builder.layoutConfig,
    "subheader.mobile-toggle"
  )
}))(Main);

const Group = ({ children }) => (
  <div className="kt-subheader__group">{children}</div>
);

const Toolbar = ({ children }) => (
  <div className="kt-subheader__toolbar">
    <div className="kt-subheader__wrapper">{children}</div>
  </div>
);

const Desc = ({ children }) => (
  <span className="kt-subheader__desc">{children}</span>
);

const Button = ({
  children,
  onClick,
  color = "primary",
  disabled = false,
  className,
  as: Tag = "div",
  ...rest
}) => {
  return (
    <Tag
      className={clsx(
        `btn kt-subheader__btn-${color}`,
        { disabled },
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </Tag>
  );
};

const Search = ({ initialValue = "", onSubmit }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = e => {
    setValue(e.target.value.trim());
  };

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      onSubmit(value);
    },
    [value, onSubmit]
  );

  return (
    <form className="kt-margin-l-20" autoComplete="off" onSubmit={handleSubmit}>
      <div className="kt-input-icon kt-input-icon--right kt-subheader__search">
        <input
          type="text"
          name="search"
          className="form-control"
          placeholder="Search..."
          value={value}
          onChange={handleChange}
        />
        <span className="kt-input-icon__icon kt-input-icon__icon--right">
          <span>
            <SearchIcon className="kt-svg-icon" onClick={handleSubmit} />
          </span>
        </span>
      </div>
    </form>
  );
};

const Dropdown = ({ children, ...rest }) => {
  return (
    <div
      className="dropdown dropdown-inline"
      data-toggle="kt-tooltip"
      data-placement="left"
      {...rest}
    >
      {children}
    </div>
  );
};

Dropdown.Toggle = ({ children, color = "primary" }) => (
  <button
    className={`btn kt-subheader__btn-${color}`}
    data-toggle="dropdown"
    aria-haspopup="true"
    aria-expanded="false"
  >
    {children}
  </button>
);

Dropdown.Menu = ({ children, drop, style }) => (
  <div
    className={`dropdown-menu dropdown-menu-fit dropdown-menu-md dropdown-menu-${drop ||
      "right"}`}
    style={style}
  >
    <ul className="kt-nav">{children}</ul>
  </div>
);

Dropdown.Item = ({ children, onClick, disabled = false, ...rest }) => (
  <li className="kt-nav__item">
    <button
      type="button"
      className={clsx("kt-nav__link kt-nav__link-button", { disabled })}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      <span className="kt-nav__link-text">{children}</span>
    </button>
  </li>
);

Dropdown.Divider = () => <li className="kt-nav__separator"></li>;

/**
 * Component Header Date rang picker
 */
const Datepicker = forwardRef(({ onChange, maxDate, minDate }, ref) => {
  const startDate = useMemo(() => moment("2019-08-01"), []);
  const endDate = useMemo(() => moment(maxDate), [maxDate]);
  const options = useMemo(() => {
    return {
      direction: KTUtil.isRTL(),
      startDate,
      endDate,
      minDate,
      maxDate,
      opens: "left",
      locale: {
        customRangeLabel: "กำหนดเอง"
      },
      ranges: {
        ทั้งหมด: [startDate, endDate],
        "7 วันสุดท้าย": [
          startDate,
          endDate.clone().subtract(6, "days"),
          endDate
        ],
        "30 วันสุดท้าย": [endDate.clone().subtract(29, "days"), endDate],
        เดื่อนนี้: [
          endDate
            .clone()
            .subtract(1, "month")
            .startOf("month"),
          endDate
            .clone()
            .subtract(1, "month")
            .endOf("month")
        ]
      }
    };
  }, [startDate, endDate, maxDate, minDate]);

  const [title, setTitle] = useState("วันที่:");
  const [range, setRange] = useState(endDate.format("MMM D"));

  useEffect(() => {
    setRange(endDate.format("MMM D"));
  }, [endDate]);

  const cb = useCallback(
    (start, end, label = "") => {
      if (label === "ทั้งหมด") {
        setTitle("วันที่:");
        setRange(end.format("MMM D"));
      } else {
        setTitle("ระหว่าง:");
        setRange(start.format("MMM D") + " - " + end.format("MMM D"));
      }

      onChange({ start, end, label });
    },
    [onChange]
  );

  /* useImperativeHandle(
    ref,
    () => {
      return {
        reset: () => {
          const $el = $("#subheader-daterange");
          $el
            .data("daterangepicker")
            .setStartDate(startDate.format("MM/DD/YYYY"));
          $el.data("daterangepicker").setEndDate(endDate.format("MM/DD/YYYY"));
          setTitle("วันที่:");
          setRange(startDate.format("MMM D"));
        }
      };
    },
    [startDate]
  ); */

  return (
    <Daterangepicker options={options} cb={cb}>
      <button
        className="btn kt-subheader__btn-daterange"
        id="subheader-daterange"
        title="Select dashboard daterange"
        data-toggle="kt-tooltip"
        data-placement="left"
      >
        <span className="kt-subheader__btn-daterange-title">{title}</span>
        &nbsp;
        <span className="kt-subheader__btn-daterange-date">{range}</span>
        <i className="flaticon2-calendar-1"></i>
      </button>
    </Daterangepicker>
  );
});

class SubHeader extends Component {
  static Main = MainContainer;
  static Group = Group;
  static Toolbar = Toolbar;
  static Desc = Desc;
  static Button = Button;
  static Dropdown = Dropdown;
  static Search = Search;
  static Daterangepicker = Datepicker;

  render() {
    const {
      subheaderCssClasses,
      subheaderContainerCssClasses,
      children
    } = this.props;
    return (
      <div
        id="kt_subheader"
        className={`kt-subheader ${subheaderCssClasses} kt-grid__item`}
      >
        <div className={`kt-container ${subheaderContainerCssClasses}`}>
          {children}
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  config: store.builder.layoutConfig,
  menuConfig: store.builder.menuConfig,
  subheaderCssClasses: builder.selectors.getClasses(store, {
    path: "subheader",
    toString: true
  }),
  subheaderContainerCssClasses: builder.selectors.getClasses(store, {
    path: "subheader_container",
    toString: true
  })
});

export default withRouter(connect(mapStateToProps)(SubHeader));
