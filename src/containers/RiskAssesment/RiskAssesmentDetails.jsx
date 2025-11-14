import React, { useState } from "react";
import {
    Box,
    Stack,
    Button as ButtonM,
    Typography,
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
import CustomizedAccordions from "../../component/Accordion/Accordion";
import RiskBodyTable from "./RiskBodyTable";
import { allocationApis } from "../../service/Allocation/allocation";
import UserAutoComplete from "../../component/AutoComplete/UserAutoComplete";
import { inspectionApis } from "../../service/Inspection/inspection";
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
                        Risk Assessment 
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
            


            {/* {userAction.some((action) => action.Action === "View" || action.Action === "Edit") && (
                <>
                    {detailPageId !== 0 && (
                        <ActionButton
                            iconsClick={iconsClick}
                            icon={"fa-solid fa-circle-arrow-left"}
                            caption={"Prev"}
                            iconName={"prev"}
                        />
                    )}
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
            )} */}
            {userAction.some((action) => action.Action === "Print") && (
                <>
                    {detailPageId != 0 ? (
                        <ActionButton
                            iconsClick={iconsClick}
                            icon={"fa-solid fa-print"}
                            caption={"Print"}
                            iconName={"print"}
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

const tableFields = [
    {
        AllowDate: 0,
        AllowDateName: null,
        AllowManualIncrement: false,
        AuditTrail: false,
        AvailableInMobileApp: false,
        AvailableinCustomerPortal: false,
        BannerText: null,
        Behaviour: 1,
        CannotBeExported: false,
        CannotBeImported: false,
        Caption: "Type",
        CharacterCasing: 0,
        ColumnSpan: 0,
        CopyfromParent: false,
        Default: false,
        DefaultValue: "0",
        DonotAllowSpecialChar: false,
        EditableinCustomerPortal: false,
        ErrorMessage: null,
        Field: 333,
        FieldDisplayType: "cell",
        FieldName: "Data_Description",
        FieldOrder: 1,
        FieldStructure: 5,
        FieldType: "",
        FilterCondition: null,
        Hidden: false,
        HiddenInGroup: false,
        HideLeftPane: false,
        InformationField: false,
        InternalStdField: true,
        // LinkTag: MastersTagId.Product,
        Mandatory: true,
        MandatoryInGroup: false,
        MandatoryInRevision: false,
        MaxSize: 0,
        MaximumValue: null,
        MergeField: false,
        MinimumValue: null,
        Negative: false,
        NumberList: null,
        PreLoadValuesOnDemand: false,
        ReadOnly: false,
        RegularExpression: null,
        Removed: false,
        RowSpan: 0,
        ScrollBar: 0,
        TabName: "General",
        Tag: 20,
        ToolTip: null,
        View: 95,
        ViewCaption: "dipin2",
        Visible: false,
        WordWrap: false,

    },
    {
        AllowDate: 0,
        AllowDateName: null,
        AllowManualIncrement: false,
        AuditTrail: false,
        AvailableInMobileApp: false,
        AvailableinCustomerPortal: false,
        BannerText: null,
        Behaviour: 1,
        CannotBeExported: false,
        CannotBeImported: false,
        Caption: "Risk",
        CharacterCasing: 0,
        ColumnSpan: 0,
        CopyfromParent: false,
        Default: false,
        DefaultValue: null,
        DonotAllowSpecialChar: false,
        EditableinCustomerPortal: false,
        ErrorMessage: null,
        Field: 334,
        FieldDisplayType: "risk",
        FieldName: "RiskData",
        FieldOrder: 2,
        FieldStructure: 5,
        FieldType: "",
        FilterCondition: null,
        Hidden: false,
        HiddenInGroup: false,
        HideLeftPane: false,
        InformationField: false,
        InternalStdField: true,
        // LinkTag: MastersTagId.Unit,
        Mandatory: true,
        MandatoryInGroup: false,
        MandatoryInRevision: false,
        MaxSize: 0,
        MaximumValue: null,
        MergeField: false,
        MinimumValue: null,
        Negative: false,
        NumberList: null,
        PreLoadValuesOnDemand: false,
        ReadOnly: false,
        RegularExpression: "",
        Removed: false,
        RowSpan: 0,
        ScrollBar: 0,
        TabName: "General",
        Tag: 20,
        ToolTip: null,
        View: 95,
        ViewCaption: "dipin2",
        Visible: false,
        WordWrap: false,

    },
    {
        AllowDate: 0,
        AllowDateName: null,
        AllowManualIncrement: false,
        AuditTrail: false,
        AvailableInMobileApp: false,
        AvailableinCustomerPortal: false,
        BannerText: null,
        Behaviour: 1,
        CannotBeExported: false,
        CannotBeImported: false,
        Caption: "Description",
        CharacterCasing: 0,
        ColumnSpan: 0,
        CopyfromParent: false,
        Default: false,
        DefaultValue: null,
        DonotAllowSpecialChar: false,
        EditableinCustomerPortal: false,
        ErrorMessage: null,
        Field: 334,
        FieldDisplayType: "Text Box",
        FieldName: "Description",
        FieldOrder: 3,
        FieldStructure: 5,
        FieldType: "text",
        FilterCondition: null,
        Hidden: false,
        HiddenInGroup: false,
        HideLeftPane: false,
        InformationField: false,
        InternalStdField: true,
        LinkTag: 0,
        Mandatory: true,
        MandatoryInGroup: false,
        MandatoryInRevision: false,
        MaxSize: 500,
        MaximumValue: null,
        MergeField: false,
        MinimumValue: null,
        Negative: false,
        NumberList: null,
        PreLoadValuesOnDemand: false,
        ReadOnly: false,
        RegularExpression: "",
        Removed: false,
        RowSpan: 0,
        ScrollBar: 0,
        TabName: "General",
        Tag: 20,
        ToolTip: null,
        View: 95,
        ViewCaption: "dipin2",
        Visible: false,
        WordWrap: false,
        RoundOff: null

    },
    {
        AllowDate: 0,
        AllowDateName: null,
        AllowManualIncrement: false,
        AuditTrail: false,
        AvailableInMobileApp: false,
        AvailableinCustomerPortal: false,
        BannerText: null,
        Behaviour: 1,
        CannotBeExported: false,
        CannotBeImported: false,
        Caption: "Risk level",
        CharacterCasing: 0,
        ColumnSpan: 0,
        CopyfromParent: false,
        Default: false,
        DefaultValue: null,
        DonotAllowSpecialChar: false,
        EditableinCustomerPortal: false,
        ErrorMessage: null,
        Field: 334,
        FieldDisplayType: "level",
        FieldName: "RiskLevel",
        FieldOrder: 16,
        FieldStructure: 5,
        FieldType: "",
        FilterCondition: null,
        Hidden: false,
        HiddenInGroup: false,
        HideLeftPane: false,
        InformationField: false,
        InternalStdField: true,
        LinkTag: 0,
        Mandatory: false,
        MandatoryInGroup: false,
        MandatoryInRevision: false,
        MaxSize: 200,
        MaximumValue: null,
        MergeField: false,
        MinimumValue: null,
        Negative: false,
        NumberList: null,
        PreLoadValuesOnDemand: false,
        ReadOnly: false,
        RegularExpression: "",
        Removed: false,
        RowSpan: 0,
        ScrollBar: 0,
        TabName: "General",
        Tag: 20,
        ToolTip: null,
        View: 95,
        ViewCaption: "dipin2",
        Visible: false,
        WordWrap: false,

    },

]

export default function RiskAssesmentDetails({
    setPageRender,
    detailPageId: summaryId,
    userAction,
    disabledDetailed,
    riskId,
    setId
}) {

    const [mainDetails, setMainDetails] = useState({});
    const [detailPageId, setDetailPageId] = useState(summaryId);
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [isGet, setIsGet] = useState(false);
    const [confirmData, setConfirmData] = useState({});
    const [updateDetails, setUpdateDetails] = useState();
    const [confirmType, setConfirmType] = useState(null);
    const [expanded, setExpanded] = useState("Location Type");//Accordion open
    const [tableBody, setTableBody] = useState([]);
    const { showAlert } = useAlert();
    const {
        GetRiskAssesmentDetails,
        UpsertRiskAssesment,
        deleteRiskAssesment,
        getFormdata,
        getriskjoborderdetails,
        getAssignjoborderlist,
        generatepdfprint
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
                const response = await GetRiskAssesmentDetails({
                    id: detailPageId,
                });
                if (response?.status === "Success") {
                    const myObject = JSON.parse(response?.result);
                    setMainDetails(myObject?.Header);
                    setTableBody(myObject?.RiskAssessments)
                    setIsGet(true);
                } else {
                    handleNew();
                }
            }
        } catch (error) {
            throw error;
        }
    };

    //Accordion 
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    const handleNew = async () => {
        setMainDetails({
            Id: 0,
            JobOrderNo: null,
            Client_Name: null,
            Allocation: null,
            FileNo: null,
            Location: null,
            Date: currentDate,
            Inspector: null,
            Inspector_Name: null,
        });
        setDetailPageId(0);

        const response = await getFormdata();
        if (response?.status === "Success") {
            const myObject = JSON.parse(response?.result);
            setTableBody(myObject)

        }
    };

    useEffect(() => {

        try {
            const fetchHeadData = async () => {
                const response = await getriskjoborderdetails({
                    allocation: mainDetails?.Allocation
                });
                if (response?.status === "Success") {
                    const myObject = JSON.parse(response?.result);
                    // delete myObject[0].Id;
                    setMainDetails(prevState => ({
                        ...prevState, // Retain previous values
                        ...myObject[0],
                        Date: currentDate,
                    }));
                }
            }
            if (mainDetails?.Allocation && detailPageId == 0) {
                fetchHeadData();
            }

        } catch (error) {
            throw error
        }

    }, [mainDetails?.Allocation])




    const handleIconsClick = async (value) => {
        switch (value.trim()) {
            case "new":
                handleNew();
                break;
            case "close":
                handleclose();
                break;
            case "save":
                let namePattern = /^[^A-Za-z\d]+$/;
                const emptyFields = [];
                if (!mainDetails?.JobOrderNo) emptyFields.push("Job OrderNo");
                if (!mainDetails.FileNo) emptyFields.push("File No Name");
                if (namePattern.test(mainDetails.FileNo)) {
                    showAlert("info", "File No Only special characters are not allowed.");
                    return;
                }
                if (emptyFields.length > 0) {
                    showAlert("info", `Please Provide ${emptyFields[0]}`);
                    return;
                }
                const isDetail = await detailsValidation();
                if (isDetail) {
                    setConfirmData({ message: "Save", type: "success" });
                    setConfirmType("save");
                    setConfirmAlert(true);
                }
                break;
            case "print":
                handlePrint();
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
        setId(riskId)
        setPageRender(2);
        setIsGet(false)
    };


    const handlePrevNext = async (value) => {
        try {
            const response = await getrecordprevnext({
                allocation: mainDetails?.Allocation,
                category: 1,
                id: detailPageId,
                type: value
            });

            if (response.status === "Success") {
                const detailId = Number(response?.result);
                setDetailPageId(detailId);
            } else {
                showAlert("info", "No more records available.");
            }
        } catch (error) {
            throw error;
        }
    };


    const detailsValidation = async () => {
        const updatedChildData = tableBody.flatMap(obj =>
            obj?.Items?.map(list => ({
                slNo: list.SlNo,
                data: list.Id,
                risk: list.RiskData,
                description: list.Description,
                riskLevel: list.RiskLevel,
                tabName: list.Tab_Name
            }))
        );

        // Filter records with missing risk
        const filteredData = updatedChildData
            .filter(item => item.risk === 0 || item.risk == undefined)
            .map(({ tabName, slNo }) => ({ tabName, slNo }));

        if (filteredData.length > 0) {
            const uniqueTabNames = [...new Set(filteredData.map(item => item.tabName))];
            uniqueTabNames.forEach(tab => setExpanded(tab)); // Expand all affected tabs

            filteredData.forEach(item => {
                showAlert("info", `Ensure fill Risk in the SLNO ${item.slNo} in ${item.tabName}`);
            });
            return false; // Stop execution here since risk validation failed
        }

        // If no risk validation errors, check for missing risk levels
        // const filteredData2 = updatedChildData
        //     .filter(item => item.riskLevel === 0 || item.riskLevel == undefined)
        //     .map(({ tabName, slNo }) => ({ tabName, slNo }));

        // if (filteredData2.length > 0) {
        //     const uniqueTabNames = [...new Set(filteredData2.map(item => item.tabName))];
        //     uniqueTabNames.forEach(tab => setExpanded(tab)); // Expand all affected tabs

        //     filteredData2.forEach(item => {
        //         showAlert("info", `Ensure fill Risk Level in the SLNO ${item.slNo} in ${item.tabName}`);
        //     });
        //     return false; // Stop execution since risk level validation failed
        // }
        setUpdateDetails(updatedChildData)
        return true
    }

    const handleSave = async () => {

        try {
            // If both validations pass, proceed with saving
            const saveData = {
                Id: mainDetails?.Id,
                allocation: mainDetails?.Allocation,
                date: mainDetails?.Date,
                inspector: mainDetails?.Inspector,
                fileNo: mainDetails?.FileNo,
                details: updateDetails
            };

            const response = await UpsertRiskAssesment(saveData);
            if (response.status === "Success") {
                showAlert("success", response?.message);
                handleclose();
                setPageRender(2);
                // Check if "New" action exists, otherwise setPageRender
                // const actionExists = userAction.some(action => action.Action === "New");
                // if (!actionExists) {
                //     setPageRender(1);
                // }
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
        response = await deleteRiskAssesment([{ id: detailPageId }]);
        if (response?.status === "Success") {
            showAlert("success", response?.message);
            handleNew();
            const actionExists = userAction.some((action) => action.Action === "New");
            if (!actionExists) {
                setPageRender(2);
            }
        }
    };


    const handlePrint = async () => {
        // Open a blank popup immediately on user action
        const popupWindow = window.open("", "PDFPopup", "width=800,height=600,resizable=yes,scrollbars=yes");
        if (!popupWindow) {
            alert("Popup blocked! Please allow popups for this site.");
            return;
        }
    
        try {
            const response = await generatepdfprint({ Id: detailPageId,category:1 });
            // Assuming response.result is a JSON string containing a URL property
            const resultObj = JSON.parse(response?.result);
            
    
            if (response?.status === "Success" && resultObj) {
                // Set the popup's location to the PDF URL
                popupWindow.location.href = resultObj;
            } else {
                console.error("Print generation failed or invalid URL.");
                popupWindow.close();
            }
        } catch (error) {
            console.error("An error occurred:", error);
            popupWindow.close();
        }
    };


    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", position: 'relative' }}>
            <Box
                sx={{
                    position: 'fixed',
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingLeft: 1.5,
                    paddingRight: 1.5,
                    flexWrap: "wrap",
                    zIndex: 5,
                    backgroundColor: 'white'
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
                    marginTop: '50px'
                }}
            >
                <Typography sx={{ fontWeight: 'bold',ml:2 }}>{mainDetails?.Product_Name}</Typography>
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

                        

                        {/* <UserAutoComplete
                            apiKey={getAssignjoborderlist}
                            formData={mainDetails}
                            setFormData={setMainDetails}
                            label={"Job Order No"}
                            autoId={"Allocation"}
                            required={true}
                            formDataName={"JobOrderNo"}
                            formDataiId={"Allocation"}
                            criteria={1}
                            disable={isGet}
                        /> */}
                        <UserInputField
                            label={"Job Order No"}
                            name={"JobOrderNo"}
                            type={"text"}
                            disabled={true}
                            mandatory={true}
                            value={mainDetails}
                            setValue={setMainDetails}
                            maxLength={100}
                        />
                        <UserInputField
                            label={"Client"}
                            name={"Client_Name"}
                            type={"text"}
                            disabled={true}
                            mandatory={true}
                            value={mainDetails}
                            setValue={setMainDetails}
                            maxLength={100}
                        />
                        <UserInputField
                            label={"Location"}
                            name={"Location"}
                            type={"text"}
                            disabled={true}
                            mandatory={true}
                            value={mainDetails}
                            setValue={setMainDetails}
                            maxLength={100}
                        />
                        <UserInputField
                            label={"Technician"}
                            name={"Inspector_Name"}
                            type={"text"}
                            disabled={true}
                            mandatory={true}
                            value={mainDetails}
                            setValue={setMainDetails}
                            maxLength={100}
                        />
                        <UserInputField
                            label={"Work Order/File No"}
                            name={"FileNo"}
                            type={"text"}
                            disabled={true}
                            mandatory={true}
                            value={mainDetails}
                            setValue={setMainDetails}
                            maxLength={50}
                        />

                        <UserInputField
                            label={"Date"}
                            name={"Date"}
                            type={"date"}
                            disabled={true}
                            mandatory={true}
                            value={mainDetails}
                            setValue={setMainDetails}
                            maxLength={100}
                        />


                    </Box>

                    <Box>
                        {tableBody?.map((list, index) => (
                            <>
                                <CustomizedAccordions
                                    // icons="fa-solid fa-briefcase"
                                    label={list?.Name}
                                    expanded={expanded === list?.Name}
                                    onChange={handleChange(list?.Name)}
                                >

                                    <RiskBodyTable fields={tableFields} tableData={list.Items} settableData={setTableBody} preview={false} typeName={list?.Name} />


                                </CustomizedAccordions>
                            </>
                        ))}

                    </Box>

                </Box>
            </Box>

            <ConfirmationAlert
                handleClose={handleConfrimClose}
                open={confirmAlert}
                data={confirmData}
                submite={handleConfirmSubmit}
            />


        </Box>
    );
}

