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
import { reportApis } from "../../../service/Report/report";
import ExcelExport from "../../../component/Excel/Excel";
import ReportSummary from "../../../component/Table/ReportSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
                        Unallocated Technician Report
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

export default function TechnicianReport({ userAction, disabledDetailed }) {
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

    const { getunallocatedtechnicianreport } = reportApis();
    useEffect(() => {
        const fetchData = async () => {
            await tagDetails();
        };
        fetchData();
    }, [pageNumber, displayLength, searchKey, changesTriggered]);

    const tagDetails = async () => {
        const currentSearchKey = latestSearchKeyRef.current;
        try {

            const response = await getunallocatedtechnicianreport({
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
                setChecked(false);
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
        window.history.back();
    };

    const handleExcel = async () => {
        const response = await getunallocatedtechnicianreport({
            pageNumber: 0,
            pageSize: 0,
            search: "",
        });
        const excludedFields = [
            
            "Id",
        ];
        const filteredRows = JSON.parse(response?.result)?.Data;
        await ExcelExport({
            reportName: "Unallocated Technician Report",
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

