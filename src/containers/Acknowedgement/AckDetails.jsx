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
import { inspectionApis } from "../../service/Inspection/inspection";
import { allocationApis } from "../../service/Allocation/allocation";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import ImageModal from "../../component/Modal/ImageModal";
import AckTable from "./AckTable";

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
            {userAction.some((action) => action.Action === "View" || action.Action === "Edit") && (
                <>
                    {detailPageId != 0 ? (
                        <ActionButton
                            iconsClick={iconsClick}
                            icon={"fa-solid fa-circle-arrow-left"}
                            caption={"Prev"}
                            iconName={"prev"}
                        />
                    ) : null}
                </>
            )}
            {userAction.some((action) => action.Action === "View" || action.Action === "Edit") && (
                <>
                    {detailPageId != 0 ? (
                        <ActionButton
                            iconsClick={iconsClick}
                            icon={"fa-solid fa-circle-arrow-right"}
                            caption={"Next"}
                            iconName={"next"}
                        />
                    ) : null}
                </>
            )}
            {/* {userAction.some((action) => action.Action === "Delete") && (
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



export default function AckDetails({
    setPageRender,
    detailPageId: summaryId,
    userAction,
    disabledDetailed,
    setProductId,
    setInspId,
    setBackId,
    backId1,
    setId
}) {
    const [mainDetails, setMainDetails] = useState({});
    const [detailPageId, setDetailPageId] = useState(summaryId);
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [confirmData, setConfirmData] = useState({});
    const [confirmType, setConfirmType] = useState(null);
    const [isImageModalOpenSign, setIsImageModalOpenSign] = useState(false);
    const [rows, setRows] = useState([]);


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
                setBackId(detailPageId);
                const response = await getAcknowledgemenDetails({
                    id: detailPageId,
                });
                if (response?.status === "Success") {
                    const myObject = JSON.parse(response?.result);
                    setMainDetails(myObject?.Acknowledgement)
                    setRows(myObject?.Inspections)
                    
                } else {
                    handleNew();
                }
            }
        } catch (error) {
            throw error;
        }
    };

    





    const handleIconsClick = async (value) => {
        switch (value.trim()) {
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
        setId(backId1);
        setPageRender(2);
    };

    const handlePrevNext = async (value) => {
        try {
            const response = await getrecordprevnext({
                allocation: mainDetails?.Allocation,
                category: 4,
                id: detailPageId,
                type: value
            })
            if (response.status == "Success") {
                const detailId = Number(response.result)
                setDetailPageId(detailId)
            } else {
                showAlert("info", "No more records available.");
            }
        } catch (error) {
            throw error
        }

    }

    const handleSave = async () => {

        try {
            const saveData = {
                id: mainDetails?.Id,
                allocation: mainDetails?.Allocation,
                clientSign: mainDetails?.ClientSign
            };
            const response = await upsertAcknowledgement(saveData);
            if (response.status === "Success") {

                showAlert("success", response?.message);
                handleclose();
                
            }
        } catch (error) {
            throw error
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
                setPageRender(2);
            }
        }
    };


    const handleImageClickSign = (index) => {
        setIsImageModalOpenSign(true);
    };

    const handleCloseImagePopupSign = () => {
        setIsImageModalOpenSign(false);
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
                            justifyContent: "space-between", // Changed from center to flex-start
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

                        <AckTable rows={rows} excludedColumns={["Id","List"]} setInspId={setInspId} setProductId={setProductId} setPageRender={setPageRender} />

                        
                        <Box sx={{ width: '100%', display: "flex", flexDirection: "column", alignItems: "end", p: 3 }}>
                            {mainDetails?.ClientSignPath ? (
                                <img
                                    src={mainDetails?.ClientSignPath}
                                    alt="Thumbnail"
                                    style={{ cursor: "pointer", width: "50px", height: "50px",border: `1px solid #000` }}
                                    onClick={handleImageClickSign}
                                />
                            ) : (
                                <ImageNotSupportedIcon sx={{ color: secondaryColor }} />
                            )}
                            <Typography variant="body2" sx={{ mt: 1, color: "black", fontWeight: 'bold' }}> {/* Adjust color as needed */}
                                Client Sign
                            </Typography>
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
            <ImageModal
                isOpen={isImageModalOpenSign}
                imageUrl={mainDetails?.ClientSignPath}
                handleCloseImagePopup={handleCloseImagePopupSign}
            />


        </Box>
    );
}


