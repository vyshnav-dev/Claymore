import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Stack, useTheme } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ActionButton from "../../component/Buttons/ActionButton";
import { useAlert } from "../../component/Alerts/AlertContext";
import SummaryTable from "../../component/Table/SummaryTable";
import { primaryColor } from "../../config/config";
import ConfirmationAlert from "../../component/Alerts/ConfirmationAlert";
import ExcelExport from "../../component/Excel/Excel";
import { allocationApis } from "../../service/Allocation/allocation";
import { useNavigate } from "react-router-dom";

function BasicBreadcrumbs() {
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
            RiskAssessment 
          </Typography>
        </Breadcrumbs>
      </Stack>
    </div>
  );
}

const DefaultIcons = ({ iconsClick, userAction }) => {
  const hasEditAction = userAction.some((action) => action.Action === "Edit");
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
     
      {userAction.some((action) => action.Action === "Edit") && (
        <ActionButton
          iconsClick={iconsClick}
          icon={"fa-solid fa-pen"}
          caption={"Edit"}
          iconName={"edit"}
        />
      )}
      {userAction.some((action) => action.Action === "Excel") && (
        <ActionButton
          iconsClick={iconsClick}
          icon={"fa-solid fa-file-excel"}
          caption={"Excel"}
          iconName={"excel"}
        />
      )}
      
      {!hasEditAction &&
        userAction.some((action) => action.Action === "View") && (
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

export default function RiskMainSummary({
  setPageRender,
  setId,
  userAction,
}) {
  const [rows, setRows] = React.useState([]); //To Pass in Table
  const [displayLength, setdisplayLength] = React.useState(25); // Show Entries
  const [pageNumber, setpageNumber] = React.useState(1); //Table current page number
  const [changesTriggered, setchangesTriggered] = React.useState(false); //Any changes made like delete, add new role then makes it true for refreshing the table
  const [selectedDatas, setselectedDatas] = React.useState([]); //selected rows details
  const [totalRows, settotalRows] = useState(null); // Total rows of Api response
  const [refreshFlag, setrefreshFlag] = React.useState(true); //To take data from Data base
  const [searchKey, setsearchKey] = useState(""); //Table Searching
  const [totalPages, setTotalPages] = useState(null);
  const { showAlert } = useAlert();
  const [confirmAlert, setConfirmAlert] = useState(false); //To handle alert open
  const [confirmData, setConfirmData] = useState({}); //To pass alert data
  const latestSearchKeyRef = useRef(searchKey);
  
  const { GetAllocatedJobOrderSummary,deleteAllocatedJobOrder} =
    allocationApis();
    const navigate = useNavigate();

  //Role Summary
  const fetchRoleSummary = async () => {
    setselectedDatas([]);
    const currentSearchKey = latestSearchKeyRef.current;

    try {
      const response = await GetAllocatedJobOrderSummary({
        pageNo: pageNumber,
        pageSize: displayLength,
        search: currentSearchKey,
        type:1,
      });

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
      } else {
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
  }, [pageNumber, displayLength, searchKey, changesTriggered]);


 

  const handleRowDoubleClick = (rowiId) => {
    if (rowiId > 0 && userAction.some((action) => action.Action === "View" || action.Action === "Edit")) {
      setId(rowiId);
      setPageRender(2);
    }
  };

  const handleSearchKeyChange = (newSearchKey) => {
    setsearchKey(newSearchKey);
    latestSearchKeyRef.current = newSearchKey;
  };

  const handleSelectedRowsChange = (selectedRowsData) => {
    setselectedDatas(selectedRowsData);
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
      case "edit":
        handleAdd("edit");
        break;
      case "view":
        handleAdd("edit");
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
    navigate('/home');
  };

  

  // Handlers for your icons
  const handleAdd = (value) => {
    if (value === "edit") {
      if (selectedDatas.length !== 1) {
        showAlert(
          "info",
          selectedDatas.length === 0
            ? "Please Select row "
            : "Can't Select Multiple Row"
        );
        return;
      }
      setId(selectedDatas[0]);
    } else {
      setId(0);
    }
    setPageRender(2);
  };

  

  //confirmation
  const handleConfrimOpen = () => {
    setConfirmAlert(true);
  };
  const handleConfrimClose = () => {
    setConfirmAlert(false);
  };

  const handleExcelExport = async () => {
    try {
      const response = await GetAllocatedJobOrderSummary({
        type:1,
        pageNumber: 0,
        pageSize: 0,
        search: "",
      });
      const excludedFields = ["Id","ModifiedBy","ModifiedOn","Status"];
      const filteredRows = JSON.parse(response?.result)?.Data;

      await ExcelExport({
        reportName: "Risk Assessment Job Orders",
        filteredRows,
        excludedFields,
      });
    } catch (error) {}
  };

  
 
  
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
          <BasicBreadcrumbs />
          <DefaultIcons iconsClick={handleIconsClick} userAction={userAction} />
        </Box>
        <Box sx={{ width: "100%", overflowX: "auto", paddingBottom: "10px" }}>
          <SummaryTable
            rows={rows}
            //onExportData={handleExportData}
            onDisplayLengthChange={handleDisplayLengthChange}
            onpageNumberChange={handlepageNumberChange}
            //  onSortChange={handleSortChange}
            onSearchKeyChange={handleSearchKeyChange}
            changesTriggered={changesTriggered}
            setchangesTriggered={resetChangesTrigger}
            onSelectedRowsChange={handleSelectedRowsChange}
            onRowDoubleClick={handleRowDoubleClick}
            totalRows={totalRows}
            //   currentTheme={currentTheme}
            totalPages={totalPages}
            hardRefresh={hardRefresh}
            IdName={"Id"}
            statusName={'Status'}
            remarks={'Remarks'}
          />
        </Box>
        {/* <ConfirmationAlert
          handleClose={handleConfrimClose}
          open={confirmAlert}
          data={confirmData}
          submite={handledeleteRole}
        /> */}
        
      </Box>
    </>
  );
}

