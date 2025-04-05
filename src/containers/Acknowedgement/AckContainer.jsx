import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { securityApis } from "../../service/Security/security";
import AckSummary from "./AckSummary";
import AckDetails from "./AckDetails";
import AckMainSummary from "./AckMainSummary";
import InspDetails from "../Inspection/InspDetails";

export default function AckContainer() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [id, setId] = useState(0);
  const [backId1, setBackId1] = useState(0);
  const [backId, setBackId] = useState(0);
  const [productId, setProductId] = useState(0);
  const [inspId, setInspId] = useState(0);
  const [newId,setNewId] = useState(false);
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
        <AckMainSummary
          setPageRender={setPage}
          setId={setId}
          Id={id}
          userAction={userAction}
          screenId={menuId}
 
        />
      ):page === 2 ? (
        <AckSummary
          setPageRender={setPage}
          setId={setId}
          Id={id}
          setBackId1={setBackId1}
          userAction={userAction}
          screenId={menuId}
 
        />
      ) : page === 3 ? (
        <AckDetails
          setPageRender={setPage}
          detailPageId={id}
          userAction={userAction}
          setProductId={setProductId}
          setId={setId}
          backId1={backId1}
          setBackId={setBackId}
          setInspId={setInspId}
        />
      ):page === 4 ? (
        <InspDetails
          setPageRender={setPage}
          detailPageId={inspId}
          userAction={userAction}
          productId={productId}
          backId={backId}
          setId={setId}
          newId={newId}
          menuId={menuId?.ScreenId}
          menuLabel={'Acknowedgement'}
        />
      ) : null}
    </>
  );
}

