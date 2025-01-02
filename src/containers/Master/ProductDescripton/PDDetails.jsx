import React, { useState } from "react";
import {
    Box,
    Stack,
    Button as ButtonM,
    useTheme,
    useMediaQuery,
    Typography,
    Tabs,
    Tab,
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
import { stockCountApis } from "../../../service/Transaction/stockcount";
import WarehouseAutoComplete from "../../../component/AutoComplete/WarehouseAutoComplete";
import { closeStockCountApis } from "../../../service/Transaction/closeStockCount";
import { salesApis } from "../../../service/Transaction/sales";
import InputCommon from "../../../component/InputFields/InputCommon";
// import ReceiptBodyTable from "./ReceiptBodyTable";
import AutoSelectNoHeader from "../../../component/AutoComplete/AutoSelectNoHeader";
import Attachments from "../../../component/Attachment/Attachments";
import PDInfoTable from "./PDInfoTable";
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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

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
                        Product Description Details
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
            {userAction.some((action) => action.Action === "New" && detailPageId !== 0) && (
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
            {/* <ActionButton
                iconsClick={iconsClick}
                icon={"fa-solid fa-backward-step"}
                caption={"Previous"}
                iconName={"previous"}
            />
            <ActionButton
                iconsClick={iconsClick}
                icon={"fa-solid fa-forward-step"}
                caption={"Next"}
                iconName={"next"}
            /> */}
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
        Caption: "Customer",
        CharacterCasing: 0,
        ColumnSpan: 0,
        CopyfromParent: false,
        Default: false,
        DefaultValue: "0",
        DonotAllowSpecialChar: false,
        EditableinCustomerPortal: false,
        ErrorMessage: null,
        Field: 333,
        FieldDisplayType: "drop down",
        FieldName: "Product",
        FieldOrder: 1,
        FieldStructure: 5,
        FieldType: "Tag",
        FilterCondition: null,
        Hidden: false,
        HiddenInGroup: false,
        HideLeftPane: false,
        InformationField: false,
        InternalStdField: true,
        LinkTag: 14,
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
        width: 150
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
        Caption: "Amount",
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
        FieldName: "Quantity",
        FieldOrder: 3,
        FieldStructure: 5,
        FieldType: "integer",
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
        RegularExpression: /^-?[0-9]*\.?[0-9]{0,0}$/,
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
        width: 80
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
        Caption: "Vat%",
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
        FieldName: "vat%",
        FieldOrder: 14,
        FieldStructure: 5,
        FieldType: "numeric",
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
        width: 80
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
        Caption: "Reference",
        CharacterCasing: 0,
        ColumnSpan: 0,
        CopyfromParent: false,
        Default: false,
        DefaultValue: null,
        DonotAllowSpecialChar: false,
        EditableinCustomerPortal: false,
        ErrorMessage: null,
        Field: 334,
        FieldDisplayType: "popup",
        FieldName: "reference",
        FieldOrder: 14,
        FieldStructure: 5,
        FieldType: "receiptpopup",
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
        width: 80
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
        FieldOrder: 16,
        FieldStructure: 5,
        FieldType: "numeric",
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
        width: 150
    },
]

export default function PDDetails({
    setPageRender,
    detailPageId: summaryId,
    userAction,
    disabledDetailed,
}) {
    const [mainDetails, setMainDetails] = useState({ TagAttachments: [] });
    const [tableBody, setTableBody] = useState([]);
    const [batch, setBatch] = useState([]);
    const [serial, setSerial] = useState([]);
    const [detailPageId, setDetailPageId] = useState(summaryId);
    const [modal, setModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [confirmData, setConfirmData] = useState({});
    const [confirmType, setConfirmType] = useState(null);
    const [unitInfo, setUnitInfo] = useState([]);
    const [baseUnit, setBaseUnit] = useState({});

    //Table
    const [tableData, settableData] = useState([])

    //Tab change
    const [tabValue, setTabValue] = useState(0);

    //Attachments
    const [dbTagAttachmentDetails, setdbTagAttachmentDetails] = useState([])




    const { getdocno, getwarehousebyentity, gettaglist } = stockCountApis();
    const { deletestockclose, upsertstockclose } =
        closeStockCountApis();
    const { showAlert } = useAlert();

    const { GetPrev_NextDocNo, GetSalesDetails, GetDriver } = salesApis()

    //#region Prev_Next
    const previousClick = async () => {
        try {

            const response = await GetPrev_NextDocNo({ iTransId: detailPageId, iDoctype: 2, iType: 1 })

            if (response?.status == 200) {
                console.log(JSON.parse(response.data.ResultData).Table[0]);
                const data = JSON.parse(response.data.ResultData).Table[0]
                setDetailPageId(data?.iTransId)
                setMainDetails({ ...mainDetails, sDocNo: data?.sDocNo })

            }


        } catch (error) {

        }
    }
    const NextClick = async () => {
        try {

            const response = await GetPrev_NextDocNo({ iTransId: detailPageId, iDoctype: 2, iType: 2 })

            if (response?.status == 200) {
                console.log(JSON.parse(response.data.ResultData).Table[0]);
                const data = JSON.parse(response.data.ResultData).Table[0]
                setDetailPageId(data?.iTransId)
                setMainDetails({ ...mainDetails, sDocNo: data?.sDocNo })

            }


        } catch (error) {

        }
    }

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
                const response = await GetSalesDetails({
                    transId: detailPageId,
                });
                if (response?.status === "Success") {
                    const myObject = JSON.parse(response?.result);
                    const mainDetails = myObject?.Header[0];
                    const formattedDocDate = mainDetails?.DocDate?.split("T")[0];
                    const formattedStockDate = mainDetails?.StockDate?.split("T")[0];
                    const tableBodyWithSlNo = myObject?.Body?.map((item, index) => ({
                        ...item,
                        SlNo: index + 1, // Assign SlNo based on the index, starting from 1
                    }));
                    const batchWithSINo = myObject?.Batch?.map((batchItem) => {
                        const matchingTableItem = tableBodyWithSlNo.find(
                            (tableItem) => tableItem.TransDtId === batchItem.TransDtId
                        );

                        return {
                            ...batchItem,
                            tableNo: matchingTableItem ? matchingTableItem.SlNo : null, // Add SINo if match is found
                        };
                    });

                    const serialWithSINo = myObject?.Serial?.map((batchItem) => {
                        const matchingTableItem = tableBodyWithSlNo.find(
                            (tableItem) => tableItem.TransDtId === batchItem.TransDtId
                        );

                        return {
                            ...batchItem,
                            tableNo: matchingTableItem ? matchingTableItem.SlNo : null, // Add SINo if match is found
                            productId: matchingTableItem ? matchingTableItem.Product : null,
                        };
                    });
                    setMainDetails({
                        ...mainDetails,
                        DocDate: formattedDocDate,
                        StockDate: formattedStockDate,
                        Warehouse_Name: tableBodyWithSlNo[0]?.Warehouse_Name,
                        Warehouse: tableBodyWithSlNo[0]?.Warehouse
                    });
                    setTableBody(tableBodyWithSlNo);
                    setBatch(batchWithSINo);
                    setSerial(serialWithSINo);
                } else {
                    handleNew();
                }
            }
        } catch (error) {
            throw error;
        }
    };





    const handleNew = async () => {
        let docNo;
        const response = await getdocno({ docType: 2 });
        if (response?.status === "Success") {
            const myObject = JSON.parse(response.result);
            docNo = myObject;
        }

        setMainDetails({
            StockDate: currentDate,
            DocDate: currentDate,
            Warehouse: null,
            Warehouse_Name: null,
            DocNo: docNo,
            AmtDecimal: 0,
            BatchEnabled: false,
            BinEnabled: false,
            QtyDecimal: 0,
            SerialNoEnabled: false,
            TransId: 0,
            BE: null,
            BE_Name: null,
            WarehouseHeader: false,
            TagAttachments: []
        });
        setTableBody([]);
        setBatch([]);
        setSerial([]);
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
                if (!mainDetails.BE) emptyFields.push("Entity");
                if (!mainDetails.Warehouse && mainDetails?.WarehouseHeader)
                    emptyFields.push("Warehouse");

                if (emptyFields.length > 0) {
                    showAlert("info", `Please Provide ${emptyFields[0]}`);
                    return;
                }

                const checkDataMissing = tableBody.some(
                    (item) =>
                        (!item?.Bin && mainDetails?.BinEnabled) ||
                        (!item?.Warehouse && !mainDetails?.WarehouseHeader) ||
                        !item?.Product ||
                        !item?.Unit ||
                        !item?.Qty
                );

                if (checkDataMissing) {
                    showAlert("info", `Please fill the row`);
                    return;
                }
                const batchableItems = tableBody.filter((item) => item.Batchable);

                // Check if each batchable item has a corresponding batch entry
                const missingBatches = batchableItems.filter(
                    (item) => !batch.some((batch) => batch.TransDtId === item.TransDtId)
                );

                const serialNoItems = tableBody.filter((item) => item.SerialNoEnabled);

                // Check if each batchable item has a corresponding batch entry
                const missingSerialNo = serialNoItems.filter(
                    (item) =>
                        !serial.some((serial) => serial.TransDtId === item.TransDtId)
                );

                if (missingBatches?.length) {
                    showAlert("info", `Batch Missing`);
                    return;
                }

                if (missingSerialNo?.length) {
                    showAlert("info", `Serial No Missing`);
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
            case "previous":
                previousClick()
                break;
            case "next":
                NextClick()
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

        const saveTableBody = tableBody.map((item) => ({
            id: item?.SlNo,
            product: item?.Product,
            quantity: item?.Qty,
            unit: item?.Unit,
            bin: mainDetails?.BinEnabled ? item?.Bin : 0,
            remarks: item?.Remarks,
            warehouse: !mainDetails?.WarehouseHeader
                ? item?.Warehouse
                : mainDetails?.Warehouse,
            rate: item?.Rate,
        }));
        const saveBatch = batch.map((item) => ({
            id: item?.tableNo,
            slNo: item?.SINo,
            batch: item?.Batch,
            quantity: item?.Qty,
        }));

        const saveSerial = serial.map((item) => ({
            id: item?.tableNo,
            slNo: item?.SINo,
            serialNo: item?.SerialNo,
        }));

        const saveData = {
            transId: mainDetails?.TransId,
            docNo: mainDetails?.DocNo,
            docDate: mainDetails?.DocDate,
            stockDate: mainDetails?.StockDate,
            be: mainDetails?.BE,
            // deviceId: 0,
            // processedOn: currentDate,
            body: saveTableBody,
            batch: saveBatch,
            serial: saveSerial,
        };

        return
        const response = await upsertstockclose(saveData);
        if (response.status === "Success") {
            showAlert("success", response?.message);
            handleNew();
            const actionExists = userAction.some((action) => action.Action === "New");
            if (!actionExists) {
                setPageRender(1);
            }
        } else {
            const myObject = JSON.parse(response.result);
            if (myObject && myObject?.length) {
                setTableBody((prevState) =>
                    prevState.map((item) => {
                        const hasError = myObject.some(
                            (secondItem) => secondItem.Product === item.Product
                        );
                        return {
                            ...item,
                            error: hasError,
                        };
                    })
                );
            }
        }
    };

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
        return
        let response;
        response = await deletestockclose([{ id: detailPageId }]);
        if (response?.status === "Success") {
            showAlert("success", response?.message);
            handleNew();
            const actionExists = userAction.some((action) => action.Action === "New");
            if (!actionExists) {
                setPageRender(1);
            }
        }
    };

    const handleEntityChange = () => {
        setTableBody([]);
        setBatch([]);
        setSerial([]);
    };

    const handleRowDoubleClick = (e, row) => {

        // setModal(true);
        // setModalData(row);
    };

    const handleAddRow = () => {
        if (tableBody?.length >= 10000) {
            showAlert("info", "Can't Add more than 10000 row");
            return;
        }
        if (!mainDetails?.BE) {
            showAlert("info", "Please Provide Entity");
            return;
        }
        setModal(true);
        setModalData({
            Product_Name: null,
            Product_Code: null,
            Rate: 0,
            Warehouse_Name: null,
            Qty: null,
            Unit_Name: null,
            Remarks: null,
            Bin: null,
            Bin_Name: null,
            DisableBatch: false,
            DisableSerialNo: false,
            Product: null,
            SlNo: tableBody[tableBody?.length - 1]?.SlNo + 1 || 1,
            TransDtId: tableBody[tableBody.length - 1]?.TransDtId + 1 || 1,
            TransId: 0,
            Unit: null,
            Warehouse: null,
        });
    };

    const handleEditRow = (row) => {
        setModal(true);
        setModalData(row);
    };

    const handleDeleteRow = (index) => {
        if (tableBody.length > 1) {
            const rowToDelete = tableBody[index];

            const batchExist = batch.filter(
                (row) => row.TransDtId !== rowToDelete?.TransDtId
            );
            const serialExist = serial.filter(
                (row) => row.TransDtId !== rowToDelete?.TransDtId
            );

            setBatch(batchExist);
            setSerial(serialExist);

            setTableBody((prevBatch) => {
                const updatedTableBody = prevBatch.filter((_, i) => i !== index);
                return updatedTableBody;
            });
        } else {
            setTableBody([]);
        }
    };

    const handleModalClose = () => {
        setModal(false);
        setModalData({});
    };

    const handleRadioChangeHeader = (event) => {
        setMainDetails({ ...mainDetails, Type: event.target.value });
    };

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
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
                        {/* <Tabs
                            value={tabValue}
                            sx={{

                                minHeight: "35px",
                                height: "35px",
                                padding: "0px",
                                backgroundColor: null, // Background for light mode
                            }}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                        >
                            <Tab
                                sx={{
                                    padding: "0px",
                                    marginRight: "10px",
                                    textTransform: "none",



                                }}
                                label="Header"
                                {...a11yProps(0)}
                            />



                            <Tab
                                sx={{
                                    display: false,
                                    padding: "10px 0px",
                                    textTransform: "none",


                                }}
                                label="Body"
                                {...a11yProps(1)}
                            />

                        </Tabs> */}

                        {/* <CustomTabPanel value={tabValue} index={0}> */}
                            {/* {tabValue === 0 && ( */}
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
                                   
                                    {/* <InputCommon
              label={"Date"}
              name={"sDate"}
              type={"date"}
              disabled={false}
              mandatory={true}
              value={mainDetails.sDate}
              setValue={(data) => {const {name,value} = data
              setMainDetails({...mainDetails,[name]:value})}}
            /> */}

                                    {/* <AutoComplete
              apiKey={GetDriver}
              formData={mainDetails}
              setFormData={setMainDetails}
              label={"payment Type"}
              autoId={"SalesMan"}
              required={true}
              formDataName={"SalesMan"}
              formDataiId={"SalesManId"}
              params1="sSearch"
              params2="iType"
            /> */}
                                    {/* <AutoComplete
              apiKey={GetDriver}
              formData={mainDetails}
              setFormData={setMainDetails}
              label={"Ware house"}
              autoId={"SalesMan"}
              required={true}
              formDataName={"SalesMan"}
              formDataiId={"SalesManId"}
              params1="sSearch"
              params2="iType"
            />
             <AutoComplete
              apiKey={GetDriver}
              formData={mainDetails}
              setFormData={setMainDetails}
              label={"Outlet"}
              autoId={"SalesMan"}
              required={true}
              formDataName={"SalesMan"}
              formDataiId={"SalesManId"}
              params1="sSearch"
              params2="iType"
            />
            <InputCommon
              label={"Narration"}
              name={"sDate"}
              type={"text"}
              disabled={false}
              mandatory={true}
              value={mainDetails.sDate}
              setValue={(data) => {const {name,value} = data
              setMainDetails({...mainDetails,[name]:value})}}
            /> */}
                                    <AutoSelectNoHeader
                                        key={"Product"}
                                        formData={mainDetails}
                                        setFormData={setMainDetails}
                                        autoId={"Product"}
                                        formDataName={`Product_Name`}
                                        formDataiId={"Product"}
                                        required={false}
                                        label={"Product"}
                                        languageName={"english"}
                                        ColumnSpan={0}
                                        disabled={disabledDetailed}
                                        Menu={[{ "Id": 1, "Name": "Product1" }, { "Id": 2, "Name": "Product2" }]}
                                    />
                                    <AutoSelectNoHeader
                                        key={"Tab"}
                                        formData={mainDetails}
                                        setFormData={setMainDetails}
                                        autoId={"Tab"}
                                        formDataName={`Tab_Name`}
                                        formDataiId={"Tab"}
                                        required={false}
                                        label={"Tab"}
                                        languageName={"english"}
                                        ColumnSpan={0}
                                        disabled={disabledDetailed}
                                        Menu={[{ "Id": 1, "Name": "Tab1" }, { "Id": 2, "Name": "Tab2" }]}
                                    />

                                    <PDInfoTable
                                        tableBody={unitInfo}
                                        setTableBody={setUnitInfo}
                                        baseUnit={baseUnit}
                                    />



                                    
                                </Box>
                            {/* // )} */}
                        {/* </CustomTabPanel> */}
                        
                    </Box>
                </Box>
            </Box>

            {/* <TransactonTable
        rows={tableBody}
        IdName={"TransDtId"}
        onRowDoubleClick={handleRowDoubleClick}
        handleDeleteRow={handleDeleteRow}
        handleAddRow={handleAddRow}
        handleEditRow={handleEditRow}
        mainDetails={mainDetails}
      /> */}

            <Box
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
                    {/* <Box
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
                        <ReceiptBodyTable  fields={tableFields} tableData={tableData} settableData={settableData} Batch={batch} setBatch={setBatch} preview={false} />


                    </Box> */}
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
