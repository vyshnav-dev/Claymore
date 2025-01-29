import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Breadcrumbs, Stack, Typography, useTheme } from "@mui/material";
// import { tagSettingsApis } from "../../../services/settings/TagSettings/tagSettings";
import NormalButton from "../../../component/Buttons/NormalButton";
import ConfirmationAlert from "../../../component/Alerts/ConfirmationAlert";
import { useAlert } from "../../../component/Alerts/AlertContext";
import PDTable from "./PDTable";
import {
    primaryColor,
    secondaryColor,
    thirdColor,
} from "../../../config/config";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ActionButton from "../../../component/Buttons/ActionButton";
import PDInsertion from "./PDInsertion";
import { masterApis } from "../../../service/Master/master";
import UserAutoComplete from "../../../component/AutoComplete/UserAutoComplete";
import UserInputField from "../../../component/InputFields/UserInputField";

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

function BasicBreadcrumbs({ group }) {
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
                        Product Field Details
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

            {userAction.some((action) => action.Action === "Property") && (
                <>
                    {detailPageId !== 0 && (
                        <ActionButton
                            iconsClick={iconsClick}
                            icon={"fa-solid fa-gears"}
                            caption={"Property"}
                            iconName={"property"}
                        />
                    )}
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

export default function PDDetails({
    setPageRender,
    detailPageId,
    userAction,
    disabledDetailed, }) {

    const [value, setValue] = React.useState(0);
    const [products, setProducts] = React.useState({ Name: null });
    const [formData, setFormData] = React.useState({});
    const { showAlert } = useAlert();
    const [action, setAction] = React.useState(0);
    const { upsertProductFieldmaster, ProductFieldCheck, GetProductFieldDetails,getProductdetails } = masterApis();
    const [editId, setEditId] = React.useState(0);
    const [confirmAlert, setConfirmAlert] = React.useState(false);
    const [confirmData, setConfirmData] = React.useState({});
    const [numberList, setNumberList] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            if (editId !== 0) {
                const response = await GetProductFieldDetails({
                    id: editId,
                });
                if (response?.status === "Success") {
                    const myObject = JSON.parse(response.result);
                    setFormData(myObject[0]);
                    if (myObject[0]?.NumberList) {
                        setNumberList(JSON.parse(myObject[0]?.NumberList));
                      } else {
                        setNumberList([]);
                      }
                }
            } else {
                handleNew();
            }
        };

        fetchData();
    }, [editId]);


    React.useEffect(() => {
        const fetchData = async () => {
            if (detailPageId !== 0) {
                const response = await getProductdetails({
                    id: detailPageId,
                });
                if (response?.status === "Success") {
                    const myObject = JSON.parse(response.result);
                    setProducts(myObject[0]);
                }
            } else {
                handleNew();
            }
        };

        fetchData();
    }, [detailPageId]);


    const handleNew = () => {
        setFormData({
            Product: null,
            Caption: "",
            DataType: 0,
            DataTypeId: 0,
            DataTypeName: "",
            Default: false,
            DefaultValue: "",
            DisplayControlType: 0,
            DisplayControlTypeName: "",
            FieldOrder: 0,
            FieldType: 0,
            FieldTypeName: "",
            Hidden: false,
            Id: 0,
            MaxSize: 0,
            MaximumValue: 0,
            MinimumValue: 0,
            Name: "",
            ReadOnly: false,
            Tab: 0,
            Tab_Name: "",
            ToolTip: "",
            Product_Name: null
        });
    };

    const handleChange = (event, newValue, id) => {
        
        setEditId(id ? id : 0);
        setValue(newValue);
    };

    

    const handleclose = () => {
        setPageRender(1);
    };

    console.log('formdata', formData);

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
                if (!mainDetails?.Name) emptyFields.push("Name");
                if (!mainDetails.Code) emptyFields.push("Code");
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

    

    const handleCheck = async () => {
        const response = await ProductFieldCheck({
            Id: editId || 0,
            Product: detailPageId,
            Tab: formData?.Tab,
            Name: formData?.Name,
            FieldOrder: formData?.FieldOrder
        });
        if (response?.status === "Success") {
            return true;
        }
        else {
            showAlert("info", response?.message)
            return false;
        }
    }

    const handleSaveTagField = async () => {

        const status = await handleCheck(); // Wait for handleCheck to complete

        if (!status) {
            return; // Exit if handleCheck fails
        }

        const saveData = {
            iId: editId? editId: 0,
            product: detailPageId,
            name: formData.Name,
            caption: formData.Caption,
            dataType: formData.DataType,
            tab: formData.Tab,
            maxSize: formData.MaxSize,
            defaultValue: formData.DefaultValue,
            displayControlType: formData.DisplayControlType,
            default: formData.Default,
            fieldType: formData.FieldType,
            minimumValue: formData.MinimumValue,
            maximumValue: formData.MaximumValue,
            toolTip: formData.ToolTip,
            fieldOrder: formData.FieldOrder,
            hidden: formData.Hidden,
            readOnly: formData.ReadOnly,
            numberlist:formData.DisplayControlType === 3 ? numberList :[]
        };

      
            const response = await upsertProductFieldmaster(saveData);
            if (response?.status === "Success") {
                handleConfrimClose();
                setValue(0);
                handleNew();
                setEditId(0)
                showAlert("success", response?.message);
                return;
            }
        


    };

    const handleConfirmSubmit = (value) => {

        if (value === 1) {
            setAction(1);
            const emptyFields = [];
            if (!formData.Tab) emptyFields.push("Select Tab");
            if (!formData.Caption) emptyFields.push("Caption");
            if (!formData.Name) emptyFields.push("Name");
            // if (!formData.DataType) emptyFields.push("Data Type");
            if (!formData.DisplayControlType) emptyFields.push("Control Type");
            if (!formData.FieldOrder) emptyFields.push("Field Order");
            // if (!formData.FieldType) emptyFields.push("Field Type");
            if (emptyFields.length > 0) {
                showAlert("info", `Please Provide ${emptyFields[0]}`);
                return;
            }
            setConfirmData({ message: "Save", type: "success" });
            setConfirmAlert(true);
        }
    };

    const handleConfrimClose = () => {
        setConfirmAlert(false);
        setConfirmData({});
    };

    const handleSave = () => {
        if (action === 1) {
            handleSaveTagField();
        }
    };

    console.log('prod', products);


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
                        <Box>
                        <UserInputField
                                label={"Product"}
                                name={"Name"}
                                type={"text"}
                                disabled={true}
                                mandatory={true}
                                value={products}
                                setValue={setProducts}
                                maxLength={100}
                            />
                        </Box>
                        
                        <Tabs
                            value={value}
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
                                    textTransform: "none",
                                    backgroundColor: null
                                }}
                                label="Feilds"
                                {...a11yProps(0)}
                            />
                            <Tab
                                sx={{
                                    padding: "0px",
                                    textTransform: "none",
                                    backgroundColor: null
                                }}
                                label="Add/Edit"
                                {...a11yProps(1)}
                            />



                        </Tabs>
                        <CustomTabPanel value={value} index={0}>
                            {value === 0 && (
                                <PDTable
                                    detailPageId={detailPageId}
                                    editAction={handleChange}
                                    products={products}
                                />
                            )}
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            {value === 1 && (
                                <>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            mb: 1,
                                            gap: 1,
                                        }}
                                    >
                                        {/* <NormalButton action={handleNew} label="New" /> */}
                                        <NormalButton
                                            action={() => handleConfirmSubmit(1)}
                                            label="Save"
                                        />
                                    </Box>


                                    <PDInsertion
                                        formData={formData}
                                        setFormData={setFormData}
                                        detailPageId={detailPageId}
                                        numberList={numberList}
                                        setNumberList={setNumberList}
                                    />



                                </>
                            )}
                        </CustomTabPanel>
                    </Box>



                </Box>
            </Box>


            <ConfirmationAlert
                handleClose={handleConfrimClose}
                open={confirmAlert}
                data={confirmData}
                submite={handleSave}
            />

        </Box>
    );
}