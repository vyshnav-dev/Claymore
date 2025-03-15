import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { securityApis } from "../../service/Security/security";
import InspMainSummary from "./InspMainSummary";
import InspSummary from "./InspSummary";
import InspDetails from "./InspDetails";

export default function InspContainer() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [id, setId] = useState(0);
  const [backId, setBackId] = useState(0);
  const [mainDetails, setMainDetails] = useState({
    Allocation: null,
    JobOrderNo: null,
    Status:null,
  });
  const [newId,setNewId] = useState(false);
  const [productId, setProductId] = useState(0);
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
        <InspMainSummary
          setPageRender={setPage}
          setId={setId}
          Id={id}
          userAction={userAction}
          screenId={menuId}
          menuIdLocal={menuIdLocal}
        />
      ) : page === 2 ? (
        <InspSummary
          setPageRender={setPage}
          setId={setId}
          Id={id}
          userAction={userAction}
          screenId={menuId}
          setProductId={setProductId}
          setBackId={setBackId}
          menuIdLocal={menuIdLocal}
          mainDetails={mainDetails}
          setMainDetails={setMainDetails}
          setNewId={setNewId}
        />
      ) : page === 3 ? (
        <InspDetails
          setPageRender={setPage}
          detailPageId={id}
          userAction={userAction}
          productId={productId}
          backId={backId}
          setId={setId}
          mainDetails={mainDetails}
          setMainDetails={setMainDetails}
          newId={newId}
        />
      ) : null}
    </>
  );
}
