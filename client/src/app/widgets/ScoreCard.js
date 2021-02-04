import React from "react";
import { Portlet, PortletBody } from "../partials/content/Portlet";

export default function ScoreCard({ title, desc, number }) {
  return (
    <Portlet className="kt-portlet--height-fluid-half kt-portlet--border-bottom-brand">
      <PortletBody fluid={true}>
        <div className="kt-widget35">
          <div className="kt-widget35__content">
            <span className="kt-widget35__title">{title}</span>
            <span className="kt-widget35__number">{number}</span>
            <span className="kt-widget35__desc">{desc}</span>
          </div>
        </div>
      </PortletBody>
    </Portlet>
  );
}
