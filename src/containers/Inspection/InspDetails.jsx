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
    IMAGE_URL,
    primaryColor,
    secondaryColor,
    thirdColor,
} from "../../config/config";
import UserInputField from "../../component/InputFields/UserInputField";
import CustomizedAccordions from "../../component/Accordion/Accordion";
import InspBodyTable from "./InspBodyTable";
import InspDetailsTab from "./InspDetailsTab";
import { inspectionApis } from "../../service/Inspection/inspection";
import TabFields from "./TabFields";
import ApproveConfirmation from "./ApproveConfirmation";
import TagFileTab from "./TagFileTab";
import { allocationApis } from "../../service/Allocation/allocation";
import AcknowledgementTab from "./AcknowledgementTab";
import ImageModal from "../../component/Modal/ImageModal";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
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
const DefaultIcons = ({ iconsClick, detailPageId, userAction, certify, isSave, menuId, }) => {




    const hasAproove = userAction.some((action) => action.Action == "Authorize");
    const hasCertificate = userAction.some((action) => action.Action == "Certificate/Report");
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
                    action.Action === "Edit" && detailPageId !== 0 && !hasAproove
            ) && !isSave && menuId === 28 && (
                    <ActionButton
                        iconsClick={iconsClick}
                        icon="save"
                        caption="Save"
                        iconName="save"
                    />
                )}
            {/* {userAction.some((action) => action.Action == "Delete") || !hasAproove && (
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


            {hasAproove && detailPageId != 0 ? (
                <>
                    {certify == 1 ? (
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
                            <ActionButton
                                iconsClick={iconsClick}
                                icon={"fa-solid fa-file-pen"}
                                caption={"Correction"}
                                iconName={"correction"}
                            />

                            <ActionButton
                                iconsClick={iconsClick}
                                icon={"fa-regular fa-rectangle-xmark"}
                                caption={"Suspend"}
                                iconName={"suspend"}
                            />
                        </>
                    ) : null}

                </>
            ) : null}

            {menuId == 46 &&
                <ActionButton
                    iconsClick={iconsClick}
                    icon="fa-solid fa-check-double"
                    caption="Submit"
                    iconName="save"
                />

            }

            {hasCertificate && detailPageId != 0 && certify == 2 && (
                <ActionButton
                    iconsClick={iconsClick}
                    icon={"fa-solid fa-stamp"}
                    caption={"Certificate"}
                    iconName={"certificate"}
                />
            )
            }


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
        MaxSize: 100,
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
    menuId,
    menuLabel
}) {

    const disabledField = menuId == 46 ? false : true
    const [formData, setFormData] = useState({
        Id: null,
        DocNo: "",
        Product: "",
        List: null,
        EquipmentLocation: "",
        DateOfInspection: null,
        PreviousInspectionReport: "",
        TestMethod: "",
        ExpiryDate: null,
        TestDate: null,
        InspectionType: null,
        InspectionType_Name: "",
        CalibratedTestEquipment: "",
        ClientTestEquipment: "",
        InspectionInformation: {},
        Finding: "",
        CriticalFinding: "",
        TargetDateOfClosure: null,
        TargetDateOfClosure1: null,
        OtherRemarks: "",
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
    const [isSave, setIsSave] = useState(false);

    const [exam, setExam] = useState();

    //----Fields-----
    const [viewFields, setViewFields] = useState([])
    const [fieldsWithStructure, setFieldsWithStructure] = useState([]);
    const [groupedFields, setgroupedFields] = useState([])

    // -----Aproove-----
    const [selectedDatas, setselectedDatas] = React.useState([]); //selected rows details
    const [property, setProperty] = useState(false);
    const [itemLabel, setItemLabel] = useState('');
    const [certify, setCertify] = useState(0);




    //TagAttachmentTab
    const [dbTagAttachmentDetails, setdbTagAttachmentDetails] = useState([])

    // client sign
    const [isImageModalOpenSign, setIsImageModalOpenSign] = useState(false);

    const handleImageClickSign = (index) => {
        setIsImageModalOpenSign(true);
    };

    const handleCloseImagePopupSign = () => {
        setIsImageModalOpenSign(false);
    };


    const { showAlert } = useAlert();
    const {
        GetInspectionFields, getexaminationform, getdocno, getjoborderheaddetails, getInspectionDetails, upsertInspection, upsertproofreading, upsertApprove, uploadAttachfiles, generatecertificate
    } = inspectionApis();

    const { getrecordprevnext } = allocationApis()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFormData({
                    Id: 0,
                    DocNo: "",
                    Product: "",
                    List: null,
                    DateOfInspection: currentDate,
                    PreviousInspectionReport: "",
                    TestMethod: "",
                    ExpiryDate: currentDate,
                    InspectionType: null,
                    InspectionType_Name: "",
                    CalibratedTestEquipment: "",
                    ClientTestEquipment: "",
                    TestDate: currentDate,
                    InspectionInformation: {},
                    Finding: "",
                    CriticalFinding: "",
                    TargetDateOfClosure: "",
                    TargetDateOfClosure1: "",
                    OtherRemarks: "",
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
                        DocNo: "",
                        Product: "",
                        List: null,
                        DateOfInspection: null,
                        PreviousInspectionReport: "",
                        TestMethod: "",
                        ExpiryDate: null,
                        InspectionType: null,
                        InspectionType_Name: "",
                        CalibratedTestEquipment: "",
                        ClientTestEquipment: "",
                        TestDate: null,
                        InspectionInformation: {},
                        Finding: "",
                        CriticalFinding: "",
                        TargetDateOfClosure: "",
                        TargetDateOfClosure1: "",
                        OtherRemarks: "",
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
                    Product: null,
                    List: null,
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
                    Finding: '',
                    CriticalFinding: '',
                    TargetDateOfClosure: "",
                    TargetDateOfClosure1: "",
                    OtherRemarks: '',
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




            const response = await getInspectionDetails({ id: detailPageId })

            if (response.status == "Success") {


                const result = JSON.parse(response?.result)



                let updatedData = {
                    ...formData,
                    ...result,
                    InspectionInformation: result?.InspectionInformation ?? {}
                }
                if (result?.Status == 2 || result?.Status == 4) {
                    setCertify(2)
                    setIsSave(true);
                }
                else if (result?.Status == 7 || result?.Status == 6) {
                    if (result?.Status == 7) {
                        setIsSave(true);
                    }
                    setCertify(0)
                }
                else {
                    setCertify(1)
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

        setItemLabel(value)
        setConfirmData({
            message: `You want to Approve.`,
            type: "info",
            header: value == 'correction' ? 'Correction' : value == 'suspend' ? 'Suspend' : "Authorization",
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
                let isExam;
                const isValid = await validateFormData();
                if (isValid) {
                    isExam = await validateExamination();
                }
                if (isValid && isExam) {
                    setConfirmData({ message: "Save", type: "success" });
                    setConfirmType("save");
                    setConfirmAlert(true);
                }

                break;
            case "prev":
                handlePrevNext(1);
                break;
            case "next":
                handlePrevNext(2);
                break;
            case "approve":
                handleProperty(value);
                break;
            case "reject":
                handleProperty(value);
                break;
            case "correction":
                handleProperty(value);
                break;
            case "suspend":
                handleProperty(value);
                break;
            case "certificate":
                handleCertificate();
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
        else if (menuLabel == 'Acknowedgement') {
            setId(backId)
            setPageRender(3);
        }
        else {
            setId(backId)
            setPageRender(2);
        }
        setCertify(0)
        setIsSave(false)
    };




    const handlePrevNext = async (value) => {
        try {
            const response = await getrecordprevnext({
                allocation: formData?.Allocation,
                category: 3,
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

    const validateFormData = async () => {

        for (const tabKey of Object.keys(groupedFields)) {
            // Check the FieldStructure of the first field in each group
            const tabCaption = groupedFields[tabKey]?.[0]?.TabCaption || tabKey; // Use TabCaption or fallback to tabKey


            // For `TabFields` structure validation
            for (const field of groupedFields[tabKey]) {
                const { FieldName, Mandatory, Caption } = field;

                const fieldValue = formData["InspectionInformation"][FieldName];


                if (fieldValue === null || fieldValue === undefined || fieldValue === "" || fieldValue === 0) {
                    setExpanded(tabKey)
                    showAlert("info", `${Caption} is reqiured (${tabCaption})`);
                    return false
                }



            }

        }

        return true;
    }


    const validateExamination = async () => {

        const updatedChildData = tableBody?.map((obj) => {
            return obj?.Items?.map((list) => {
                return {
                    slNo: list.SlNo,
                    subCategory: list.SubCategory,
                    data: list.Data,
                    remarks: list.Remarks,
                    tabName: list.Tab_Name
                };
            });
        }).flat();


        const filteredData = updatedChildData
            .filter(item => item.data === 0 || item.data == undefined)
            .map(({ tabName, slNo }) => ({ tabName, slNo }));

        if (filteredData.length > 0) {
            filteredData.forEach(item => {
                setExpanded(item.tabName)
                showAlert("info", `Ensure fill the SLNO ${item.slNo} in ${item.tabName}`);
            });
            return false
        }
        setExam(updatedChildData)
        return true
    }


    const handleSave = async () => {

        try {
            const validFieldNames = new Set(viewFields.map(field => field.FieldName));

            // Filter formData.InspectionInformation to keep only valid fields
            const filteredInspectionInformation = Object.keys(formData?.InspectionInformation || {})
                .filter(key => validFieldNames.has(key)) // Keep only keys that exist in viewFields
                .reduce((obj, key) => {
                    obj[key] = formData?.InspectionInformation[key];
                    return obj;
                }, {});
            const inspectionInformationArray = [filteredInspectionInformation]

            if (menuId == 46) {
                const headData = {
                    id: formData?.Id,
                    list: formData?.List,
                    owner: formData?.Owner,
                    address: formData?.Address,
                    location: formData?.Location
                }

                const response3 = await upsertproofreading(headData);

            }


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
                location: formData?.Location,
                inspectionInformation: inspectionInformationArray,
                examination: exam,
                finding: formData?.Finding,
                criticalFinding: formData?.CriticalFinding,
                targetDateOfClosure: formData?.TargetDateOfClosure,
                targetDateOfClosure1: formData?.TargetDateOfClosure1,
                otherRemarks: formData?.OtherRemarks,
                attachments: formData?.Attachment || [],
                reject: formData?.Reject,
                rejectRemarks: formData?.RejectRemarks,
                pfStatus: menuId == 46 ? true : false
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
                        throw error
                    }

                }
                // handleNew();
                // const actionExists = userAction.some((action) => action.Action == "New");
                // if (!actionExists) {
                handleclose();
                // }

                // }

            }
        } catch (error) {
            throw error
        }



        // if (!filteredData?.length) {


    };

    //confirmation

    const handleConfirmSubmit = () => {
        if (confirmType == "save") {
            handleSave();
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


    const handleApproveClose = () => {
        setProperty(false);
        setMainDetails1({});
    }




    const handlePropertyConfirmation = async (status) => {
        if (status == 1 || status == 3 || status == 4) {
            if (!mainDetails1?.Remarks) {
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
                if (response?.result
                    == '2' || response?.result
                    == '4') {
                    setCertify(2)
                    setIsSave(true);
                }
                else if (response?.result
                    == '7' || response?.result
                    == '6') {
                    if (response?.result
                        == '7') {
                        setIsSave(true);
                    }
                    setCertify(0)
                }
                else {
                    setCertify(1)
                }
                // handleclose();
                setMainDetails1({})
            }
        } catch (error) {
        } finally {
            setselectedDatas([]);
            setProperty(false);
        }
    };



    const handleCertificate = async () => {
        // Open a blank popup immediately on user action
        const popupWindow = window.open("", "PDFPopup", "width=800,height=600,resizable=yes,scrollbars=yes");
        if (!popupWindow) {
            alert("Popup blocked! Please allow popups for this site.");
            return;
        }

        try {
            const response = await generatecertificate({ inspectionId: detailPageId });
            // Assuming response.result is a JSON string containing a URL property
            const resultObj = JSON.parse(response?.result);

            if (response?.status === "Success" && resultObj) {
                // Set the popup's location to the PDF URL
                popupWindow.location.href = resultObj;
            } else {
                console.error("Certificate generation failed or invalid URL.");
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
                    certify={certify}
                    isSave={isSave}
                    menuId={menuId}
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
                    // maxHeight:"40vw"
                    marginTop: '50px'
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
                            label={"Certificate No"}
                            name={"DocNo"}
                            type={"text"}
                            disabled={true}
                            mandatory={true}
                            value={formData}
                            setValue={setFormData}
                            maxLength={50}
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
                                disabled={disabledField}
                                mandatory={false}
                                value={formData}
                                setValue={setFormData}
                                maxLength={100}
                            />
                            <UserInputField
                                label={"Office Address"}
                                name={"Address"}
                                type={"text"}
                                disabled={disabledField}
                                mandatory={false}
                                value={formData}
                                setValue={setFormData}
                                maxLength={100}
                            />
                            <UserInputField
                                label={"Equipment Location"}
                                name={"Location"}
                                type={"text"}
                                disabled={disabledField}
                                mandatory={false}
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
                        <InspDetailsTab key={999} formData={formData} setFormData={setFormData} disabledField={disabledField} />
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

                    <CustomizedAccordions
                        // icons="fa-solid fa-briefcase"
                        label={'Findings'}
                        expanded={expanded == "Findings"}
                        onChange={handleChange("Findings")}
                    >
                        <AcknowledgementTab key={998} formData={formData} setFormData={setFormData} />
                    </CustomizedAccordions>

                    <TagFileTab

                        // fieldsWithStructure6={fieldsWithStructure6} // Pass fields belonging to this tab
                        expanded={expanded === 6}
                        onChange={handleChange(6)}
                        formData={formData}
                        setFormData={setFormData}
                        // currentLanguageName={currentLanguageName}
                        // menuObj={menuObj}
                        disabledDetailed={menuId == 31 || menuId == 30 ? true : false}
                        detailPageId={formData.Id}
                        // handleTagSwitch={!preview ? handleTagSwitch : false}
                        dbTagAttachmentDetails={dbTagAttachmentDetails}
                        setdbTagAttachmentDetails={setdbTagAttachmentDetails}
                    />


                </Box>
                {menuId == 31 &&
                    <Box sx={{ width: '100%', display: "flex", flexDirection: "column", alignItems: "end", p: 3 }}>
                        {formData?.ClientSignPath ? (
                            <img
                                src={formData?.ClientSignPath}
                                alt="Thumbnail"
                                style={{ cursor: "pointer", width: "50px", height: "50px", border: `1px solid #000` }}
                                onClick={handleImageClickSign}
                            />
                        ) : (
                            <ImageNotSupportedIcon sx={{ color: secondaryColor }} />
                        )}
                        <Typography variant="body2" sx={{ mt: 1, color: "black", fontWeight: 'bold' }}> {/* Adjust color as needed */}
                            Client Sign
                        </Typography>
                    </Box>
                }


            </Box>

            <ConfirmationAlert
                handleClose={handleConfrimClose}
                open={confirmAlert}
                data={confirmData}
                submite={handleConfirmSubmit}
            />
            <ApproveConfirmation
                handleClose={handleApproveClose}
                open={property}
                data={confirmData}
                submite={handlePropertyConfirmation}
                itemLabel={itemLabel}
                mainDetails={mainDetails1}
                setMainDetails={setMainDetails1}
            />


            <ImageModal
                isOpen={isImageModalOpenSign}
                imageUrl={formData?.ClientSignPath}
                handleCloseImagePopup={handleCloseImagePopupSign}
            />

        </Box>
    );
}


