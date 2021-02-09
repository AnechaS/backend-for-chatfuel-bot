import React, { useEffect } from "react";
import KTContent from "../../../_metronic/layout/KtContent";
import SubHeader from "../../partials/layout/SubHeader";
import LayoutBuilder from "../../component/LayoutBuilder";
import ChangeUserInfo from "../../component/ChangeUserInfo";
import ChangePassword from "../../component/ChangePassword";

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
      <LayoutBuilder />
    </KTContent>
  );
}
