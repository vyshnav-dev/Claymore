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
    Tooltip,
    Switch,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import PropTypes from "prop-types";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect } from "react";
import ConfirmationAlert from "../../component/Alerts/ConfirmationAlert";
import ActionButton from "../../component/Buttons/ActionButton";
import { useAlert } from "../../component/Alerts/AlertContext";
import {
    logoImage,
    primaryColor,
    secondaryColor,
    thirdColor,
} from "../../config/config";
import UserInputField from "../../component/InputFields/UserInputField";
import ChecKBoxLabel from "../../component/CheckBox/CheckBoxLabel";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import ImageModal from "../../component/Modal/ImageModal";
import { inspectionApis } from "../../service/Inspection/inspection";
import UserAutoComplete from "../../component/AutoComplete/UserAutoComplete";
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
                        Site Time Record Details
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

const bodyData = [
    { caption: 'Inspector carry the checklist', key: 'InspectorCarryTheCheckList', Checked: 0 }, // Default "No"
    { caption: 'Inspector carry Test Method', key: 'InspectorCarryTestMethod', Checked: 0 },   // Default "Yes"
    { caption: 'Inspector carry filled Risk assessment form', key: 'InspectorCarryFilledRiskAssesmentForm', Checked: 0 },
]

const docData = 'The above work has been completed / progressed :  I have read & confirm this report & time sheet & certify the work has been done to my satisfaction. Travelling time , expense & milleage will be charged extra.'

const scopeOfWork = ['Verification', 'VirtualTest', 'FunctionalTest', 'LoadTest', 'Witness']

export default function TimeRecordDetails({
    setPageRender,
    detailPageId: summaryId,
    userAction,
    disabledDetailed,
    setId,
    timeId,
}) {


    const userData = JSON.parse(localStorage.getItem("ClaymoreUserData"))[0];
    const [mainDetails, setMainDetails] = useState({});
    const [detailPageId, setDetailPageId] = useState(summaryId);
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [confirmData, setConfirmData] = useState({});
    const [confirmType, setConfirmType] = useState(null);
    const [tableBody, setTableBody] = useState(bodyData);
    const [isImageModalOpenSign, setIsImageModalOpenSign] = useState(false);


    const { showAlert } = useAlert();
    const {
        GetTimeSheetDetails,
        UpsertTimeSheet,
        deleteTimeSheet
    } = inspectionApis();

    const {
        GetTechnicianList
    } = allocationApis();

    useEffect(() => {
        const fetchData = async () => {
            await tagDetails();
        };
        fetchData();
    }, [detailPageId]);

    const handleImageClickSign = (index) => {
        setIsImageModalOpenSign(true);
    };

    const handleCloseImagePopupSign = () => {
        setIsImageModalOpenSign(false);
    };


    const tagDetails = async () => {
        try {
            if (detailPageId == 0) {
                handleNew();
            } else {
                const response = await GetTimeSheetDetails({
                    id: detailPageId,
                });
                if (response?.status === "Success") {
                    const myObject = JSON.parse(response?.result);
                    console.log('timesheet', myObject);
                    if (myObject) {
                        const formattedDate = myObject[0]?.DateOfInspection?.split("T")[0];

                        // Update the main details with the formatted date
                        setMainDetails({
                            ...myObject[0],
                            DateOfInspection: formattedDate,
                        });
                    }

                    // Map the values from myObject to bodyData
                    const updatedBodyData = bodyData.map((item) => {
                        return {
                            ...item,
                            Checked: myObject[0][item.key] !== undefined ? myObject[0][item.key] : item.Checked,
                        };
                    });

                    console.log('Updated BodyData:', updatedBodyData);
                    setTableBody(updatedBodyData); // Assuming you have a state for bodyData
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
            CSSCReportNo: null,
            Address: null,
            TravelHour: null,
            Verification: false,
            VirtualTest: false,
            TimeArrived: null,
            Id: detailPageId,
            PurchaseOrderNo: null,
            Location: null,
            LoadTest: false,
            Inspector: null,
            FunctionalTest: false,
            DateOfInspection: null,
            Allocation: null,
            Client_Name: null,
            Contact: null,
            EqpDescription: null,
            TimeLeft: null,
            SiteHour: null,
            TotalTime: null,
            Comments: null,
            Witness: false,
            CustomerAcceptanceCertificate: null,
        });
        setTableBody(bodyData)
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
                // if (!mainDetails?.Name) emptyFields.push("Name");
                // if (!mainDetails.Code) emptyFields.push("Code");
                // if (!mainDetails.Category) emptyFields.push("Category");
                // if (!mainDetails.Type) emptyFields.push("Type");
                // if (!baseUnit?.Unit) emptyFields.push("Base Unit");
                // if (!baseUnit?.Barcode) emptyFields.push("Bar Code");
                if (emptyFields.length > 0) {
                    showAlert("info", `Please Provide ${emptyFields[0]}`);
                    return;
                }
                setConfirmData({ message: "Save", type: "success" });
                setConfirmType("save");
                setConfirmAlert(true);
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
        setId(timeId)
        setPageRender(3);
    };

    const handleSave = async () => {
        const isAnyScopeOfWorkSelected = scopeOfWork.some((field) => mainDetails[field] === true);
        
        if (!isAnyScopeOfWorkSelected) {
            showAlert("info", "Please select at least one field in Scope of Work .");
            return; // Stop further execution if no field is selected
        }

        const isDoumentRequiredSelected = tableBody.some((item) => item.Checked === 1);
        if (!isDoumentRequiredSelected) {
            showAlert("info", "Please fill at least one field in Doument Required .");
            return; // Stop further execution if no field is selected
        }

        const saveData = {
            Id: detailPageId || 0,
            allocation: mainDetails?.Allocation,
            dateOfInspection: mainDetails?.DateOfInspection,
            timeArrived: mainDetails?.TimeArrived,
            timeLeft: mainDetails?.TimeLeft,
            siteHour: mainDetails?.SiteHour,
            travelHour: mainDetails?.TravelHour,
            totalTime: mainDetails?.TotalTime,
            comments: mainDetails?.Comments,
            eqpDescription: mainDetails?.EqpDescription,
            virtualTest: mainDetails?.VirtualTest,
            loadTest: mainDetails?.LoadTest,
            witness: mainDetails?.Witness,
            verification: mainDetails?.Verification,
            functionalTest:mainDetails?.FunctionalTest,
            inspector: mainDetails?.Inspector,
            customerAcceptanceCertificate: mainDetails?.CustomerAcceptanceCertificate,
        };

        console.log('inside save', tableBody);

        tableBody?.forEach((item) => {
            if (saveData) {
                saveData[item.key] = item.Checked; // Assign Checked value to the corresponding key in saveData
            }
        });
        console.log('9999', saveData);

        const response = await UpsertTimeSheet(saveData);
        if (response.status === "Success") {

            showAlert("success", response?.message);
            handleNew();
            const actionExists = userAction.some((action) => action.Action === "New");
            if (!actionExists) {
                handleclose();
            }
        }
    };


    const handleChangeValue = (key, updatedValue) => {
        setTableBody((prevState) => {
            // Create a copy of the tableBody array
            const updatedDocumentData = prevState.map((item) => {
                // Check if the current item's key matches the key to be updated
                if (item.key === key) {
                    return {
                        ...item,
                        ...updatedValue, // Update the Checked value
                    };
                }
                return item; // Return unchanged items
            });

            return updatedDocumentData; // Return the updated array
        });
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
        response = await deleteTimeSheet([{ id: detailPageId }]);
        if (response?.status === "Success") {
            showAlert("success", response?.message);
            handleNew();
            const actionExists = userAction.some((action) => action.Action === "New");
            if (!actionExists) {
                setPageRender(3);
            }
        }
    };









    console.log('dt', tableBody);


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
                        gap: '50px'
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            flexDirection: "column",
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <UserInputField
                                label={"CSSC Report No"}
                                name={"CSSCReportNo"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />

                            {/* {sign ? ( */}
                            <Box sx={{ display: 'flex' }}>
                                <Tooltip title="Inspector Sign">
                                    <IconButton
                                        onClick={handleImageClickSign}
                                        aria-label="signature"
                                    >
                                        <NoteAltIcon
                                            style={{
                                                textTransform: "none",
                                                color: `#26668b`,
                                            }}
                                        />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Client Sign">
                                    <IconButton
                                        onClick={handleImageClickSign}
                                        aria-label="signature"
                                    >
                                        <NoteAltIcon
                                            style={{
                                                textTransform: "none",
                                                color: `#26668b`,
                                            }}
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            {/* // ) : null} */}
                        </Box>


                        <Box sx={{
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
                        }} >
                            <UserInputField
                                label={"Job Order No"}
                                name={"JobOrderNo"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />
                            <UserInputField
                                label={"Purchase Order No"}
                                name={"PurchaseOrderNo"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "auto 1fr",
                                    alignItems: "center",
                                    width: "100%",
                                    paddingTop: 1,
                                }}
                            >
                                <Typography variant="body1">Inspection</Typography>
                                <Box
                                    sx={{
                                        borderBottom: "1px dotted",
                                        // borderBottmColor: getBorderColor(),
                                        marginLeft: "8px", // Adjust spacing to your preference
                                    }}
                                />
                            </Box>



                            <UserAutoComplete
                                apiKey={GetTechnicianList}
                                formData={mainDetails}
                                setFormData={setMainDetails}
                                label={"Inspector"}
                                autoId={"Inspector"}
                                required={false}
                                formDataName={"Inspector_Name"}
                                formDataiId={"Inspector"}
                                User={userData?.UserId}
                            />

                            <UserInputField
                                label={"Date of Inspection"}
                                name={"DateOfInspection"}
                                type={"date"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />
                            <UserInputField
                                label={"Time Arrived"}
                                name={"TimeArrived"}
                                type={"time"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />
                            <UserInputField
                                label={"Time Left"}
                                name={"TimeLeft"}
                                type={"time"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />

                            <UserInputField
                                label={"Site Hour"}
                                name={"SiteHour"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />
                            <UserInputField
                                label={"Travel Hours"}
                                name={"TravelHour"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />
                            <UserInputField
                                label={"Total Time"}
                                name={"TotalTime"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />
                            <UserInputField
                                label={"Comments if Required"}
                                name={"Comments"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />

                        </Box>


                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "auto 1fr",
                                alignItems: "center",
                                width: "100%",
                                paddingTop: 1,
                            }}
                        >
                            <Typography variant="body1">Customer Data</Typography>
                            <Box
                                sx={{
                                    borderBottom: "1px dotted",
                                    // borderBottmColor: getBorderColor(),
                                    marginLeft: "8px", // Adjust spacing to your preference
                                }}
                            />
                        </Box>



                        <Box sx={{
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
                        }}>

                            <UserInputField
                                label={"Customer Name"}
                                name={"Client_Name"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />

                            <UserInputField
                                label={"Company Name & Address"}
                                name={"Address"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />


                            <UserInputField
                                label={"Contact No"}
                                name={"Contact"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />

                            <UserInputField
                                label={"Equipment Location"}
                                name={"Location"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />

                            <UserInputField
                                label={"Equipment Description"}
                                name={"EqpDescription"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                multiline={true}
                            />

                        </Box>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "auto 1fr",
                                alignItems: "center",
                                width: "100%",
                                paddingTop: 1,
                            }}
                        >
                            <Typography variant="body1">Scope of Work</Typography>
                            <Box
                                sx={{
                                    borderBottom: "1px dotted",
                                    // borderBottmColor: getBorderColor(),
                                    marginLeft: "8px", // Adjust spacing to your preference
                                }}
                            />
                        </Box>

                        <Box sx={{
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
                        }}>

                            <ChecKBoxLabel
                                label={"Virtual Test"}
                                value={mainDetails}
                                changeValue={setMainDetails}
                                fieldName={"VirtualTest"}
                            />
                            <ChecKBoxLabel
                                label={" Functional Test"}
                                value={mainDetails}
                                changeValue={setMainDetails}
                                fieldName={"FunctionalTest"}
                            />
                            <ChecKBoxLabel
                                label={"Load Test"}
                                value={mainDetails}
                                changeValue={setMainDetails}
                                fieldName={"LoadTest"}
                            />
                            <ChecKBoxLabel
                                label={"Witness"}
                                value={mainDetails}
                                changeValue={setMainDetails}
                                fieldName={"Witness"}
                            />
                            <ChecKBoxLabel
                                label={"Verification"}
                                value={mainDetails}
                                changeValue={setMainDetails}
                                fieldName={"Verification"}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "auto 1fr",
                                alignItems: "center",
                                width: "100%",
                                paddingTop: 1,
                            }}
                        >
                            <Typography variant="body1">Documents Required</Typography>
                            <Box
                                sx={{
                                    borderBottom: "1px dotted",
                                    // borderBottmColor: getBorderColor(),
                                    marginLeft: "8px", // Adjust spacing to your preference
                                }}
                            />
                        </Box>

                        <Box sx={{
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
                        }}>
                            {tableBody?.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        width: '500px',
                                        height: '40%',
                                    }}
                                >
                                    {/* Caption Box */}
                                    <Box
                                        sx={{
                                            border: '1px solid',
                                            width: 'auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography sx={{ p: 1 }}>{item.caption}</Typography>
                                    </Box>

                                    {/* Switch Box */}
                                    <Box
                                        sx={{
                                            border: '1px solid',
                                            width: '30%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0 10px',
                                        }}
                                    >
                                        <Typography>No</Typography>
                                        <Switch
                                            checked={item.Checked === 1} // If Checked is 1, switch is "Yes"
                                            onChange={() =>
                                                handleChangeValue(item.key, { Checked: item.Checked === 1 ? 0 : 1 }) // Toggle between 0 and 1
                                            }
                                            color='info'
                                        />
                                        <Typography>Yes</Typography>
                                    </Box>
                                </Box>
                            ))}



                        </Box>

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "auto 1fr",
                                alignItems: "center",
                                width: "100%",
                                paddingTop: 1,
                            }}
                        >
                            <Typography variant="body1">Customer acceptance Certificate</Typography>
                            <Box
                                sx={{
                                    borderBottom: "1px dotted",
                                    // borderBottmColor: getBorderColor(),
                                    marginLeft: "8px", // Adjust spacing to your preference
                                }}
                            />
                        </Box>
                        <Box sx={{
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
                        }}>
                            <Box sx={{ display: 'flex' }}>
                                <ChecKBoxLabel
                                    value={mainDetails}
                                    changeValue={setMainDetails}
                                    fieldName={"CustomerAcceptanceCertificate"}
                                    width={'50px'}
                                />
                                <Typography>{docData}</Typography>
                            </Box>

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
                // imageUrl={sign}
                handleCloseImagePopup={handleCloseImagePopupSign}
            />


        </Box>
    );
}


