import React from "react";
import UserProfile from "../../../app/partials/layout/UserProfile";
// import SearchDropdown from "../../../app/partials/layout/SearchDropdown";

export default class Topbar extends React.Component {
  render() {
    return (
      <div className="kt-header__topbar">
        {/* <SearchDropdown useSVG="true" /> */}
        <UserProfile showAvatar={false} showHi={true} showBadge={true} />
      </div>
    );
  }
}
