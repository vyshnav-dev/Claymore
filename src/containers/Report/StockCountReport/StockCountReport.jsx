import React, { useRef, useState } from "react";
import {
  Box,
  Stack,
  Button as ButtonM,
  Typography,
  Slide,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import PropTypes from "prop-types";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect } from "react";
import ConfirmationAlert from "../../../component/Alerts/ConfirmationAlert";
import ActionButton from "../../../component/Buttons/ActionButton";
import { useAlert } from "../../../component/Alerts/AlertContext";
import { primaryColor } from "../../../config/config";
import UserInputField from "../../../component/InputFields/UserInputField";
import { stockCountApis } from "../../../service/Transaction/stockcount";
import ChecKBoxLabel from "../../../component/CheckBox/CheckBoxLabel";
import WarehouseAutoComplete from "../../../component/AutoComplete/WarehouseAutoComplete";
import { reconciliationApis } from "../../../service/Transaction/reconciliation";
import ReconEntityAutoComplete from "../../../component/AutoComplete/ReconciliationAutoComplete/ReconEntityAutoComplete";
import ReconciliationTable from "../../Transaction/Reconciliation/ReconciliationTable";
import { reportApis } from "../../../service/Report/report";
import UserAutoCompleteManual from "../../../component/AutoComplete/UserAutoCompleteManual";
import ReportTable from "../../../component/Table/ReportTable";
import ExcelExport from "../../../component/Excel/Excel";
import ReportSummary from "../../../component/Table/ReportSummary";
import UserAutoComplete from "../../../component/AutoComplete/UserAutoComplete";
import ReportBinAutoComplete from "../../../component/AutoComplete/ReportAutoComplete/ReportBinAutoComplete";
import NormalButton from "../../../component/Buttons/NormalButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const currentDate = new Date().toISOString().split("T")[0];
const suggestionType = [
  { Id: 1, Name: "Reconciliation Date" },
  { Id: 2, Name: "Doc Date" },
];
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function BasicBreadcrumbs({ viewAction, status }) {
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
            !status ? (
              <NavigateNextIcon
                onClick={viewAction}
                fontSize="small"
                sx={{
                  cursor: "pointer",
                  color: primaryColor,
                }}
              />
            ) : (
              <ExpandMoreIcon
                onClick={viewAction}
                fontSize="small"
                sx={{
                  cursor: "pointer",
                  color: primaryColor,
                }}
              />
            )
          }
          aria-label="breadcrumb"
        >
          <Typography underline="hover" sx={style} key="1">
            Stock Count Report
          </Typography>
          <Typography underline="hover" sx={style} key="1"></Typography>
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

export default function StockCountReport({ userAction, disabledDetailed }) {
  const [mainDetails, setMainDetails] = useState({
    fromDate: currentDate,
    toDate: currentDate,
    BE: null,
    Warehouse: null,
    Type: 1,
    product: null,
    bin: null,
  });
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [confirmData, setConfirmData] = useState({});
  const [confirmType, setConfirmType] = useState(null);
  const {
    getwarehousebyentity,
    gettaglist,
    getproductbyentity,
    getbinbywarehouse,
  } = stockCountApis();
  const { showAlert } = useAlert();
  const [rows, setRows] = React.useState([]); //To Pass in Table
  const [displayLength, setdisplayLength] = React.useState(25); // Show Entries
  const [pageNumber, setpageNumber] = React.useState(1); //Table current page number
  const [changesTriggered, setchangesTriggered] = React.useState(false); //Any changes made like delete, add new role then makes it true for refreshing the table
  const [totalRows, settotalRows] = useState(null); // Total rows of Api response
  const [refreshFlag, setrefreshFlag] = React.useState(true); //To take data from Data base
  const [searchKey, setsearchKey] = useState(""); //Table Searching
  const [totalPages, setTotalPages] = useState(null);
  const latestSearchKeyRef = useRef(searchKey);
  const [checked, setChecked] = React.useState(true);
  const containerRef = React.useRef(null);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const { getstockcountreport } = reportApis();
  useEffect(() => {
    const fetchData = async () => {
      await tagDetails();
    };
    fetchData();
  }, [pageNumber, displayLength, searchKey, changesTriggered]);

  const tagDetails = async () => {
    const currentSearchKey = latestSearchKeyRef.current;
    try {
      if (
        mainDetails?.BE &&
        mainDetails.fromDate &&
        mainDetails.toDate &&
        mainDetails?.Type
      ) {
        const response = await getstockcountreport({
          bE: mainDetails.BE,
          fromDate: mainDetails.fromDate,
          toDate: mainDetails.toDate,
          type: mainDetails?.Type,
          warehouse: mainDetails?.Warehouse,
          product: mainDetails?.product,
          bin: mainDetails?.bin,
          refreshFlag: refreshFlag,
          pageNumber: pageNumber,
          pageSize: displayLength,
          searchString: currentSearchKey,
        });
        if (
          response?.status === "Success" &&
          currentSearchKey === latestSearchKeyRef.current
        ) {
          const myObject = JSON.parse(response?.result);

          setRows(myObject?.Data);

          const totalRows = myObject?.PageSummary[0].TotalRows;
          const totalPages = myObject?.PageSummary[0].TotalPages;

          settotalRows(totalRows);
          setTotalPages(totalPages);
          setChecked(false);
        } else {
          setRows([]);
        }
      } else {
        setRows([]);
      }
    } catch (error) {
      if (currentSearchKey === latestSearchKeyRef.current) {
        setRows([]);
        settotalRows(null);
        setTotalPages(null);
      }
    }
  };

  const handleSearchKeyChange = (newSearchKey) => {
    setsearchKey(newSearchKey);
    latestSearchKeyRef.current = newSearchKey;
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
    setchangesTriggered(true);
  };

  const handleIconsClick = async (value) => {
    switch (value.trim()) {
      case "close":
        handleclose();
        break;
      case "excel":
        if (!rows?.length) {
          showAlert("info", "No data found");
          return;
        }
        handleExcel();
        break;
      default:
        break;
    }
  };
  // Handlers for your icons

  const handleclose = () => {
    window.history.back();
  };

  const handleExcel = async () => {
    const response = await getstockcountreport({
      bE: mainDetails.BE,
      fromDate: mainDetails.fromDate,
      toDate: mainDetails.toDate,
      type: mainDetails?.Type,
      warehouse: mainDetails?.Warehouse,
      product: mainDetails?.product,
      bin: mainDetails?.bin,
      refreshFlag: true,
      pageNumber: 0,
      pageSize: 0,
      searchString: "",
    });
    const excludedFields = [
      "BE",
      "Product",
      "Unit",
      "Warehouse",
      "Bin",
      "TransId",
    ];
    const filteredRows = JSON.parse(response?.result)?.Data;
    await ExcelExport({
      reportName: "Stock Count Report",
      filteredRows,
      excludedFields,
    });
  };

  //confirmation

  const handleConfirmSubmit = () => {
    setConfirmAlert(false);
    setConfirmData({});
    setConfirmType(null);
  };
  const handleConfrimClose = () => {
    setConfirmAlert(false);
    setConfirmData({});
    setConfirmType(null);
  };

  return (
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
        <BasicBreadcrumbs viewAction={handleChange} status={checked} />
        <DefaultIcons
          iconsClick={handleIconsClick}
          userAction={userAction}
          disabledDetailed={disabledDetailed}
        />
      </Box>
      {checked && (
        <Slide in={checked} container={containerRef.current}>
          <Box
            ref={containerRef}
            sx={{
              width: "100%",
              overflowX: "auto",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              scrollbarWidth: "thin",
              paddingBottom: "10px",
            }}
          >
            <Box
              sx={{
                width: "98%",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                paddingTop: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-start", // Changed from center to flex-start
                  padding: 1,
                  gap: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",

                  flexWrap: "wrap",
                  "@media (max-width: 768px)": {
                    gap: "10px", // Reduced width for small screens
                  },
                  "@media (max-width: 420px)": {
                    gap: "2px", // Reduced width for small screens
                  },
                }}
              >
                <UserInputField
                  label={"From Date"}
                  name={"fromDate"}
                  type={"date"}
                  disabled={false}
                  mandatory={true}
                  value={mainDetails}
                  setValue={setMainDetails}
                />

                <UserInputField
                  label={"To Date"}
                  name={"toDate"}
                  type={"date"}
                  disabled={false}
                  mandatory={true}
                  value={mainDetails}
                  setValue={setMainDetails}
                />
                <ReconEntityAutoComplete
                  apiKey={gettaglist}
                  formData={mainDetails}
                  setFormData={setMainDetails}
                  label={"Entity"}
                  autoId={"entity"}
                  formDataName={"BEName"}
                  formDataiId={"BE"}
                  required={true}
                  tagId={1}
                />

                <UserAutoCompleteManual
                  formData={mainDetails}
                  setFormData={setMainDetails}
                  label={"Type"}
                  autoId={"type"}
                  required={true}
                  suggestion={suggestionType}
                  formDataId={"Type"}
                />

                <WarehouseAutoComplete
                  apiKey={getwarehousebyentity}
                  formData={mainDetails}
                  setFormData={setMainDetails}
                  label={"Warehouse"}
                  autoId={"warehouse"}
                  formDataName={"WarehouseName"}
                  formDataiId={"Warehouse"}
                  disable={false}
                  beId={mainDetails?.BE}
                />

                <UserAutoComplete
                  apiKey={getproductbyentity}
                  formData={mainDetails}
                  setFormData={setMainDetails}
                  label={"Product"}
                  autoId={"product"}
                  required={false}
                  formDataiId={"product"}
                  formDataName={"productName"}
                  beId={mainDetails?.BE}
                />
                <UserAutoComplete
                  apiKey={gettaglist}
                  formData={mainDetails}
                  setFormData={setMainDetails}
                  label={"Bin"}
                  autoId={"bin"}
                  required={false}
                  formDataiId={"bin"}
                  formDataName={"binName"}
                  tagId={17}
                />
                <Box p={1.9}>
                  <NormalButton label={"Search"} action={tagDetails} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Slide>
      )}
      {rows?.length || latestSearchKeyRef?.current ? (
        <ReportSummary
          rows={rows}
          //onExportData={handleExportData}
          onDisplayLengthChange={handleDisplayLengthChange}
          onpageNumberChange={handlepageNumberChange}
          //  onSortChange={handleSortChange}
          onSearchKeyChange={handleSearchKeyChange}
          changesTriggered={changesTriggered}
          setchangesTriggered={resetChangesTrigger}
          // onSelectedRowsChange={handleSelectedRowsChange}
          // onRowDoubleClick={handleRowDoubleClick}
          totalRows={totalRows}
          //   currentTheme={currentTheme}
          totalPages={totalPages}
          hardRefresh={hardRefresh}
          IdName={"TransId"}
          length={checked}
        />
      ) : null}

      <ConfirmationAlert
        handleClose={handleConfrimClose}
        open={confirmAlert}
        data={confirmData}
        submite={handleConfirmSubmit}
      />
    </Box>
  );
}
