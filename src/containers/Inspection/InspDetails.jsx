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
import { assessmentData, InspectionData, locationType } from "../../config";
import InspBodyTable from "./InspBodyTable";
import InspDetailsTab from "./InspDetailsTab";
import { inspectionApis } from "../../service/Inspection/inspection";
import TabFields from "./TabFields";
import Loader from "../../component/Loader/Loader";
import ApproveConfirmation from "./ApproveConfirmation";
import TagFileTab from "./TagFileTab";
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
            {value == index && <Box sx={{ p: 1 }}>{children}</Box>}
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
                        Inspection Details

                    </Typography>
                </Breadcrumbs>
            </Stack>
        </div>
    );
}
const DefaultIcons = ({ iconsClick, detailPageId, userAction }) => {
    const hasAproove = userAction.some((action) => action.Action == "Authorise");
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
                (action) => action.Action == "New" && detailPageId !== 0
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
                    (action.Action == "New" && detailPageId == 0) ||
                    (action.Action == "Edit" && detailPageId !== 0 && !hasAproove)
            ) && (
                    <ActionButton
                        iconsClick={iconsClick}
                        icon={"save"}
                        caption={"Save"}
                        iconName={"save"}
                    />
                )}
            {userAction.some((action) => action.Action == "Delete") || !hasAproove && (
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
            {userAction.some((action) => action.Action == "Authorise") && (
                <>
                    {detailPageId != 0 ? (
                        <>
                            <ActionButton
                                iconsClick={iconsClick}
                                icon={"fa-solid fa-thumbs-up"}
                                caption={"Approve"}
                                iconName={"approve"}
                            />
                            <ActionButton
                                iconsClick={iconsClick}
                                icon={"fa-solid fa-ban"}
                                caption={"Reject"}
                                iconName={"reject"}
                            />
                        </>
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
        Caption: "EQUIPMENT PARTS",
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
        FieldName: "Name",
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
        Caption: " S / NS / NA / SE ",
        CharacterCasing: 0,
        ColumnSpan: 0,
        CopyfromParent: false,
        Default: false,
        DefaultValue: null,
        DonotAllowSpecialChar: false,
        EditableinCustomerPortal: false,
        ErrorMessage: null,
        Field: 334,
        FieldDisplayType: "check type",
        FieldName: "Data",
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
        MaxSize: null,
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
        Caption: "Remarks",
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
        FieldName: "Remarks",
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


]

export default function InspDetails({
    setPageRender,
    detailPageId: summaryId,
    userAction,
    disabledDetailed,
    productId,
    backId,
    setId,
    mainDetails,
    setMainDetails,
    newId,
}) {


    const currentDate = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        Id: null,
        DocNo: null,
        Product: null,
        List: null,
        OwnerName: null,
        OfficeAddress: "",
        EquipmentLocation: null,
        DateOfInspection: null,
        PreviousInspectionReport: null,
        TestMethod: null,
        ExpiryDate: null,
        TestDate: null,
        InspectionType: null,
        InspectionType_Name: null,
        CalibratedTestEquipment: null,
        ClientTestEquipment: null,
        InspectionInformation: {},
        Attachment: [],
    });
    const [mainDetails1, setMainDetails1] = useState({
        Remarks: null,
    });
    const [detailPageId, setDetailPageId] = useState(summaryId);
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [confirmData, setConfirmData] = useState({});
    const [confirmType, setConfirmType] = useState(null);
    const [expanded, setExpanded] = useState("InspectionDetails");//Accordion open
    const [tableBody, setTableBody] = useState();
    const [loading, setLoading] = useState(true);
    const [docNo, setDocNo] = useState({
        DocNo: null,
    });

    //----Fields-----
    const [viewFields, setViewFields] = useState([])
    const [fieldsWithStructure, setFieldsWithStructure] = useState([]);
    const [groupedFields, setgroupedFields] = useState([])

    // -----Aproove-----
    const [selectedDatas, setselectedDatas] = React.useState([]); //selected rows details
    const [property, setProperty] = useState(false);
    const [itemLabel, setItemLabel] = useState('');

    //TagAttachmentTab
    const [dbTagAttachmentDetails, setdbTagAttachmentDetails] = useState([])


    const { showAlert } = useAlert();
    const {
        GetInspectionFields, getexaminationform, getdocno, getjoborderheaddetails, getInspectionDetails, upsertInspection, deleteInspection, upsertApprove, uploadAttachfiles
    } = inspectionApis();


    useEffect(() => {
        const fetchData = async () => {
            try {
                setFormData({
                    Id: 0,
                    DocNo: null,
                    Product: null,
                    List: null,
                    OwnerName: null,
                    OfficeAddress: "",
                    EquipmentLocation: null,
                    DateOfInspection: currentDate,
                    PreviousInspectionReport: null,
                    TestMethod: null,
                    ExpiryDate: currentDate,
                    InspectionType: null,
                    InspectionType_Name: null,
                    CalibratedTestEquipment: null,
                    ClientTestEquipment: null,
                    TestDate: currentDate,
                    InspectionInformation: {},
                    Attachment: [],
                })

                if (newId) {
                    const response = await getdocno({
                        list: detailPageId
                    })
                    if (response.status == "Success") {
                        const myObject = JSON.parse(response?.result);

                        setFormData(prevState => ({
                            ...prevState, // Retain previous values
                            DocNo: myObject[0]?.DocNo,
                            Product: myObject[0]?.Product,
                            Product_Name: myObject[0]?.ProductName,
                            List: detailPageId,
                        }));
                    }
                    const response1 = await getjoborderheaddetails({
                        allocation: mainDetails?.Allocation
                    })
                    if (response1.status == "Success") {
                        const myObject = JSON.parse(response1?.result);
                        setFormData(prevState => ({
                            ...prevState, // Retain previous values
                            Owner: myObject[0]?.Owner,
                            Address: myObject[0]?.Address,
                            Location: myObject[0]?.Location,
                        }));

                    }
                }
                setFieldsWithStructure([])
                const response = await GetInspectionFields({
                    Id: productId
                })
                if (response.status == "Success") {
                    let fieldsData = JSON.parse(response?.result);
                    setViewFields(fieldsData)


                    if (newId) {

                        fieldsData.forEach((field) => {
                            const { FieldName, FieldDisplayType } = field;

                            const fieldDisplayType = FieldDisplayType.toLowerCase();
                            let processedValue;
                            if (fieldDisplayType == "date") {
                                processedValue = currentDate;
                                setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    InspectionInformation: {
                                        ...prevFormData.InspectionInformation, // Spread the previous details to retain other properties
                                        [FieldName]: processedValue, // Dynamically update the property
                                    },
                                }));
                                // Set today's date if no default
                            }
                            if (fieldDisplayType == "switch") {
                                processedValue = false;
                                setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    InspectionInformation: {
                                        ...prevFormData.InspectionInformation, // Spread the previous details to retain other properties
                                        [FieldName]: processedValue, // Dynamically update the property
                                    },
                                }));
                                // Set today's date if no default
                            }

                        });
                    }




                    if (detailPageId > 0 && !newId) {
                        await fetchDetail(); // Call the fetchDetail function after viewFields are set
                    }

                }
                else {
                    setViewFields([]);
                    setFormData({
                        Id: 0,
                        DocNo: null,
                        OwnerName: null,
                        Product: null,
                        List: null,
                        OfficeAddress: "",
                        EquipmentLocation: null,
                        DateOfInspection: null,
                        PreviousInspectionReport: null,
                        TestMethod: null,
                        ExpiryDate: null,
                        InspectionType: null,
                        InspectionType_Name: null,
                        CalibratedTestEquipment: null,
                        ClientTestEquipment: null,
                        TestDate: null,
                        InspectionInformation: {},
                        Attachment: [],
                    })
                    setFieldsWithStructure([])
                }

                if (newId) {
                    const response = await getexaminationform({
                        product: productId
                    })
                    if (response.status == "Success") {
                        let myObject = JSON.parse(response?.result);
                        setTableBody(myObject)

                    }
                }

            } catch (error) {
                setViewFields([]);
                setFormData({
                    Id: 0,
                    DocNo: null,
                    OwnerName: null,
                    Product: null,
                    List: null,
                    OfficeAddress: "",
                    EquipmentLocation: null,
                    DateOfInspection: null,
                    PreviousInspectionReport: null,
                    TestMethod: null,
                    ExpiryDate: null,
                    InspectionType: null,
                    InspectionType_Name: null,
                    CalibratedTestEquipment: null,
                    ClientTestEquipment: null,
                    TestDate: null,
                    InspectionInformation: {},
                    Attachment: [],
                })
                setFieldsWithStructure([])
            }
            finally {
                setLoading(false)
                setExpanded("InspectionDetails")
            }
        };
        if (productId) {
            fetchData();
        }
    }, [productId, detailPageId]);




    useEffect(() => {

        const groupedFields1 = viewFields.reduce((acc, field) => {
            const tabKey = field.TabName || ''; // Check if TabName is empty or null
            // Continue grouping non-FieldStructure 5 fields
            if (!acc[tabKey]) {
                acc[tabKey] = [];
            }
            acc[tabKey].push(field);
            return acc;
        }, {});


        setgroupedFields(groupedFields1)
        // setExpanded(Object.keys(groupedFields1)[0])
        // Now you have your tagDetailsAccumulator with unsorted fields in the first array, sorted by FieldOrder

    }, [viewFields]);


    const fetchDetail = async () => {
        try {



            //  const response = await gettagdetails({id:detailPageId,tagId:menuObj?.TagId ,languageId:currentLanguage})
            const response = await getInspectionDetails({ id: detailPageId })

            if (response.status == "Success") {


                const result = JSON.parse(response?.result)
                let updatedData = {
                    ...formData,
                    ...result,
                    InspectionInformation: result?.InspectionInformation ?? {}
                }


                setFormData(updatedData)
                setTableBody(result?.Examination)
                if (result?.Attachment?.length > 0) {
                    setdbTagAttachmentDetails(result?.Attachment)
                }

            }


        } catch (error) {
            handleclose()
        }
    }


    //Accordion 
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };



    // ---- Aproove method----

    const handleProperty = (value) => {
        // if (selectedDatas.length === 0) {
        //     showAlert("info", "Select rows to Authorize");
        //     return;
        // }
        setItemLabel(value)
        setConfirmData({
            message: `You want to Approve.`,
            type: "info",
            header: "Authorization",
        });
        setProperty(true);
    };



    const handleIconsClick = async (value) => {
        switch (value.trim()) {
            case "new":
                // handleNew();
                break;
            case "close":
                handleclose();
                break;
            case "save":
                const emptyFields = [];
                if (!formData?.DateOfInspection) emptyFields.push("Date Of Inspection");
                if (!formData?.InspectionType) emptyFields.push("Inspection Type");
                if (!formData?.PreviousInspectionReport) emptyFields.push("Previous Inspection Report");
                if (!formData?.TestMethod) emptyFields.push("Test Method");
                if (!formData?.ExpiryDate) emptyFields.push("Expiry Date");
                if (!formData?.TestDate) emptyFields.push("Last Proof Load Test");
                if (!formData?.CalibratedTestEquipment) emptyFields.push("Calibrated Test Equipment");
                if (!formData?.ClientTestEquipment) emptyFields.push("Client Test Equipment");
                if (emptyFields.length > 0) {
                    showAlert("info", `Please Provide ${emptyFields[0]}`);
                    return;
                }
                const isValid = await validateFormData();
                if (isValid) {
                    setConfirmData({ message: "Save", type: "success" });
                    setConfirmType("save");
                    setConfirmAlert(true);
                }

                break;
            case "approve":
                handleProperty(value);
                break;
            case "reject":
                handleProperty(value);
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
        if (detailPageId == 0) {
            setPageRender(1);
        }
        else {
            setId(backId)
            setPageRender(3);
        }
    };

    const validateFormData = async () => {

        for (const tabKey of Object.keys(groupedFields)) {
            // Check the FieldStructure of the first field in each group
            const tabCaption = groupedFields[tabKey]?.[0]?.TabCaption || tabKey; // Use TabCaption or fallback to tabKey


            // For `TabFields` structure validation
            for (const field of groupedFields[tabKey]) {
                const { FieldName, Mandatory, Caption } = field;

                const fieldValue = formData["InspectionInformation"][FieldName];


                if (fieldValue === null || fieldValue === undefined || fieldValue === "") {
                    setExpanded(tabKey)
                    showAlert("info", `${Caption} is reqiured (${tabCaption})`);
                    return false
                }



            }

        }

        return true;
    }

    const handleSave = async () => {

        const updatedChildData = tableBody.map((obj) => {
            return obj?.Items?.map((list) => {
                return {
                    slNo: list.SlNo,
                    subCategory: list.SubCategory,
                    data: list.Data,
                    remarks: list.Remarks,
                };
            });
        }).flat();

        const hasDataZero = updatedChildData?.some(
            (item) => item.data == 0
        );

        if (hasDataZero) {
            showAlert("info", "Ensure complete Data")
        }



        if (!hasDataZero) {

            const validFieldNames = new Set(viewFields.map(field => field.FieldName));

            // Filter formData.InspectionInformation to keep only valid fields
            const filteredInspectionInformation = Object.keys(formData?.InspectionInformation || {})
                .filter(key => validFieldNames.has(key)) // Keep only keys that exist in viewFields
                .reduce((obj, key) => {
                    obj[key] = formData?.InspectionInformation[key];
                    return obj;
                }, {});
            const inspectionInformationArray = [filteredInspectionInformation]

            const saveData = {
                id: formData?.Id,
                docNo: formData?.DocNo,
                product: formData?.Product,
                list: formData?.List,
                dateOfInspection: formData?.DateOfInspection,
                expiryDate: formData?.ExpiryDate,
                inspectionType: formData?.InspectionType,
                previousInspectionReport: formData?.PreviousInspectionReport,
                testMethod: formData?.TestMethod,
                calibratedTestEquipment: formData?.CalibratedTestEquipment,
                clientTestEquipment: formData?.ClientTestEquipment,
                testDate: formData?.TestDate,
                inspectionInformation: inspectionInformationArray,
                examination: updatedChildData,
                attachments: formData?.Attachment || []
            };


            const response = await upsertInspection(saveData);
            if (response.status == "Success") {

                showAlert("success", response?.message);

                const detailId = Number(response.result)

                const formDataFiles = new FormData();

                let fileIndex = 0;
                // Filter attachments that have a file and add them to the FormData
                const attachmentsWithFiles = formData?.Attachment?.filter(attachment => attachment?.file);



                if (attachmentsWithFiles.length > 0) {

                    attachmentsWithFiles.forEach((attachment) => {
                        if (attachment.file) {
                            formDataFiles.append(
                                `Attachments[${fileIndex}].SlNo`,
                                attachment.SLNo
                            );
                            formDataFiles.append(
                                `Attachments[${fileIndex}].previousFileName`,
                                attachment.FileName
                            );
                            formDataFiles.append(
                                `Attachments[${fileIndex}].FileContent`,
                                attachment.file
                            );
                            fileIndex++;
                        }
                    });
                    try {



                        const uploadResponse = await uploadAttachfiles(detailId, formDataFiles);
                        if (uploadResponse.status === 'Success') {
                            showAlert('success', uploadResponse?.message);
                        }
                    } catch (error) {

                    }

                }
                // handleNew();
                // const actionExists = userAction.some((action) => action.Action == "New");
                // if (!actionExists) {
                handleclose();
                // }

            }

        }
    };

    //confirmation

    const handleConfirmSubmit = () => {
        if (confirmType == "save") {
            handleSave();
        } else if (confirmType == "delete") {
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
        response = await deleteInspection([{ id: detailPageId }]);
        if (response?.status == "Success") {
            showAlert("success", response?.message);
            handleNew();
            const actionExists = userAction.some((action) => action.Action == "New");
            if (!actionExists) {
                handleclose();
            }
        }
    };

    const handlePropertyConfirmation = async (status) => {
        if (status == 1) {
            if (!mainDetails?.Remarks) {
                showAlert("info", `Please Provide Remarks`);
                return;
            }
        }
        const saveData = {
            status: status,
            id: detailPageId,
            list: formData?.List,
            remarks: mainDetails1?.Remarks
        };
        try {
            const response = await upsertApprove(saveData);
            if (response?.status === "Success") {
                showAlert("success", response?.message);
                setMainDetails1({})
            }
        } catch (error) {
        } finally {
            setselectedDatas([]);
            setProperty(false);
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
                        // gap: '20px'
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
                            marginBottom: '20px',
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
                        <Typography sx={{ fontWeight: 'bold', }}>{formData?.Product_Name}</Typography>
                        <UserInputField
                            label={"Doc No"}
                            name={"DocNo"}
                            type={"text"}
                            disabled={false}
                            mandatory={true}
                            value={formData}
                            setValue={setFormData}
                        />

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
                                label={"Owner Name"}
                                name={"Owner"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={formData}
                                setValue={setFormData}
                                maxLength={100}
                            />
                            <UserInputField
                                label={"Office Address"}
                                name={"Address"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={formData}
                                setValue={setFormData}
                                maxLength={100}
                            />
                            <UserInputField
                                label={"Equipment Location"}
                                name={"Location"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={formData}
                                setValue={setFormData}
                                maxLength={100}
                            />

                        </Box>



                    </Box>

                    <CustomizedAccordions
                        // icons="fa-solid fa-briefcase"
                        label={'Inspection Details'}
                        expanded={expanded == "InspectionDetails"}
                        onChange={handleChange("InspectionDetails")}
                    >
                        <InspDetailsTab key={999} formData={formData} setFormData={setFormData} />
                    </CustomizedAccordions>




                    {viewFields.length > 0 && (
                        <>
                            {Object.keys(groupedFields).map((tabKey) => {
                                // Check the FieldStructure of the first field in each group
                                const fieldStructure = groupedFields[tabKey]?.[0]?.FieldStructure;


                                return (
                                    <TabFields
                                        key={tabKey}
                                        fields={groupedFields[tabKey]} // Pass fields belonging to this tab
                                        expanded={expanded == tabKey}
                                        onChange={handleChange(tabKey)}
                                        formData={formData?.InspectionInformation}
                                        setFormData={(data) => setFormData((prevFormData) => ({
                                            ...prevFormData,
                                            InspectionInformation: data
                                        }))}
                                        // language={currentLanguageName}
                                        // tagDetails={menuObj}
                                        fieldStructure={fieldStructure}
                                        // handleTagSwitch={!preview ? handleTagSwitch : false}
                                        disabledDetailed={disabledDetailed}
                                        userAction={userAction}
                                        // fetchDetailTagInfo={fetchDetailTagInfo}
                                        detailScreeniId={formData.iId}
                                    />
                                );

                            })}
                        </>
                    )}


                    {tableBody?.map((list, index) => (
                        <>
                            <CustomizedAccordions
                                // icons="fa-solid fa-briefcase"
                                label={list?.Category_Name}
                                expanded={expanded == list?.Category_Name}
                                onChange={handleChange(list?.Category_Name)}
                            >
                                <InspBodyTable key={888} fields={tableFields} tableData={list?.Items} settableData={setTableBody} preview={false} typeName={list?.Category_Name} />
                            </CustomizedAccordions>
                        </>
                    ))}

                    <TagFileTab

                        // fieldsWithStructure6={fieldsWithStructure6} // Pass fields belonging to this tab
                        expanded={expanded === 6}
                        onChange={handleChange(6)}
                        formData={formData}
                        setFormData={setFormData}
                        // currentLanguageName={currentLanguageName}
                        // menuObj={menuObj}
                        // disabledDetailed={disabledDetailed}
                        detailPageId={formData.Id}
                        // handleTagSwitch={!preview ? handleTagSwitch : false}
                        dbTagAttachmentDetails={dbTagAttachmentDetails}
                        setdbTagAttachmentDetails={setdbTagAttachmentDetails}
                    />


                </Box>

            </Box>

            <ConfirmationAlert
                handleClose={handleConfrimClose}
                open={confirmAlert}
                data={confirmData}
                submite={handleConfirmSubmit}
            />
            <ApproveConfirmation
                handleClose={() => setProperty(false)}
                open={property}
                data={confirmData}
                submite={handlePropertyConfirmation}
                selectedDatas={selectedDatas?.length === 1 ? selectedDatas[0] : null}
                itemLabel={itemLabel}
                mainDetails={mainDetails1}
                setMainDetails={setMainDetails1}
            />

        </Box>
    );
}


