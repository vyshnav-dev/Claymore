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


import { Info } from "@mui/icons-material";
import CustomizedAccordions from "../../component/Accordion/Accordion";
import RiskBodyTable from "./RiskBodyTable";
import { assessmentData, locationType } from "../../config";
import InputCommon from "../../component/InputFields/InputCommon";
import { allocationApis } from "../../service/Allocation/allocation";
import UserAutoComplete from "../../component/AutoComplete/UserAutoComplete";
import { inspectionApis } from "../../service/Inspection/inspection";
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
                        Risk Assessment Details
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
            <ActionButton
                iconsClick={iconsClick}
                icon={"fa-solid fa-print"}
                caption={"Print"}
                iconName={"print"}
            />
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
}) {

    const {
        GetTechnicianList
    } = allocationApis();

    const userData = JSON.parse(localStorage.getItem("ClaymoreUserData"))[0];
    const [mainDetails, setMainDetails] = useState({});
    const [detailPageId, setDetailPageId] = useState(summaryId);
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [confirmData, setConfirmData] = useState({});
    const [confirmType, setConfirmType] = useState(null);
    const [expanded, setExpanded] = useState(1);//Accordion open
    const [tableBody, setTableBody] = useState([]);
    const { showAlert } = useAlert();
    const {
        GetRiskAssesmentDetails,
        UpsertRiskAssesment,
        deleteRiskAssesment
    } = inspectionApis();

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
                    setTableBody(myObject?.riskAssessments)
                    
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
            Id:0,
            JobOrderNo: null,
            Client_Name: null,
            Allocation:null,
            FileNo:null,
            Location: null,
            Date: null,
            Inspector: null,
            Inspector_Name: null,    
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
                // if (!mainDetails?.Inspector) emptyFields.push("Inspector"); 
                // if (!mainDetails?.Date) emptyFields.push("Date"); 
                // if (!mainDetails?.JobOrderNo) emptyFields.push("Job OrderNo"); 
                // if (!mainDetails?.Client_Name) emptyFields.push("Client"); 
                // if (!mainDetails?.FileNo) emptyFields.push("File No"); 
                // if (!mainDetails?.Location) emptyFields.push("Location"); 
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
            case "property":
                handleProperty();
                break;
            default:
                break;
        }
    };
    // Handlers for your icons

    const handleclose = () => {
        setPageRender(1);
    };

    const handleSave = async () => {

        const updatedChildData = tableBody.map((obj) => {
            return obj?.items?.map((list) => {
                return {
                    slNo: list.SlNo,
                    data: list.Id,
                    risk: list.RiskData,
                    description: list.Description,
                    riskLevel: list.RiskLevel,
                };
            });
        }).flat();

        const hasRiskZero = updatedChildData.some(
            (item) => item.risk === 0
          );
        const hasRiskLevelZero = updatedChildData.some(
            (item) => item.riskLevel === 0
          );
          if(hasRiskZero)
          {
                showAlert("info","Ensure complete Risk")
          }
          if(hasRiskLevelZero)
          {
                showAlert("info","Ensure complete RiskLevel")
          }

          if(!hasRiskZero && !hasRiskLevelZero)
          {
            const saveData = {
                Id: mainDetails?.Id,
                allocation: mainDetails?.Allocation,
                date: mainDetails?.Date,
                inspector: mainDetails?.Inspector,
                fileNo: mainDetails?.FileNo,
                details: updatedChildData,     
            };
    
            console.log('risk save',saveData);
            
            const response = await UpsertRiskAssesment(saveData);
            if (response.status === "Success") {
                showAlert("success", response?.message);
                handleNew();
                // setPageRender(1);
                const actionExists = userAction.some((action) => action.Action === "New");
                if (!actionExists) {
                    setPageRender(1);
                }
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
        response = await deleteRiskAssesment([{ id: detailPageId }]);
        if (response?.status === "Success") {
            showAlert("success", response?.message);
            handleNew();
            const actionExists = userAction.some((action) => action.Action === "New");
            if (!actionExists) {
                setPageRender(1);
            }
        }
    };

    

    

   

    

    console.log('tbody',tableBody);
    

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
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />
                            <UserInputField
                                label={"Location"}
                                name={"Location"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />
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
                                label={"Work Order/File No"}
                                name={"FileNo"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                            />

                            <UserInputField
                                label={"Date"}
                                name={"Date"}
                                type={"date"}
                                disabled={false}
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
                                    type={1}
                                    expanded={expanded === index }
                                    onChange={handleChange(index)}
                                >
                                   
                                      <RiskBodyTable fields={tableFields} tableData={list.items} settableData={setTableBody} preview={false} typeName={list?.Name} />  
                                    
                                    
                                </CustomizedAccordions>
                            </>
                        ))}

                        {/* <CustomizedAccordions
                            // icons="fa-solid fa-briefcase"
                            label="General12"
                            type={1}
                            expanded={expanded === 2}
                            onChange={handleChange(2)}
                        >

                        </CustomizedAccordions> */}
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

