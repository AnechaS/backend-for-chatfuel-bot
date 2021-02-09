/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { connect } from "react-redux";
import { toAbsoluteUrl } from "../../../_metronic";
import * as auth from "../../store/ducks/auth.duck";
import HeaderDropdownToggle from "../content/CustomDropdowns/HeaderDropdownToggle";

class UserProfile extends React.Component {
  render() {
    const { user, showHi, showAvatar, showBadge } = this.props;
    return (
      <Dropdown
        className="kt-header__topbar-item kt-header__topbar-item--user"
        drop="down"
        alignRight
      >
        <Dropdown.Toggle
          as={HeaderDropdownToggle}
          id="dropdown-toggle-user-profile"
        >
          <div className="kt-header__topbar-user">
            {showHi && (
              <span className="kt-header__topbar-welcome kt-hidden-mobile">
                Hi,
              </span>
            )}

            {showHi && (
              <span className="kt-header__topbar-username kt-hidden-mobile">
                {user.name}
              </span>
            )}

            {showAvatar && <img alt="Pic" src={user.pic} />}

            {showBadge && (
              <span className="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold">
                {user.name.substring(0, 1)}
              </span>
            )}
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">
          {/** ClassName should be 'dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl' */}
          <div
            className="kt-user-card kt-user-card--skin-dark kt-notification-item-padding-x"
            style={{
              backgroundImage: `url(${toAbsoluteUrl("/media/misc/bg-1.jpg")})`
            }}
          >
            <div className="kt-user-card__avatar">
              <img alt="Pic" className="kt-hidden" src={user.pic} />
              <span className="kt-badge kt-badge--lg kt-badge--rounded kt-badge--bold kt-font-success">
                {user.name.substring(0, 1)}
              </span>
            </div>
            <div className="kt-user-card__name">{user.name}</div>
            {/* <div className="kt-user-card__badge">
              <span className="btn btn-success btn-sm btn-bold btn-font-md">
                23 messages
              </span>
            </div> */}
          </div>
          <div className="kt-notification">
            <Link
              onClick={() => {
                document.body.click();
              }}
              to="/setting"
              className="kt-notification__item"
            >
              <div className="kt-notification__item-icon">
                <i className="flaticon2-calendar-3 kt-font-success" />
              </div>
              <div className="kt-notification__item-details">
                <div className="kt-notification__item-title kt-font-bold">
                  ตั้งค่าโปรไฟล์ของฉัน
                </div>
                <div className="kt-notification__item-time">
                  การตั้งค่าบัญชีและอื่น ๆ
                </div>
              </div>
            </Link>
            <div className="kt-notification__custom">
              <Link
                to="/logout"
                className="btn btn-label-brand btn-sm btn-bold"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

const mapStateToProps = ({ auth: { user } }) => ({
  user
});

export default connect(mapStateToProps, auth.actions)(UserProfile);
