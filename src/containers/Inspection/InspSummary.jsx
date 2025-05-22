import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Stack, useTheme } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ActionButton from "../../component/Buttons/ActionButton";
import { useAlert } from "../../component/Alerts/AlertContext";
import { primaryColor } from "../../config/config";
import ExcelExport from "../../component/Excel/Excel";
import InspSummaryTable from "../../component/Table/InspSummaryTable";
import { inspectionApis } from "../../service/Inspection/inspection";
import ApproveConfirmation from "./ApproveConfirmation";

function BasicBreadcrumbs({ mId }) {
  const style = {
    display: "flex",
    alignItems: "center",
    fontSize: "1.2rem",
    color: primaryColor,
    "@media (max-width: 600px)": {
      fontSize: "1rem", // Reduce font size on smaller screens
    },
    fontWeight: "bold",
  };

  return (
    <div
      role="presentation"
      style={{
        display: "flex",
        flexDirection: "row",
        maxWidth: "fit-content",
        alignItems: "center",
      }}
    >
      <Stack spacing={2} sx={{ flex: 1 }}>
        <Breadcrumbs
          separator={
            <NavigateNextIcon
              fontSize="small"
              sx={{
                color: primaryColor,
              }}
            />
          }
          aria-label="breadcrumb"
        >
          <Typography underline="hover" sx={style} key="1">
            {mId !== 31 ? 'Inspection Product list ' : 'Authorize Product list'}
          </Typography>
        </Breadcrumbs>
      </Stack>
    </div>
  );
}

const DefaultIcons = ({ iconsClick, userAction }) => {

  const hasEditAction = userAction?.some((action) => action.Action === "Edit");
  const hasAproove = userAction.some((action) => action.Action == "Authorize");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "5px",
        alignItems: "center",
        overflowX: "auto",
        scrollbarWidth: "thin",
      }}
    >
      {/* {userAction.some((action) => action.Action === "New") && (
        <ActionButton
          iconsClick={iconsClick}
          icon={"fa-solid fa-plus"}
          caption={"New"}
          iconName={"new"}
        />
      )} */}
      {userAction?.some((action) => action.Action === "Edit") && (
        <ActionButton
          iconsClick={iconsClick}
          icon={"fa-solid fa-pen"}
          caption={"Edit"}
          iconName={"edit"}
        />
      )}
      {hasAproove &&
        <>
          <ActionButton
            iconsClick={iconsClick}
            icon={"fa-solid fa-thumbs-up"}
            caption={"Approve"}
            iconName={"approve"}
          />
          <ActionButton
            iconsClick={iconsClick}
            icon={"fa-solid fa-ban"}
            caption={"Reject"}
            iconName={"reject"}
          />
          <ActionButton
            iconsClick={iconsClick}
            icon={"fa-solid fa-file-pen"}
            caption={"Correction"}
            iconName={"correction"}
          />
          <ActionButton
                                iconsClick={iconsClick}
                                icon={"fa-regular fa-rectangle-xmark"}
                                caption={"Suspend"}
                                iconName={"suspend"}
                            />

        </>}

      {userAction?.some((action) => action.Action === "Excel") && (
        <ActionButton
          iconsClick={iconsClick}
          icon={"fa-solid fa-file-excel"}
          caption={"Excel"}
          iconName={"excel"}
        />
      )}
      
      {!hasEditAction &&
        userAction?.some((action) => action.Action === "View") && (
          <ActionButton
            iconsClick={iconsClick}
            icon={"fa-solid fa-eye"}
            caption={"View"}
            iconName={"view"}
          />
        )}
      <ActionButton
        iconsClick={iconsClick}
        icon={"fa-solid fa-xmark"}
        caption={"Close"}
        iconName={"close"}
      />
    </Box>
  );
};

export default function InspSummary({
  setPageRender,
  setId,
  userAction,
  Id,
  setProductId,
  setBackId,
  menuIdLocal,
  mainDetails,
  setMainDetails,
  setNewId
}) {

  const inspection = ["AuthorizedOn", "AuthorizedBy"]
  const authorize = ["ModifiedOn", "ModifiedBy"]

  const [rows, setRows] = React.useState([]); //To Pass in Table
  const [displayLength, setdisplayLength] = React.useState(25); // Show Entries
  const [pageNumber, setpageNumber] = React.useState(1); //Table current page number
  const [changesTriggered, setchangesTriggered] = React.useState(false); //Any changes made like delete, add new role then makes it true for refreshing the table
  const [selectedDatas, setselectedDatas] = React.useState([]); //selected rows details
  const [selectedProduct, setselectedProduct] = React.useState([]);
  const [selectedStatus, setselectedStatus] = React.useState([]);
  const [totalRows, settotalRows] = useState(null); // Total rows of Api response
  const [refreshFlag, setrefreshFlag] = React.useState(true); //To take data from Data base
  const [searchKey, setsearchKey] = useState(""); //Table Searching
  const [totalPages, setTotalPages] = useState(null);
  const { showAlert } = useAlert();
  const [confirmAlert, setConfirmAlert] = useState(false); //To handle alert open
  const [confirmData, setConfirmData] = useState({}); //To pass alert data
  const [property, setProperty] = useState(false);
  const [itemLabel, setItemLabel] = useState('');
  const [mainDetails1, setMainDetails1] = useState({
    Remarks: null,
  });

  const latestSearchKeyRef = useRef(searchKey);

  const loginName = localStorage.getItem("LoginName");

  const { getInspectionSummary, upsertmultiapprove, getAssignjoborderlist, getjoborderproductlistsummary } =
    inspectionApis();


  //Role Summary
  const fetchRoleSummary = async () => {
    setselectedDatas([]);
    const currentSearchKey = latestSearchKeyRef.current;
    let Type;
    if (menuIdLocal == 31) {
      Type = 2;
    }
    else if (menuIdLocal == 28) {
      Type = 1;
    }
    else {
      return;
    }
    try {

      let response;
      if (!Id) {
        if (mainDetails?.Allocation) {
          setNewId(true)
        }
        response = await getjoborderproductlistsummary({
          id: mainDetails?.Allocation,
          pageNo: pageNumber,
          pageSize: displayLength,
          search: currentSearchKey,
        });
      }
      else {
        setNewId(false);
        response = await getInspectionSummary({
          allocation: Id,
          pageNo: pageNumber,
          pageSize: displayLength,
          search: currentSearchKey,
          type: Type,
          status: mainDetails?.Status
        });
      }
      // setMainDetails({
      //   Allocation:Id
      // })
      setBackId(Id)
      setrefreshFlag(false);
      if (
        response?.status === "Success" &&
        currentSearchKey === latestSearchKeyRef.current
      ) {
        const myObject = JSON.parse(response?.result);

        setRows(myObject?.Data);

        const totalRows = myObject?.Metadata.TotalRows;
        const totalPages = myObject?.Metadata.TotalPages;

        settotalRows(totalRows);
        setTotalPages(totalPages);
      }


      else {
        setRows([]);
      }
    } catch (error) {
      if (currentSearchKey === latestSearchKeyRef.current) {
        setRows([]);
        settotalRows(null);
        setTotalPages(null);

      }
    } finally {
    }
  };

  React.useEffect(() => {
    fetchRoleSummary(); // Initial data fetch
  }, [pageNumber, displayLength, searchKey, changesTriggered, mainDetails?.Allocation, mainDetails?.Status]);




  const handleRowDoubleClick = (rowiId, row) => {
    if (rowiId > 0 && userAction.some((action) => action.Action === "View" || action.Action === "Edit")) {
      // if(menuIdLocal == 29 && row.CreatedBy !== loginName){
      //   showAlert('info',"You can't edit")
      //     return;
      // }
      // if(menuIdLocal === 29 && (row?.Status === 'Approved' || row?.Status === 'Rejected' || row?.Status === 'Suspended' ))
      //   {
      //     showAlert('info',"This product is Authorized can't edit")
      //     return;
      //   }
      setId(rowiId);
      setProductId(row?.Product)
      setPageRender(3);
    }
  };

  const handleSearchKeyChange = (newSearchKey) => {
    setsearchKey(newSearchKey);
    latestSearchKeyRef.current = newSearchKey;
  };

  const handleSelectedRowsChange = (selectedRowsData) => {
    setselectedDatas(selectedRowsData);
  };
  const handleSelectedRowsChangeProduct = (selectedRowsData) => {
    setselectedProduct(selectedRowsData);
  };
  const handleSelectedRowsChangeStatus = (selectedRowsData) => {
    setselectedStatus(selectedRowsData);
  };
  const resetChangesTrigger = () => {
    setchangesTriggered(false);
  };
  const handleDisplayLengthChange = (newDisplayLength) => {
    setdisplayLength(newDisplayLength);
  };

  const handlepageNumberChange = (newpageNumber) => {
    setpageNumber(newpageNumber);
  };

  const hardRefresh = () => {
    setrefreshFlag(true);
    setselectedDatas([]);
    setsearchKey("")
    latestSearchKeyRef.current = ""
    setchangesTriggered(!changesTriggered);
  };

  const handleIconsClick = (value) => {
    switch (value) {
      case "new":
        handleAdd("new");
        break;
      case "edit":
        handleAdd("edit");
        break;
      case "view":
        handleAdd("edit");
        break;
      case "approve":
        handleProperty(value);
        break;
      case "reject":
        handleProperty(value);
        break;
      case "correction":
        handleProperty(value);
        break;
      case "suspend":
        handleProperty(value);
        break;
      case "excel":
        handleExcelExport();
        break;
      case "close":
        handleclose();
      default:
        break;
    }
  };

  const handleclose = () => {
    setMainDetails({})
    setNewId(false)
    setPageRender(1);
    setselectedStatus([])
  };



  // Handlers for your icons
  const handleAdd = (value) => {
    if (value === "edit") {
      if (selectedDatas.length !== 1) {
        showAlert(
          "info",
          selectedDatas.length === 0
            ? "Please Select row  "
            : "Can't Select Multiple Row"
        );
        return;
      }
      // if(menuIdLocal == 29 && (selectedStatus[0]?.Status === 'Approved' || selectedStatus[0]?.Status === 'Rejected' || selectedStatus[0]?.Status === 'Suspended'))
      // {
      //   showAlert('info',"This product is Authorized can't edit")
      //   return;
      // }
      setId(selectedDatas[0]);
      setProductId(selectedProduct[0]);
    } else {
      setId(0);
    }
    setPageRender(3);
  };


  const handleExcelExport = async () => {
    let Type;
    if (menuIdLocal == 31) {
      Type = 2;
    }
    else if (menuIdLocal == 28) {
      Type = 1;
    }
    else {
      return;
    }
    try {
      const response = await getInspectionSummary({
        allocation: Id,
        pageNumber: 0,
        pageSize: 0,
        search: "",
        type: Type
      });
      const excludedFields = ["Id","AuthorizedBy","AuthorizedOn","ModifiedBy","ModifiedOn"];
      const filteredRows = JSON.parse(response?.result)?.Data;

      await ExcelExport({
        reportName: menuIdLocal !== 31 ? 'Inspection Product list' : 'Authorize Product list',
        filteredRows,
        excludedFields,
      });
    } catch (error) { }
  };


  const handleProperty = (value) => {
    if (selectedDatas.length === 0) {
      showAlert(
        "info", "Please Select row ");
      return;
    }
    const blockedStatuses = ["Approved", "Rejected", "Suspended","Correction"];

    // Get all items with blocked status
    const blockedItems = selectedStatus.filter(item => blockedStatuses.includes(item?.Status));

    if (menuIdLocal === 31 && blockedItems?.length > 0) {
      const certNos = blockedItems?.map(item => item.CertificateNo).join(", ");
      showAlert('info', `These products are Already Authorized. Certificate No(s): ${certNos}`);
      return;
    }
    setItemLabel(value)
    setConfirmData({
      message: `You want to Approve.`,
      type: "info",
      header: value == 'correction' ? 'Correction' : value == 'suspend' ? 'Suspend' : "Authorization",
    });
    setProperty(true);
    
    
  };

  const handleAuthorize = async (status) => {

    const saveData = {
      status: status,
      remarks: mainDetails1?.Remarks,
      idCollection: selectedDatas.map(id => ({ id })) // Convert [197, 196] → [{ id: 197 }, { id: 196 }]
    };

    try {
      const response = await upsertmultiapprove(saveData);
      if (response?.status === "Success") {
        showAlert("success", response?.message);
        handleApproveClose();
        hardRefresh();
        setMainDetails1({});
      }
    } catch (error) {
      throw error
    }

  }

  const handleApproveClose = () => {
    setProperty(false);
    setMainDetails1({});
    // setselectedDatas([])
  }




  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 1.5,
            paddingRight: 1.5,
            flexWrap: "wrap",
          }}
        >
          <BasicBreadcrumbs mId={menuIdLocal} />
          <DefaultIcons iconsClick={handleIconsClick} userAction={userAction} />
        </Box>
        <Box sx={{ width: "100%", overflowX: "auto", paddingBottom: "10px" }}>
          <InspSummaryTable
            rows={rows}
            //onExportData={handleExportData}
            onDisplayLengthChange={handleDisplayLengthChange}
            onpageNumberChange={handlepageNumberChange}
            //  onSortChange={handleSortChange}
            onSearchKeyChange={handleSearchKeyChange}
            changesTriggered={changesTriggered}
            setchangesTriggered={resetChangesTrigger}
            onSelectedRowsChange={handleSelectedRowsChange}
            onSelectedProductChange={handleSelectedRowsChangeProduct}
            onSelectedStatusChange={handleSelectedRowsChangeStatus}
            onRowDoubleClick={handleRowDoubleClick}
            totalRows={totalRows}
            //   currentTheme={currentTheme}
            totalPages={totalPages}
            hardRefresh={hardRefresh}
            IdName={"Id"}
            statusName={menuIdLocal == 31 ? authorize : inspection}
            getAssignjoborderlist={getAssignjoborderlist}
            mainDetails={mainDetails}
            setMainDetails={setMainDetails}
            id={Id}
            menuIdLocal={menuIdLocal}
          />
        </Box>

        <ApproveConfirmation
          handleClose={handleApproveClose}
          open={property}
          data={confirmData}
          submite={handleAuthorize}
          itemLabel={itemLabel}
          mainDetails={mainDetails1}
          setMainDetails={setMainDetails1}
        />
      </Box>
    </>
  );
}


