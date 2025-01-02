import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { securityApis } from "../../service/Security/security";
import TimeRecordSummary from "./TimeRecordSummary";
import TimeRecordDetails from "./TimeRecordDetails";

export default function TimeRecordContainer() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [id, setId] = useState(0);
  const [menuIdLocal, setmenuIdLocal] = useState(null);
  const [userAction, setuserAction] = useState([]);
  const [group, setGroup] = useState(0)
  const [groupSelection, setGroupSelection] = useState([])
  const menuId = location?.state;
  const navigate = useNavigate();
  const { getuseractionsforscreen } = securityApis();

  useEffect(() => {
    if (menuId?.ScreenId) setmenuIdLocal(menuId?.ScreenId);
    else if (menuId?.ScreenId == undefined && menuIdLocal == null) {
      navigate("/home");
    }
    setPage(1);
    setGroup(0)
    setGroupSelection([])
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
        <TimeRecordSummary
          setPageRender={setPage}
          setId={setId}
          Id={id}
          userAction={userAction}
          screenId={menuId}
          setGroup={setGroup}
          setGroupSelection={setGroupSelection}
 
        />
      ) : page === 2 ? (
        <TimeRecordDetails
          setPageRender={setPage}
          detailPageId={id}
          userAction={userAction}
          group={group}
          groupSelection={groupSelection}
        />
      ) : null}
    </>
  );
}

