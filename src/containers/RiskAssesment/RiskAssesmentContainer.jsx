import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { securityApis } from "../../service/Security/security";
import RiskAssesmentSummary from "./RiskAssesmentSummary";
import RiskAssesmentDetails from "./RiskAssesmentDetails";

export default function RiskAssesmentContainer() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [id, setId] = useState(0);
  const [menuIdLocal, setmenuIdLocal] = useState(null);
  const [userAction, setuserAction] = useState([]);
  const menuId = location?.state;
  const navigate = useNavigate();
  const { getuseractionsforscreen } = securityApis();

  useEffect(() => {
    if (menuId?.ScreenId) setmenuIdLocal(menuId?.ScreenId);
    else if (menuId?.ScreenId == undefined && menuIdLocal == null) {
      navigate("/home");
    }
    setPage(1);
  }, [menuId?.ScreenId]);

  useEffect(() => {
    const fetchUserActions = async () => {
      try {
        const response = await getuseractionsforscreen({
          screenId: menuIdLocal,
        });
        const data = JSON.parse(response?.result);
        setuserAction(data);
      } catch (error) {
        navigate("/home");
      }
    };
    if (menuIdLocal) fetchUserActions();
  }, [menuIdLocal]);

  return (
    <>
      {page === 1 ? (
        <RiskAssesmentSummary
          setPageRender={setPage}
          setId={setId}
          Id={id}
          userAction={userAction}
          screenId={menuId}
 
        />
      ) : page === 2 ? (
        <RiskAssesmentDetails
          setPageRender={setPage}
          detailPageId={id}
          userAction={userAction}
        />
      ) : null}
    </>
  );
}
