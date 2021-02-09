import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { uniqBy } from "lodash";
import { getDistrictOfPeople } from "../../../crud/people.crud";
import { actions } from "../../../store/ducks/address.duck";

const $ = window.$;

const durations = [
  {
    name: "วันนี้",
    value: JSON.stringify({
      start: moment().format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD")
    })
  },
  {
    name: "7 วันสุดท้าย",
    value: JSON.stringify({
      start: moment()
        .subtract(7, "day")
        .format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD")
    })
  },
  {
    name: "30 วันสุดท้าย",
    value: JSON.stringify({
      start: moment()
        .subtract(30, "day")
        .format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD")
    })
  },
  {
    name: "สัปดาห์นี้",
    value: JSON.stringify({
      start: moment()
        .startOf("week")
        .format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD")
    })
  },
  {
    name: "เดือนนี",
    value: JSON.stringify({
      start: moment()
        .startOf("month")
        .format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD")
    })
  },
  {
    name: "ปีนี้",
    value: JSON.stringify({
      start: moment()
        .startOf("year")
        .format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD")
    })
  },
  {
    name: "ก่อน 4 เม.ษ. 2019",
    value: JSON.stringify({
      start: moment("2020-04-04").format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD")
    })
  },
  {
    name: "หลัง 4 เม.ษ. 2019",
    value: JSON.stringify({
      start: moment("2019-08-01").format("YYYY-MM-DD"),
      end: moment("2020-04-04").format("YYYY-MM-DD")
    })
  }
];

export class FilterPeopleDropdown extends Component {
  _initalState = {
    duration: "",
    dentalIdType: "",
    province: "",
    district: ""
  };

  constructor(props) {
    super(props);

    this.state = this._initalState;
  }

  componentDidMount() {
    this.$el = $(this.el);
    this.$el.on("shown.bs.dropdown", this.handleShowDropdown);
    this.$el.on("hidden.bs.dropdown", this.handleHidedDropdown);

    this.loadAddress();
  }

  componentWillUnmount() {
    this.$el.dropdown("dispose");
  }

  loadAddress = async () => {
    const { districts, requestAddress } = this.props;
    if (!districts.length) {
      const { data } = await getDistrictOfPeople({ sort: "province" });
      const transfromData = data.map(o => ({
        province: o.province,
        district: o.district
      }));
      requestAddress(transfromData);
    }
  };

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleApply = e => {
    e.preventDefault();

    let values = {};

    const { duration, dentalIdType, province, district } = this.state;
    if (duration) {
      values.duration = JSON.parse(duration);
    }

    if (dentalIdType) {
      values.dentalIdType = dentalIdType === "1";
    }

    if (province) {
      values.province = province;
    }

    if (district) {
      values.district = district;
    }

    this.props.onFilterChange(values);
  };

  handleClear = () => {
    this.setState(this._initalState);
    this.props.onFilterChange({});
  };

  handleShowDropdown = () => {
    const { filters } = this.props;
    const state = {};
    if (filters.duration) {
      state.duration = JSON.stringify(filters.duration);
    }

    if (filters.dentalIdType) {
      state.dentalIdType = filters.dentalIdType ? "1" : "0";
    }

    if (filters.province) {
      state.province = filters.province;
    }

    if (filters.district) {
      state.district = filters.district;
    }

    this.setState(state);
  };

  handleHidedDropdown = () => {
    this.setState(this._initalState);
  };

  render() {
    const { duration, dentalIdType, province, district } = this.state;
    const { districts, provinces } = this.props;
    return (
      <div
        className="dropdown dropdown-inline"
        data-toggle="kt-tooltip"
        title=""
        data-placement="left"
        ref={el => {
          this.el = el;
        }}
      >
        <button
          type="button"
          className="btn kt-subheader__btn-primary btn-icon kt-margin-l-5"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <i className="fa fa-filter"></i>
        </button>
        <div
          className="dropdown-menu  p-0 m-0 dropdown-menu-md dropdown-menu-right py-3"
          style={{ width: 220 }}
        >
          <form className="px-4 py-1" onSubmit={this.handleApply}>
            <div className="form-group mb-3">
              <label>วันที่สร้าง</label>
              <select
                className="form-control"
                name="duration"
                value={duration}
                onChange={this.handleInputChange}
              >
                <option value="">ทั้งหมด</option>
                {durations.map(({ name, value }) => (
                  <option key={name} value={value}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mb-3">
              <label>ที่อยู่</label>
              <select
                className="form-control"
                name="province"
                value={province}
                onChange={e => {
                  this.setState({ district: "" });
                  this.handleInputChange(e);
                }}
              >
                <option value="">จังหวัดทั้งหมด</option>
                {provinces.map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>

              <select
                className="form-control mt-2"
                name="district"
                value={district}
                onChange={this.handleInputChange}
              >
                <option>อำเภอทั้งหมด</option>
                {province &&
                  districts
                    .filter(o => o.province === province)
                    .map(o => (
                      <option key={o.district} value={o.district}>
                        {o.district}
                      </option>
                    ))}
              </select>
            </div>
            <div className="form-group mb-3">
              <label>รหัสทางการแพทย์</label>
              <select
                className="form-control"
                name="dentalIdType"
                value={dentalIdType}
                onChange={this.handleInputChange}
              >
                <option value="">ทั้งหมด</option>
                <option value="0">ไม่มี</option>
                <option value="1">มี</option>
              </select>
            </div>
            <div className="float-right">
              <button
                type="button"
                onClick={this.handleClear}
                className="btn btn-secondary"
              >
                ล้าง
              </button>
              <button type="submit" className="btn btn-brand">
                ตกลง
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  districts: state.address,
  provinces: uniqBy(state.address, "province").map(o => o.province)
});

export default connect(mapStateToProps, actions)(FilterPeopleDropdown);
