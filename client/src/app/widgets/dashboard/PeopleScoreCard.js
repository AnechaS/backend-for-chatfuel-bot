import React, { useState, useEffect } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { getWidgetById } from "../../crud/widget.crud";
import { Portlet, PortletBody } from "../../partials/content/Portlet";

export default function PeopleScoreCard({ title, desc, query }) {
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getWidgetById(1, { q: JSON.stringify(query) })
      .then(response => {
        const body = response.data;
        setValue(body.value);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query]);

  return (
    <Portlet className="kt-portlet--height-fluid-half kt-portlet--border-bottom-brand">
      <PortletBody fluid={true}>
        <div className="kt-widget35">
          <div className="kt-widget35__content">
            <span className="kt-widget35__title">
              {!isLoading ? title : <Skeleton variant="text" />}
            </span>
            <span className="kt-widget35__number">
              {!isLoading ? value : <Skeleton variant="text" width="60%" />}
            </span>
            <span className="kt-widget35__desc">
              {!isLoading ? desc : <Skeleton variant="text" />}
            </span>
          </div>
        </div>
      </PortletBody>
    </Portlet>
  );
}
