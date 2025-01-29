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
                (action) => action.Action === "New" && detailPageId !== 0
            ) && (
                    <ActionButton
                        iconsClick={iconsClick}
                        icon={"fa-solid fa-plus"}
                        caption={"New"}
                        iconName={"new"}
                    />
                )}
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
        FieldName: "iData",
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
        FieldName: "sRemarks",
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
    setId
}) {
   
    const currentDate = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        Id:null,
        Product:null,
        List:null,
        OwnerName: null,
        OfficeAddress: "",
        EquipmentLocation: null,
        DateOfInspection: null,
        PreviousInspectionReport: null,
        TestMethod: null,
        ExpiryDate: null,
        LastProofLoadTest: null,
        CalibratedTestEquipment: null,
        ClientTestEquipment: null,
        InspectionInformation: {},
    });
    const [mainDetails, setMainDetails] = useState({});
    const [detailPageId, setDetailPageId] = useState(summaryId);
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [confirmData, setConfirmData] = useState({});
    const [confirmType, setConfirmType] = useState(null);
    const [expanded, setExpanded] = useState(1);//Accordion open
    const [tableBody, setTableBody] = useState();


    //----Fields-----
    const [viewFields, setViewFields] = useState([])
    const [fieldsWithStructure, setFieldsWithStructure] = useState([]);
    const [groupedFields, setgroupedFields] = useState([])


    console.log('table detail', tableBody);

    const { showAlert } = useAlert();
    const {
        GetInspectionFields,getInspectionDetails,upsertInspection,deleteInspection
    } = inspectionApis();



    useEffect(() => {
        const fetchData = async () => {
            try {
                setFormData({
                    Id:detailPageId,
                    Product:null,
                    List:null,
                    OwnerName: null,
                    OfficeAddress: "",
                    EquipmentLocation: null,
                    DateOfInspection: currentDate,
                    PreviousInspectionReport: null,
                    TestMethod: null,
                    ExpiryDate: null,
                    LastProofLoadTest: null,
                    CalibratedTestEquipment: null,
                    ClientTestEquipment: null,
                    TestDate:null,
                    InspectionInformation:{},
                })
                setFieldsWithStructure([])
                const response = await GetInspectionFields({
                    Id:productId
                })
                if (response.status == "Success") {
                    let fieldsData = JSON.parse(response?.result);
                    console.log('field view', fieldsData);

                    setViewFields(fieldsData)

                    fieldsData.forEach((field) => {
                        const {FieldName,FieldDisplayType } = field;
              
                        const fieldDisplayType = FieldDisplayType.toLowerCase();
                         let processedValue;
                        if (fieldDisplayType === "date") {
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
                         
                      });

                      if (detailPageId > 0) {
                        await fetchDetail(); // Call the fetchDetail function after viewFields are set
                      }  

                }
                else{
                    setViewFields([]);
                    setFormData({
                        Id:detailPageId,
                        OwnerName: null,
                        Product:null,
                        List:null,
                        OfficeAddress: "",
                        EquipmentLocation: null,
                        DateOfInspection: null,
                        PreviousInspectionReport: null,
                        TestMethod: null,
                        ExpiryDate: null,
                        LastProofLoadTest: null,
                        CalibratedTestEquipment: null,
                        ClientTestEquipment: null,
                        TestDate:null,
                        InspectionInformation: {},
                    })
                    setFieldsWithStructure([]) 
                }
            } catch (error) {
                setViewFields([]);
                setFormData({
                    Id:detailPageId,
                    OwnerName: null,
                    Product:null,
                    List:null,
                    OfficeAddress: "",
                    EquipmentLocation: null,
                    DateOfInspection: null,
                    PreviousInspectionReport: null,
                    TestMethod: null,
                    ExpiryDate: null,
                    LastProofLoadTest: null,
                    CalibratedTestEquipment: null,
                    ClientTestEquipment: null,
                    TestDate:null,
                    InspectionInformation: {},
                })
                setFieldsWithStructure([])
            }
        };
        if(productId){  
           fetchData();
        }
    }, [productId,detailPageId]);


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
        setExpanded(Object.keys(groupedFields1)[0])
        // Now you have your tagDetailsAccumulator with unsorted fields in the first array, sorted by FieldOrder

    }, [viewFields]);


    const fetchDetail =async()=>{
        try {
    
        
        
           //  const response = await gettagdetails({id:detailPageId,tagId:menuObj?.TagId ,languageId:currentLanguage})
            const response = await getInspectionDetails({id:detailPageId})
            if(response.status =="Success"){
             
         
             const result = JSON.parse(response?.result)
             console.log('inp get detail',result);

             let updatedData = {
                ...formData,
                ...result,
                InspectionInformation:result?.InspectionInformation?? {}
             }
             
          
           
            console.log('updata88',updatedData);
            
             setFormData(updatedData)
             setTableBody(result?.Examination)
             
            }
            
            
        } catch (error) {
          handleclose()
        }
       }










   

   

    //Accordion 
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    const handleNew = async () => {
        setMainDetails({
            AltName: null,
            DisableBatch: false,
            Category: null,
            Category_Name: null,
            Group: false,
            Code: null,
            Id: detailPageId,
            Name: null,
            Parent: null,
            Parent_Name: null,
            DisableSerialNo: false,
            Type: null,
            Type_Name: null,
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
        setId(backId)
        setPageRender(3);
    };

    const handleSave = async () => {

        const updatedChildData = tableBody.map((obj) => {
            return obj?.items?.map((list) => {
                return {
                    slNo: list.Id,
                    subCategory: list.Category,
                    data: list.iData,
                    remarks: list.sRemarks,
                };
            });
        }).flat();

        const hasDataZero = updatedChildData.some(
            (item) => item.data === 0
          );
          if(hasDataZero)
          {
                showAlert("info","Ensure complete Data")
          }

          if(!hasDataZero)
          {
            const saveData = {
                id: formData?.Id,
                product: formData?.Product,
                list: formData?.List,
                dateOfInspection: formData?.DateOfInspection,
                expiryDate: formData?.ExpiryDate,
                // inspectionType: formData?.,
                previousInspectionReport: formData?.PreviousInspectionReport,
                testMethod: formData?.TestMethod,
                calibratedTestEquipment: formData?.CalibratedTestEquipment,
                clientTestEquipment: formData?.ClientTestEquipment,
                testDate: formData?.TestDate,
                inspectionInformation:[formData?.InspectionInformation], 
                examination: updatedChildData,
            };
            console.log('insp sva data',saveData);
            
            const response = await upsertInspection(saveData);
            if (response.status === "Success") {
    
                showAlert("success", response?.message);
                // handleNew();
                const actionExists = userAction.some((action) => action.Action === "New");
                if (!actionExists) {
                    handleclose();
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
        response = await deleteInspection([{ id: detailPageId }]);
        if (response?.status === "Success") {
            showAlert("success", response?.message);
            handleNew();
            const actionExists = userAction.some((action) => action.Action === "New");
            if (!actionExists) {
                setPageRender(1);
            }
        }
    };

  

    

    

    

    
  console.log('insp summ93',formData);

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
                        <UserInputField
                            label={"Doc No"}
                            name={"DocNo"}
                            type={"text"}
                            disabled={false}
                            mandatory={true}
                            value={formData}
                            setValue={setFormData}
                            onBlurAction={() => handleMasterExist(1)}
                            maxLength={100}
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
                                onBlurAction={() => handleMasterExist(2)}
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
                                onBlurAction={() => handleMasterExist(2)}
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
                                onBlurAction={() => handleMasterExist(2)}
                                maxLength={100}
                            />

                        </Box>



                    </Box>
                    <CustomizedAccordions
                        // icons="fa-solid fa-briefcase"
                        label={'Inspection Details'}
                        type={1}
                        expanded={expanded === 1}
                        onChange={handleChange(1)}
                    >
                        <InspDetailsTab formData={formData} setFormData={setFormData} />
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
                                            expanded={expanded === tabKey}
                                            onChange={handleChange(tabKey)}
                                            formData={formData?.InspectionInformation}
                                            setFormData={ (data)=>setFormData((prevFormData) => ({
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

                    <Box>
                        {tableBody?.map((list, index) => (
                            <>
                                <CustomizedAccordions
                                    // icons="fa-solid fa-briefcase"
                                    label={list?.Category_Name}
                                    type={1}
                                    expanded={expanded === index + 1}
                                    onChange={handleChange(index + 1)}
                                >
                                    <InspBodyTable fields={tableFields} tableData={list?.items} settableData={setTableBody} preview={false} typeName={list?.Name} />
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


