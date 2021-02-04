import React, { useEffect } from "react";
import KTContent from "../../../_metronic/layout/KtContent";
import SubHeader from "../../partials/layout/SubHeader";
import ChangeUserInfo from "./ChangeUserInfo";
import ChangePassword from "./ChangePassword";

export default function SettingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <KTContent>
      <SubHeader>
        <SubHeader.Main></SubHeader.Main>
      </SubHeader>

      <ChangeUserInfo />
      <ChangePassword />
    </KTContent>
  );
}
