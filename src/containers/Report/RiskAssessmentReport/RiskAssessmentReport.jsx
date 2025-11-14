import React, { useRef, useState } from "react";
import {
  Box,
  Stack,
  Button as ButtonM,
  Typography,
  Paper,
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
import { reportApis } from "../../../service/Report/report";
import ExcelExport from "../../../component/Excel/Excel";
import ReportSummary from "../../../component/Table/ReportSummary";
import NormalButton from "../../../component/Buttons/NormalButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { allocationApis } from "../../../service/Allocation/allocation";
import UserAutoComplete from "../../../component/AutoComplete/UserAutoComplete";
import { useNavigate } from "react-router-dom";
const currentDate = new Date().toLocaleDateString("en-CA");

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
            Risk Assessment Report
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

const icon = (
  <Paper sx={{ m: 1, width: 100, height: 100 }} elevation={4}>
    <svg>
      <Box
        component="polygon"
        points="0,100 50,00, 100,100"
        sx={(theme) => ({
          fill: theme.palette.common.white,
          stroke: theme.palette.divider,
          strokeWidth: 1,
        })}
      />
    </svg>
  </Paper>
);

export default function RiskAssessmentReport({ userAction, disabledDetailed }) {
  const navigate = useNavigate();
  const [mainDetails, setMainDetails] = useState({
    fromDate: currentDate,
    toDate: currentDate,
  });
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [confirmData, setConfirmData] = useState({});
  const [confirmType, setConfirmType] = useState(null);
  const { showAlert } = useAlert();
  const [rows, setRows] = React.useState([]); //To Pass in Table
  const [displayLength, setdisplayLength] = React.useState(25); // Show Entries
  const [pageNumber, setpageNumber] = React.useState(1); //Table current page number
  const [changesTriggered, setchangesTriggered] = React.useState(false); //Any changes made like delete, add new role then makes it true for refreshing the table
  const [totalRows, settotalRows] = useState(null); // Total rows of Api response
  const [refreshFlag, setrefreshFlag] = React.useState(true); //To take data from Data base
  const [searchKey, setsearchKey] = useState(""); //Table Searching
  const [totalPages, setTotalPages] = useState(null);
  const [checked, setChecked] = React.useState(true);
  const latestSearchKeyRef = useRef(searchKey);
  const containerRef = React.useRef(null);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  const {
    getclientlist, GetTechnicianList
  } = allocationApis();

  const { getriskassessmentreport } = reportApis();
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
        mainDetails.fromDate &&
        mainDetails.toDate
      ) {
        const response = await getriskassessmentreport({
          fromDate: mainDetails.fromDate,
          toDate: mainDetails.toDate,
          inspector: mainDetails?.Technician,
          client: mainDetails?.Client,
          pageNo: pageNumber,
          pageSize: displayLength,
          search: currentSearchKey,
        });
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
          // setChecked(false);
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
    setsearchKey("")
    latestSearchKeyRef.current = ""
    setchangesTriggered(!changesTriggered);
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
    navigate('/home');
  };

  const handleExcel = async () => {
    const response = await getriskassessmentreport({
      fromDate: mainDetails.fromDate,
      toDate: mainDetails.toDate,
      inspector: mainDetails?.Technician,
      client: mainDetails?.Client,
      pageNumber: 0,
      pageSize: 0,
      search: "",
    });
    const excludedFields = [
      "Id"
    ];
    const formatedFrom = new Date(mainDetails?.fromDate).toLocaleDateString("en-GB").split("/").join("-");
    const formatedTo = new Date(mainDetails?.toDate).toLocaleDateString("en-GB").split("/").join("-");
    const filteredRows = JSON.parse(response?.result)?.Data;
    await ExcelExport({
      reportName: formatedFrom == formatedTo?`Risk Assessment Report(${formatedFrom})`:`Risk Assessment Report(${formatedFrom} - ${formatedTo})`,
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

                <UserAutoComplete
                  apiKey={getclientlist}
                  formData={mainDetails}
                  setFormData={setMainDetails}
                  label={"Client"}
                  autoId={"Client"}
                  required={false}
                  formDataiId={"Client"}
                  formDataName={"Client_Name"}
                />

                <UserAutoComplete
                  apiKey={GetTechnicianList}
                  formData={mainDetails}
                  setFormData={setMainDetails}
                  label={"Technician"}
                  autoId={"Technician"}
                  required={false}
                  formDataiId={"Technician"}
                  formDataName={"Technician_Name"}
                />
                <Box p={1.9}>
                  <NormalButton label={"Search"} action={tagDetails} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Slide>
      )}

     
        <ReportSummary
          rows={rows}
          onDisplayLengthChange={handleDisplayLengthChange}
          onpageNumberChange={handlepageNumberChange}
          onSearchKeyChange={handleSearchKeyChange}
          changesTriggered={changesTriggered}
          setchangesTriggered={resetChangesTrigger}
          totalRows={totalRows}
          totalPages={totalPages}
          hardRefresh={hardRefresh}
          IdName={"Id"}
          length={checked}
        />
    

      <ConfirmationAlert
        handleClose={handleConfrimClose}
        open={confirmAlert}
        data={confirmData}
        submite={handleConfirmSubmit}
      />
    </Box>
  );
}

