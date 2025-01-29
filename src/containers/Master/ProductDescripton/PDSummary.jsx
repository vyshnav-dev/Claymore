import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Stack, useTheme } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ActionButton from "../../../component/Buttons/ActionButton";
import { useAlert } from "../../../component/Alerts/AlertContext";
import SummaryTable from "../../../component/Table/SummaryTable";
import { primaryColor } from "../../../config/config";
import ConfirmationAlert from "../../../component/Alerts/ConfirmationAlert";
import { masterApis } from "../../../service/Master/master";
// import MasterProductConfirmation from "./MasterProductConfirmation";
import ExcelExport from "../../../component/Excel/Excel";
import { identity } from "lodash";

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
            Product Fields
          </Typography>
        </Breadcrumbs>
      </Stack>
    </div>
  );
}

const DefaultIcons = ({ iconsClick, userAction }) => {
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
      {userAction.some((action) => action.Action === "New") && (
        <ActionButton
          iconsClick={iconsClick}
          icon={"fa-solid fa-plus"}
          caption={"New"}
          iconName={"new"}
        />
      )}
      {userAction.some((action) => action.Action === "Edit") && (
        <ActionButton
          iconsClick={iconsClick}
          icon={"fa-solid fa-pen"}
          caption={"Add"}
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
      {/* {userAction.some((action) => action.Action === "Delete") && (
        <ActionButton
          iconsClick={iconsClick}
          icon={"trash"}
          caption={"Delete"}
          iconName={"delete"}
        />
      )} */}
      
      
      <ActionButton
        iconsClick={iconsClick}
        icon={"fa-solid fa-xmark"}
        caption={"Close"}
        iconName={"close"}
      />
    </Box>
  );
};

export default function PDSummary({
  setPageRender,
  setId,
  userAction,
  setGroup,
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
  const { GetProductSummary,updateproductproperties, gettagurl } =
    masterApis();
  const [groupId, setGroupId] = useState(0);
  const [parentList, setParentList] = useState([]);
  const longPressTriggeredRef = useRef(false); // Persist flag
  const longPressTimerRef = useRef(null); // Persist timer

  const longPressThreshold = 500;

  //Role Summary
  const fetchRoleSummary = async () => {
    setselectedDatas([]);
    setGroup(0);
    const currentSearchKey = latestSearchKeyRef.current;

    try {
      const response = await GetProductSummary({
        pageNo: pageNumber,
        pageSize: displayLength,
        search: currentSearchKey,
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
  }, [pageNumber, displayLength, searchKey, changesTriggered, groupId]);


  

  const handleRowDoubleClick = (rowiId) => {
    if (rowiId > 0) {
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
    setGroupId(0);
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
    setchangesTriggered(true);
  };

  const handleIconsClick = (value) => {
    switch (value) {
      case "new":
        handleAdd("new");
        break;
      case "edit":
        handleAdd("edit");
        break;
      case "delete":
        deleteClick();
        break;
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
    window.history.back();
  };

  

  // Handlers for your icons
  const handleAdd = (value) => {
    setGroup(0);
    if (value === "edit") {
      if (selectedDatas.length !== 1) {
        showAlert(
          "info",
          selectedDatas.length === 0
            ? "Select row to Add/Edit "
            : "Can't Edit Multiple Role"
        );
        return;
      }
      setId(selectedDatas[0]);
    } else {
      setId(0);
    }
    setPageRender(2);
  };

  //Delete alert open
  const deleteClick = async () => {
    if (selectedDatas.length === 0) {
      showAlert("info", "Select row to Delete");
      return;
    }
    setConfirmData({ message: "Delete", type: "danger" });
    handleConfrimOpen();
  };

  

  

  //To delete
  const handledeleteRole = async () => {
    const deletePayload = selectedDatas.map((item) => ({
      id: item,
    }));

    try {
      let response = await deletetag(deletePayload, 11);

      if (response?.status === "Success") {
        showAlert("success", response?.message);
      }
    } catch (error) {
    } finally {
      setrefreshFlag(true);
      setselectedDatas([]);
      setchangesTriggered(true);
      handleConfrimClose();
    }
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
      const response = await gettagsummary({
        tagId: 11,
        refreshFlag: true,
        pageNumber: 0,
        pageSize: 0,
        searchString: "",
      });
      const excludedFields = ["Id"];
      const filteredRows = JSON.parse(response?.result)?.Data;

      await ExcelExport({
        reportName: "Bin Summary",
        filteredRows,
        excludedFields,
      });
    } catch (error) {}
  };

  const handleLongPressStart = (event, row) => {
    longPressTriggeredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      const isHighlighted = row.Group;
      if (isHighlighted) {
        setGroupId(row?.Id);
        setPageRender(1);
      } else {
        setGroupId(0);
      }
    }, longPressThreshold);
  };

  // Function to handle the end of long press (mouse up or leave)
  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
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
            handleLongPressStart={handleLongPressStart}
            handleLongPressEnd={handleLongPressEnd}
            parentList={parentList}
            totalPages={totalPages}
            hardRefresh={hardRefresh}
            IdName={"Id"}
          />
        </Box>
        <ConfirmationAlert
          handleClose={handleConfrimClose}
          open={confirmAlert}
          data={confirmData}
          submite={handledeleteRole}
        />
        
      </Box>
    </>
  );
}

