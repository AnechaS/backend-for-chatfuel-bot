import React, { useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import moment from "moment";
import Skeleton from "@material-ui/lab/Skeleton";
import { Portlet, PortletBody } from "../../partials/content/Portlet";
import { GENDERS } from "../../utils/constants";

export function ProfileCardSkeleton({ showActions = false }) {
  return (
    <Portlet>
      <PortletBody>
        <div className="kt-widget kt-widget--user-profile-5">
          <div className="kt-widget__head">
            <div className="kt-widget__media">
              <Skeleton variant="circle" width={90} height={90} />
            </div>
            <div className="kt-widget__info">
              <span className="kt-widget__username">
                <Skeleton
                  variant="text"
                  height={31}
                  style={{ marginBottom: 10 }}
                />
              </span>
            </div>
          </div>
          <div className="kt-widget__body">
            <div className="kt-widget__item">
              <div className="kt-widget__contact">
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="40%" />
              </div>
              <div className="kt-widget__contact">
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="40%" />
              </div>
              <div className="kt-widget__contact">
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="40%" />
              </div>
              <div className="kt-widget__contact">
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="40%" />
              </div>
              <div className="kt-widget__contact">
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="40%" />
              </div>
            </div>
          </div>
          {showActions && (
            <div className="kt-widget__footer">
              <Skeleton variant="rect" height={49} />
            </div>
          )}
        </div>
      </PortletBody>
    </Portlet>
  );
}

export function ProfileCard({ data, showActions = false, loading }) {
  const [isImgError, setIsImgError] = useState(false);
  const { path } = useRouteMatch();
  if (loading) {
    return <ProfileCardSkeleton showActions={showActions} />;
  }

  return (
    <Portlet>
      <PortletBody>
        <div className="kt-widget kt-widget--user-profile-5">
          <div className="kt-widget__head">
            <div className="kt-widget__media">
              {!data.pic || isImgError ? (
                <div className="kt-widget__pic kt-widget__pic--brand kt-font-brand kt-font-boldest">
                  {data.firstName ? data.firstName.substring(0, 2) : ""}
                </div>
              ) : (
                <img
                  className="kt-widget__img"
                  width={90}
                  height={90}
                  src={data.pic}
                  onError={() => setIsImgError(true)}
                  alt=""
                />
              )}
            </div>
            <div className="kt-widget__info">
              <span className="kt-widget__username text-truncate">
                {data.firstName} {data.lastName}
              </span>
              <span className="kt-widget__id" style={{ height: 15 }}>
                {/^\d{6}$/.test(data.dentalId) ? (
                  <>
                    <i className="fa fa-id-card"></i>
                    &nbsp;{data.dentalId}
                  </>
                ) : (
                  ""
                )}
              </span>
            </div>
          </div>
          <div className="kt-widget__body">
            <div className="kt-widget__item">
              <div className="kt-widget__contact">
                <span className="kt-widget__label">เพศ:</span>
                <span className="kt-widget__data text-truncate">
                  {GENDERS[data.gender]}
                </span>
              </div>
              <div className="kt-widget__contact">
                <span className="kt-widget__label">ที่อยู่:</span>
                <span className="kt-widget__data text-truncate">
                  อ.{data.district || "อื่นๆ"} จ.{data.province || "อื่นๆ"}
                </span>
              </div>
              <div className="kt-widget__contact">
                <span className="kt-widget__label">ลูกชื่อ:</span>
                <span className="kt-widget__data text-truncate">
                  {data.childName}
                </span>
              </div>
              <div className="kt-widget__contact">
                <span className="kt-widget__label">ลูกเกิดเมื่อ(พ.ศ.):</span>
                <span className="kt-widget__data text-truncate">
                  {data.childBirthday}
                </span>
              </div>
              <div className="kt-widget__contact">
                <span className="kt-widget__label">วันที่สร้าง:</span>
                <span className="kt-widget__data text-truncate">
                  {moment(data.createdAt).format("ll")}
                </span>
              </div>
            </div>
          </div>
          {showActions && (
            <div className="kt-widget__footer">
              <Link
                to={`${path}/${data._id}`}
                className="btn btn-label-brand btn-lg"
              >
                ดูข้อมูล
              </Link>
            </div>
          )}
        </div>
      </PortletBody>
    </Portlet>
  );
}
