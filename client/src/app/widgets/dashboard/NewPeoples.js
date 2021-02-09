import React, { useState, useEffect } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { getWidgetById } from "../../crud/widget.crud";
import {
  Portlet,
  PortletHeader,
  PortletBody
} from "../../partials/content/Portlet";

const colorMedials = ["success", "danger", "warning", "info"];

const Image = ({ src, renderError }) => {
  const [isImgError, setIsImgError] = useState(false);
  if (!src || isImgError) {
    return renderError || null;
  }

  return <img src={src} onError={() => setIsImgError(true)} alt="" />;
};

export default function NewPeoples({ query, limit = 5 }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getWidgetById(10, { q: JSON.stringify(query), limit })
      .then(response => {
        const body = response.data;
        setData(body.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query, limit]);

  let content = data.map(
    ({ _id, firstName, lastName, province, district, pic }, i) => {
      return (
        <div key={_id} className="kt-widget4__item">
          <div className="kt-widget4__pic kt-widget4__pic--pic">
            <Image
              src={pic}
              renderError={
                <div
                  className={`kt-media kt-media--sm kt-media--${colorMedials[
                    i
                  ] || "warning"}`}
                >
                  <span>{firstName.substring(0, 2)}</span>
                </div>
              }
            />
          </div>
          <div className="kt-widget4__info ">
            <div className="kt-widget4__username">
              {firstName} {lastName}
            </div>
            <p className="kt-widget4__text ">
              ที่อยู่ จ. {province || "อื่่นๆ"} ต. {district || "อื่นๆ"}
            </p>
          </div>
        </div>
      );
    }
  );

  if (isLoading) {
    content = Array(limit)
      .fill()
      .map((_, i) => (
        <div key={(i + 1).toString()} className="kt-widget4__item">
          <div className="kt-widget4__pic kt-widget4__pic--pic">
            <Skeleton variant="rect" width={32} height={32} />
          </div>
          <div className="kt-widget4__info ">
            <div className="kt-widget4__username">
              <Skeleton variant="text" />
            </div>
            <Skeleton variant="text" />
          </div>
        </div>
      ));
  }

  return (
    <>
      <Portlet fluidHeight={true}>
        <PortletHeader title="ผู้ใช้งานใหม่" />
        <PortletBody>
          <div className="kt-widget4">{content}</div>
        </PortletBody>
      </Portlet>
    </>
  );
}
