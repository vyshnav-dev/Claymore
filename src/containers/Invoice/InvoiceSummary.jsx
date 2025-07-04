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
import NormalModal from "../../component/Modal/NormalModal";
import { allocationApis } from "../../service/Allocation/allocation";
import InvoiceModal from "./InvoiceModal";

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
             Completed Job Orders
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
      
      {userAction.some((action) => action.Action === "Invoice") && (
        <ActionButton
          iconsClick={iconsClick}
          icon={"fa-solid fa-file-invoice"}
          caption={"Invoice"}
          iconName={"invoice"}
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
      
      

      
      <ActionButton
        iconsClick={iconsClick}
        icon={"fa-solid fa-xmark"}
        caption={"Close"}
        iconName={"close"}
      />
    </Box>
  );
};

export default function InvoiceSummary({
  setPageRender,
  setId,
  userAction,
  Id
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
  const [addMenu, setAddMenu] = useState(false);
  const { GetAllocatedJobOrderSummary,deleteAllocatedJobOrder  } =
    allocationApis();

  //Role Summary
  const fetchRoleSummary = async () => {
    setselectedDatas([]);
    const currentSearchKey = latestSearchKeyRef.current;
    
    try {
      const response = await GetAllocatedJobOrderSummary({
        pageNo: pageNumber,
        pageSize: displayLength,
        search: currentSearchKey,
        type:5
      });

      setrefreshFlag(false);
      if (
        response?.status === "Success" &&
        currentSearchKey === latestSearchKeyRef.current
      ) {
        const myObject = JSON.parse(response?.result);
        setRows(myObject?.Data );

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
  }, [pageNumber, displayLength, searchKey, changesTriggered,refreshFlag]);



  const handleRowDoubleClick = (rowiId) => {
    if (rowiId > 0 && userAction.some((action) => action.Action === "Access")) {
      setId(rowiId);
      setAddMenu(true);
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
      case "invoice":
        handleAdd("invoice");
        break;
      case "delete":
        deleteClick();
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
    if (value === "invoice") {
      if (selectedDatas.length !== 1) {
        showAlert(
          "info",
          selectedDatas.length === 0
            ? "Select a row  "
            : "Can't Select multiple rows"
        );
        return;
      }
     
      setId(selectedDatas[0]);
    } else {
      setId(0);
      
    }
    setAddMenu(true);
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
      let response = await deleteAllocatedJobOrder(deletePayload);

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
      const response = await GetAllocatedJobOrderSummary({
        pageNumber: 0,
        pageSize: 0,
        search: "",
        type:5
      });
      const excludedFields = ["Id","ModifiedBy","ModifiedOn"];
      const filteredRows = JSON.parse(response?.result)?.Data;

      await ExcelExport({
        reportName: "Completed Job Orders",
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
            // setchangesTriggered={resetChangesTrigger}
            onSelectedRowsChange={handleSelectedRowsChange}
            onRowDoubleClick={handleRowDoubleClick}
            totalRows={totalRows}
            //   currentTheme={currentTheme}
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

<NormalModal
        isOpen={addMenu}
        handleCloseModal={() => setAddMenu(false)}
      >
        <InvoiceModal
          handleCloseModal={() => setAddMenu(false)}
          selected={Id}
          hardRefresh={hardRefresh}
          userAction={userAction}
        />
      </NormalModal>
        
      </Box>
    </>
  );
}



