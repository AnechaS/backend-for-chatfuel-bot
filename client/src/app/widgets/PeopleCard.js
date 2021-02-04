import React, { useState } from "react";
import moment from "moment";
import { Portlet, PortletBody } from "../partials/content/Portlet";
import { GENDERS } from "../utils/constants";

export default function PeopleCard({
  firstname = "",
  lastname = "",
  gender,
  pic,
  createdAt,
  showBtn = true,
  onClickBtn,
}) {
  const [isImgError, setIsImgError] = useState(false);

  let name = firstname ? `${firstname} ` : "";
  name += lastname;

  return (
    <Portlet>
      <PortletBody>
        <div className="kt-widget kt-widget--user-profile-5">
          <div className="kt-widget__head">
            <div className="kt-widget__media">
              {!pic || isImgError ? (
                <div className="kt-widget__pic kt-widget__pic--brand kt-font-brand kt-font-boldest">
                  {name.substring(0, 2)}
                </div>
              ) : (
                <img
                  className="kt-widget__img"
                  width={90}
                  height={90}
                  src={pic}
                  onError={() => setIsImgError(true)}
                  alt=""
                />
              )}
            </div>
            <div className="kt-widget__info">
              <span className="kt-widget__username text-truncate">
                {name || "— —"}
              </span>
            </div>
          </div>
          <div className="kt-widget__body">
            <div className="kt-widget__item">
              <div className="kt-widget__contact">
                <span className="kt-widget__label">เพศ:</span>
                <span className="kt-widget__data text-truncate">
                  {gender && GENDERS[gender]}
                </span>
              </div>
              <div className="kt-widget__contact">
                <span className="kt-widget__label">วันที่สร้าง:</span>
                <span className="kt-widget__data text-truncate">
                  {createdAt && moment(createdAt).format("ll")}
                </span>
              </div>
            </div>
          </div>
          {showBtn && (
            <div className="kt-widget__footer">
              <button
                className="btn btn-label-brand btn-lg"
                onClick={onClickBtn}
              >
                ดูข้อมูล
              </button>
            </div>
          )}
        </div>
      </PortletBody>
    </Portlet>
  );
}
