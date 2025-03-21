import React, { useState } from "react";
import {
    Box,
    Stack,
    Button as ButtonM,
    useTheme,
    useMediaQuery,
    Typography,
    TableCell,
    Table,
    TableHead,
    TableRow,
    TableContainer,
    IconButton,
    Paper,
    TableBody,
    Button,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import PropTypes from "prop-types";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect } from "react";
import ConfirmationAlert from "../../component/Alerts/ConfirmationAlert";
import ActionButton from "../../component/Buttons/ActionButton";
import { useAlert } from "../../component/Alerts/AlertContext";
import {
    primaryColor,
    secondaryColor,
    thirdColor,
} from "../../config/config";
import UserInputField from "../../component/InputFields/UserInputField";
import { stockCountApis } from "../../service/Transaction/stockcount";
import { masterApis } from "../../service/Master/master";

import { MDBIcon } from "mdb-react-ui-kit";
// import MasterSelectionAutoComplete from "../MasterWarehouse/MasterSelectionAutoComplete";
import UserAutoComplete from "../../component/AutoComplete/UserAutoComplete";
// import UserAutoCompleteManual from "../../../component/AutoComplete/UserAutoCompleteManual";
// import ChecKBoxLabel from "../../../component/CheckBox/CheckBoxLabel";
// import MasterParentAutoComplete from "../../../component/AutoComplete/MasterAutoComplete/MasterParentAutoComplete";
// import MasterProductUnitInfo from "./MasterProductUnitInfo";
// import MasterProductConfirmation from "./MasterProductConfirmation";
import { Info } from "@mui/icons-material";
import MultiCheckBox from "../../component/MultiCheckBox.jsx/MultiCheckBox";
import { inspectionApis } from "../../service/Inspection/inspection";
import { allocationApis } from "../../service/Allocation/allocation";
const currentDate = new Date().toISOString().split("T")[0];
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
const headerCellStyle = {
    padding: "0px 4px",
    border: `1px solid #ddd`,
    fontWeight: "600",
    fontSize: "14px",
    color: "white",
};

const bodyCellStyle = {
    border: `1px solid #ddd`,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "12px",
};

const iconsExtraSx = {
    fontSize: "0.8rem",
    padding: "0.4rem",
    "&:hover": {
        backgroundColor: thirdColor,
    },
};

const visibleHeaders = ["Name"];

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

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
                        Acknowledgement Details
                    </Typography>
                </Breadcrumbs>
            </Stack>
        </div>
    );
}
const DefaultIcons = ({ iconsClick, detailPageId, userAction }) => {
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
            {/* {userAction.some(
                (action) => action.Action === "New" && detailPageId !== 0
            ) && (
                    <ActionButton
                        iconsClick={iconsClick}
                        icon={"fa-solid fa-plus"}
                        caption={"New"}
                        iconName={"new"}
                    />
                )} */}
            {userAction.some(
                (action) =>
                    (action.Action === "New" && detailPageId === 0) ||
                    (action.Action === "Edit" && detailPageId !== 0)
            ) && (
                    <ActionButton
                        iconsClick={iconsClick}
                        icon={"save"}
                        caption={"Save"}
                        iconName={"save"}
                    />
                )}
            <ActionButton
                iconsClick={iconsClick}
                icon={"fa-solid fa-circle-arrow-left"}
                caption={"Prev"}
                iconName={"prev"}
            />
            <ActionButton
                iconsClick={iconsClick}
                icon={"fa-solid fa-circle-arrow-right"}
                caption={"Next"}
                iconName={"next"}
            />
            {userAction.some((action) => action.Action === "Delete") && (
                <>
                    {detailPageId != 0 ? (
                        <ActionButton
                            iconsClick={iconsClick}
                            icon={"trash"}
                            caption={"Delete"}
                            iconName={"delete"}
                        />
                    ) : null}
                </>
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



export default function AckDetails({
    setPageRender,
    detailPageId: summaryId,
    userAction,
    disabledDetailed,
}) {
    const [mainDetails, setMainDetails] = useState({});
    const [detailPageId, setDetailPageId] = useState(summaryId);
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [confirmData, setConfirmData] = useState({});
    const [confirmType, setConfirmType] = useState(null);



    const { showAlert } = useAlert();
    const {
        getAcknowledgemenDetails,
        upsertAcknowledgement,
        deleteAcknowledgement
    } = inspectionApis();

    const {
        getrecordprevnext
    } = allocationApis();

    useEffect(() => {
        const fetchData = async () => {
            await tagDetails();
        };
        fetchData();
    }, [detailPageId]);

    const tagDetails = async () => {
        try {
            if (detailPageId == 0) {
                handleNew();
            } else {
                const response = await getAcknowledgemenDetails({
                    id: detailPageId,
                });
                if (response?.status === "Success") {
                    const myObject = JSON.parse(response?.result);

                    if (myObject) {
                        const formattedDate = myObject[0]?.TargetDateOfClosure?.split("T")[0];

                        // Update the main details with the formatted date
                        setMainDetails({
                            ...myObject[0],
                            TargetDateOfClosure: formattedDate,
                        });
                    }

                } else {
                    handleNew();
                }
            }
        } catch (error) {
            throw error;
        }
    };

    const handleNew = async () => {
        setMainDetails({
            Finding: null,
            CriticalFinding: null,
            TargetDateOfClosure: null,
            OtherRemarks: null,
            JobOrderNo: null,
            Id: detailPageId,
            Allocation: null,
        });

        setDetailPageId(0);
    };





    const handleIconsClick = async (value) => {
        switch (value.trim()) {
            case "new":
                handleNew();
                break;
            case "close":
                handleclose();
                break;
            case "save":
                const emptyFields = [];
                // if (!mainDetails?.Finding) emptyFields.push("Finding");
                // if (!mainDetails.CriticalFinding) emptyFields.push("Critical Finding");
                // if (!mainDetails.TargetDateOfClosure) emptyFields.push("TargetDate Of Closure");
                // if (!mainDetails.OtherRemarks) emptyFields.push("Other Remarks");

                if (emptyFields.length > 0) {
                    showAlert("info", `Please Provide ${emptyFields[0]}`);
                    return;
                }

                setConfirmData({ message: "Save", type: "success" });
                setConfirmType("save");
                setConfirmAlert(true);
                break;
                case "prev":
                handlePrevNext(1);
                break;
            case "next":
                handlePrevNext(2);
                break;
            case "delete":
                setConfirmData({ message: "Delete", type: "danger" });
                setConfirmType("delete");
                setConfirmAlert(true);
                break;
            default:
                break;
        }
    };
    // Handlers for your icons

    const handleclose = () => {
        setPageRender(1);
    };

    const handlePrevNext = async (value) =>{
        const response = await getrecordprevnext({
            allocation:null,
            category:4,
            id: detailPageId,
            type:value
        })
        if (response.status == "Success") {
            const detailId = Number(response.result)
            setDetailPageId(detailId)
            
        }
    }

    const handleSave = async () => {

        const saveData = {
            id: mainDetails?.Id,
            allocation: mainDetails?.Allocation,
            finding: mainDetails?.Finding,
            criticalFinding: mainDetails?.CriticalFinding,
            targetDateOfClosure: mainDetails?.TargetDateOfClosure,
            otherRemarks: mainDetails?.OtherRemarks,

        };
        const response = await upsertAcknowledgement(saveData);
        if (response.status === "Success") {

            showAlert("success", response?.message);
            handleNew();
            const actionExists = userAction.some((action) => action.Action === "New");
            if (!actionExists) {
                setPageRender(1);
            }
        }
    };

    //confirmation

    const handleConfirmSubmit = () => {
        if (confirmType === "save") {
            handleSave();
        } else if (confirmType === "delete") {
            if (detailPageId == 0) {
                setConfirmAlert(false);
                setConfirmData({});
                setConfirmType(null);
                return;
            }
            deleteClick();
        }
        setConfirmAlert(false);
        setConfirmData({});
        setConfirmType(null);
    };
    const handleConfrimClose = () => {
        setConfirmAlert(false);
        setConfirmData({});
        setConfirmType(null);
    };

    //Delete alert open
    const deleteClick = async () => {
        let response;
        response = await deleteAcknowledgement([{ id: detailPageId }]);
        if (response?.status === "Success") {
            showAlert("success", response?.message);
            handleNew();
            const actionExists = userAction.some((action) => action.Action === "New");
            if (!actionExists) {
                setPageRender(1);
            }
        }
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
                <BasicBreadcrumbs />
                <DefaultIcons
                    detailPageId={detailPageId}
                    iconsClick={handleIconsClick}
                    userAction={userAction}
                    disabledDetailed={disabledDetailed}
                />
            </Box>
            <Box
                sx={{
                    width: "100%",
                    overflowX: "auto",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    paddingBottom: "30px",
                }}
            >
                <Box
                    sx={{
                        width: "98%",
                        margin: "auto",
                        display: "flex",
                        flexDirection: "column",
                        paddingTop: "10px",
                        gap: '20px'
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
                            label={"JobOrder No"}
                            name={"JobOrderNo"}
                            type={"text"}
                            disabled={true}
                            mandatory={true}
                            value={mainDetails}
                            setValue={setMainDetails}
                            maxLength={100}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                width: "100%",
                                flexDirection: "row",
                                justifyContent: "flex-start", // Changed from center to flex-start
                                padding: 1,
                                gap: "10px",

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
                                label={"Findings"}
                                name={"Finding"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                multiline={true}
                                maxLength={50}
                            />
                            <UserInputField
                                label={"Critical Finding"}
                                name={"CriticalFinding"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                multiline={true}
                                maxLength={60}
                            />
                            <UserInputField
                                label={"Other Remarks"}
                                name={"OtherRemarks"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                multiline={true}
                                maxLength={60}
                            />
                            <UserInputField
                                label={"Target Date of Closure"}
                                name={"TargetDateOfClosure"}
                                type={"date"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                            />


                        </Box>









                    </Box>

                </Box>
            </Box>

            <ConfirmationAlert
                handleClose={handleConfrimClose}
                open={confirmAlert}
                data={confirmData}
                submite={handleConfirmSubmit}
            />

            {/* <MasterProductConfirmation
        handleClose={() => setProperty(false)}
        open={property}
        data={confirmData}
        submite={handlePropertyConfirmation}
        selectedDatas={detailPageId ? detailPageId : null}
      /> */}
        </Box>
    );
}


