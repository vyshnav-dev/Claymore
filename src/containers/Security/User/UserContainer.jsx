import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { securityApis } from "../../../service/Security/security";
import UserDetails from "./UserDetails";
import UserSummary from "./UserSummary";

export default function UserContainer() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [id, setId] = useState(0);
  const [menuIdLocal, setmenuIdLocal] = useState(null);
  const [userAction, setuserAction] = useState([]);
  const menuId = location?.state;
  const navigate = useNavigate();
  const { getuseractionsforscreen } = securityApis()

  useEffect(() => {
    if (menuId?.ScreenId) setmenuIdLocal(menuId?.ScreenId);
    else if (menuId?.ScreenId == undefined && menuIdLocal == null) {
      navigate("/home")
    }
    setPage(1)
  }, [menuId?.ScreenId]);

 


  useEffect(() => {
    const fetchUserActions = async () => {
      try {
        const response = await getuseractionsforscreen({ ScreenId: menuIdLocal });
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
        <UserSummary
          setPageRender={setPage}
          setId={setId}
          Id={id}
          userAction={userAction}
          screenId={menuId}
        />
      ) : page === 2 ? (
        <UserDetails
          setPageRender={setPage}
          detailPageId={id}
          userAction={userAction}
        />
      ) : null}
    </>
  );
}
