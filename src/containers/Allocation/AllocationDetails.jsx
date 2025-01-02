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
                        Allocation Details
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

const initialColumns = [

    { id: 0, label: 'Sl No' },
    { id: 1, label: 'Order' },
    { id: 2, label: 'Technicians' },
    { id: 3, label: 'Product' },
    { id: 4, label: 'Quantity' },
]

export default function AllocationDetails({
    setPageRender,
    detailPageId: summaryId,
    userAction,
    disabledDetailed,
    group,
    groupSelection,
}) {
    const [mainDetails, setMainDetails] = useState({});
    const [companyList, setCompanyList] = useState([]);
    const [unitInfo, setUnitInfo] = useState([]);
    const [detailPageId, setDetailPageId] = useState(summaryId);
    const [confirmAlert, setConfirmAlert] = useState(false);
    const [confirmData, setConfirmData] = useState({});
    const [confirmType, setConfirmType] = useState(null);
    const { gettaglist, upsertstockcount } = stockCountApis();
    const [baseUnit, setBaseUnit] = useState({});
    const [property, setProperty] = useState(false);
    const [filteredRows, setFilteredRows] = React.useState([]);
    const [columns, setColumns] = React.useState([]);

    //   const excludedFields = ["IdName", "Group", "GroupId","TotalRows"];

    //   //To apply some filters on table rows
    //   const initialColumns =
    //     rows && rows.length > 0
    //       ? Object.keys(rows[0])
    //           .filter((key) => !excludedFields.includes(key))
    //           .map((key) => ({
    //             id: key,
    //             label:
    //               key.charAt(0).toUpperCase() +
    //               key
    //                 .slice(1)
    //                 .replace(/([A-Z])/g, " $1")
    //                 .trim(), // Format label as readable text
    //             minWidth: 100, // Set default minWidth for all columns
    //             maxWidth: 200,
    //           }))
    //       : [];
    React.useEffect(() => {
        setColumns(initialColumns);
    }, []);

    const { showAlert } = useAlert();
    const {
        gettagdetails,
        deletetag,
        checkexistenceintag,
        gettagparentlist,
        upsertproductmaster,
        updateproductproperties,
        updatetagparent,
    } = masterApis();

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
                const response = await gettagdetails({
                    id: detailPageId,
                    tagId: 11,
                });
                if (response?.status === "Success") {
                    const myObject = JSON.parse(response?.result);
                    const baseUnitArray = myObject?.UnitInfo.filter(
                        (item) => item.Baseunit === true
                    );
                    const nonBaseUnitArray = myObject?.UnitInfo.filter(
                        (item) => item.Baseunit === false
                    );
                    setMainDetails(myObject?.TagInfo[0]);
                    setCompanyList([...myObject?.EntityInfo, { BE: 0, BE_Name: null }]);
                    setUnitInfo(
                        nonBaseUnitArray?.length
                            ? nonBaseUnitArray
                            : [
                                {
                                    Barcode: null,
                                    Conversion: null,
                                    Unit: null,
                                    Unit_Name: null,
                                },
                            ]
                    );
                    setBaseUnit(baseUnitArray[0]);
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
            Id: detailPageId,
            AvailableQty: null,
            AssignQty: null,
            product_Name: null,
            Technician:[],
        });
        setCompanyList([{ BE: 0, BE_Name: null }]);
        setUnitInfo([
            {
                Barcode: null,
                Conversion: null,
                Unit: null,
                Unit_Name: null,
            },
        ]);
        setBaseUnit({
            Barcode: null,
            Baseunit: true,
            Conversion: null,
            Id: 0,
            Unit: null,
            Unit_Name: null,
        });
        setDetailPageId(0);
    };

    useEffect(() => {
        if (!baseUnit?.Unit) {
            setUnitInfo([
                {
                    Barcode: null,
                    Conversion: null,
                    Unit: null,
                    Unit_Name: null,
                },
            ]);
        }
    }, [baseUnit?.Unit]);

    function hasDuplicateBarcode(data) {
        return data.some(
            (item, index, array) =>
                array.findIndex((el) => el.Barcode === item.Barcode) !== index
        );
    }

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
                if (!mainDetails.Category) emptyFields.push("Category");
                if (!mainDetails.Type) emptyFields.push("Type");
                if (!baseUnit?.Unit) emptyFields.push("Base Unit");
                if (!baseUnit?.Barcode) emptyFields.push("Bar Code");
                const filteredCompanyList = companyList
                    .filter((item) => item.BE && item.BE !== 0) // Filter out items where BE is 0 or not present
                    .map((item) => ({ be: item.BE }));
                if (!filteredCompanyList?.length) emptyFields.push("Entity");
                if (emptyFields.length > 0) {
                    showAlert("info", `Please Provide ${emptyFields[0]}`);
                    return;
                }
                let checkDataMissing = false;
                if (unitInfo?.length > 1) {
                    checkDataMissing = unitInfo.some(
                        (item) => !item?.Unit || !item?.Conversion || !item?.Barcode
                    );
                } else if (unitInfo?.length === 1) {
                    if (
                        unitInfo.some(
                            (item) => !item?.Unit && !item?.Conversion && !item?.Barcode
                        )
                    ) {
                        checkDataMissing = false;
                    } else {
                        // If no completely empty items, check if all items are valid
                        checkDataMissing = !unitInfo.some(
                            (item) => item?.Unit && item?.Conversion && item?.Barcode
                        );
                    }
                } else {
                    checkDataMissing = false;
                }

                if (checkDataMissing) {
                    showAlert("info", `Please fill the unit table row`);
                    return;
                }
                if (hasDuplicateBarcode([...unitInfo, baseUnit])) {
                    showAlert("info", `Please fill unique barcode`);
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
        const filteredCompanyList = companyList
            .filter((item) => item.BE && item.BE !== 0) // Filter out items where BE is 0 or not present
            .map((item) => ({ be: item.BE }));
        const filteredUnitInfo = unitInfo?.map((item) => ({
            unit: item?.Unit,
            conversion: item?.Conversion,
            barcode: item?.Barcode,
            baseUnit: item?.Baseunit,
        }));
        const updateUnit =
            filteredUnitInfo?.length === 1 && !filteredUnitInfo[0]?.unit
                ? []
                : filteredUnitInfo;
        const saveData = {
            id: mainDetails?.Id,
            name: mainDetails?.Name,
            code: mainDetails?.Code,
            altName: mainDetails?.AltName,
            type: mainDetails?.Type,
            category: mainDetails?.Category,
            // warehouse: mainDetails?.Id,
            parent: mainDetails?.Parent,
            group: group !== 0 ? true : mainDetails?.Group,
            disableBatch: mainDetails?.Type !== 3 ? mainDetails?.DisableBatch : true,
            disableSerialNo:
                mainDetails?.Type !== 3 ? mainDetails?.DisableSerialNo : true,
            unitInfo: [
                {
                    unit: baseUnit?.Unit,
                    conversion: null,
                    barcode: baseUnit?.Barcode,
                    baseUnit: baseUnit?.Baseunit,
                },
                ...updateUnit,
            ],
            entityInfo: filteredCompanyList,
        };
        const response = await upsertproductmaster(saveData);
        if (response.status === "Success") {
            if (group === 2) {
                const parentPayload = groupSelection?.map((item) => ({
                    id: item,
                }));
                const parentData = {
                    tagId: 11,
                    parentId: Number(response?.result),
                    ids: parentPayload,
                };
                const respone2 = await updatetagparent(parentData);
            }
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
        response = await deletetag([{ id: detailPageId }], 11);
        if (response?.status === "Success") {
            showAlert("success", response?.message);
            handleNew();
            const actionExists = userAction.some((action) => action.Action === "New");
            if (!actionExists) {
                setPageRender(1);
            }
        }
    };

    const handleDeleteRow = (index) => {
        if (companyList?.length <= 1) {
            setCompanyList([{ BE: 0, BE_Name: null }]);
        } else {
            setCompanyList((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleMasterExist = async (type) => {
        try {
            const response = await checkexistenceintag({
                tagId: 11,
                id: mainDetails?.Id,
                name: type === 1 ? mainDetails?.Name : mainDetails?.Code,
                type: type,
            });
            if (response.status === "Success") {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    };

    const handleProperty = () => {
        setConfirmData({
            message: `You want to Activate/Inactivate the property.`,
            type: "info",
            header: "Property",
        });
        setProperty(true);
    };

    const handlePropertyConfirmation = async (status) => {
        const propertyPayload = [
            {
                id: detailPageId,
            },
        ];

        const saveData = {
            status: status,
            ids: propertyPayload,
        };
        try {
            const response = await updateproductproperties(saveData);

            if (response?.status === "Success") {
                showAlert("success", response?.message);
                setConfirmData({});
            }
        } catch (error) {
        } finally {
            setProperty(false);
        }
    };

    console.log('main',mainDetails);
    

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
                <BasicBreadcrumbs group={group} />
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
                            label={"Doc No"}
                            name={"DocNo"}
                            type={"text"}
                            disabled={false}
                            mandatory={true}
                            value={mainDetails}
                            setValue={setMainDetails}
                            onBlurAction={() => handleMasterExist(1)}
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
                            <UserAutoComplete
                                apiKey={gettaglist}
                                formData={mainDetails}
                                setFormData={setMainDetails}
                                label={"Product"}
                                autoId={"product"}
                                required={true}
                                formDataName={"product_Name"}
                                formDataiId={"product"}
                                tagId={12}
                            />

                            <UserInputField
                                label={"Available Qty"}
                                name={"AvailableQty"}
                                type={"text"}
                                disabled={true}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                onBlurAction={() => handleMasterExist(1)}
                                maxLength={100}
                            />
                            <UserInputField
                                label={"Assign Qty"}
                                name={"AssignQty"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                onBlurAction={() => handleMasterExist(2)}
                                maxLength={100}
                            />

                            <MultiCheckBox
                                key={'Technician'}
                                sFieldName={'Technician'}
                                label={'Technician'}
                                // isMandatory={field?.Mandatory}
                                formDataHeader={mainDetails}
                                key1={'Technician'}
                                //disabled={isDisabled}
                                // tagId={field.LinkTag}'technition'
                                objectName="Technician"
                                formData={mainDetails}
                                setFormData={setMainDetails}
                            // disabled={disabledDetailed || field?.ReadOnly || false}
                            // tag_getbusinessentitysummary={tag_getbusinessentitysummary}
                            />

                            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end', gap: '20px' }} >
                                <ActionButton
                                    // iconsClick={iconsClick}
                                    icon={"fa-solid fa-circle-check"}
                                    caption={"Ok"}
                                    iconName={"Ok"}
                                />

                                <ActionButton
                                    // iconsClick={iconsClick}
                                    icon={"fa-solid fa-circle-xmark"}
                                    caption={"Cancel"}
                                    iconName={"Cancel"}

                                />
                            </Box>
                        </Box>


                    </Box>
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

                        {filteredRows  ? (
                            <Paper sx={{ width: "100%", mb: 1 }}>
                                {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
                                {/* <TableContainer sx={{maxHeight:"60vh",overflow:"scroll" }}> */}
                                <TableContainer
                                    sx={{ maxHeight: "60vh", overflow: "auto", scrollbarWidth: "thin" }}
                                >
                                    <Table stickyHeader sx={{ minWidth: 750 }}>
                                        <TableHead>
                                            <TableRow sx={{ position: "sticky", top: 0 }}>
                                                {columns.map((column, index) => (
                                                <TableCell
                                                    key={column.id}
                                                    style={{
                                                        minWidth: column.minWidth,
                                                        position: "relative",
                                                    }}
                                                    sx={{
                                                        padding: "0px",
                                                        paddingLeft: "4px",
                                                        border: `1px solid ${thirdColor}`,
                                                        fontWeight: "600",
                                                        font: "14px",
                                                        backgroundColor: secondaryColor,
                                                        color: "white",
                                                        paddingTop: "3px",
                                                        paddingBottom: "3px",
                                                    }}
                                                    onDoubleClick={() => handleDoubleClick(index)}
                                                >
                                                    {column.label}
                                                    <span
                                                        style={{
                                                            position: "absolute",
                                                            height: "100%",
                                                            right: 0,
                                                            top: 0,
                                                            width: "5px",
                                                            cursor: "col-resize",
                                                            backgroundColor: "rgba(0,0,0,0.1)",
                                                        }}
                                                        onMouseDown={(e) => handleResize(index, e)}
                                                    />
                                                </TableCell>
                                                 ))} 


                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredRows.map((row, index) => {
                                                const isItemSelected = isSelected(row[IdName]);
                                                return (
                                                    <TableRow
                                                        key={`${row[IdName]}-${index}`}
                                                        onClick={(event) => handleClick(event, row)}
                                                        onMouseDown={(event) => handleLongPressStart(event, row)}
                                                        onMouseUp={handleLongPressEnd}
                                                        onMouseLeave={handleLongPressEnd} // In case the user drags out of the row
                                                        onTouchStart={(event) => handleLongPressStart(event, row)} // For mobile
                                                        onTouchEnd={handleLongPressEnd}
                                                        role="checkbox"
                                                        aria-checked={isItemSelected}
                                                        onDoubleClick={() => props.onRowDoubleClick(row[IdName])}
                                                        tabIndex={-1}
                                                        sx={{
                                                            cursor: "pointer",

                                                            backgroundColor: isItemSelected
                                                                ? selectedColor
                                                                : index % 2 === 1
                                                                    ? thirdColor
                                                                    : null,
                                                        }}
                                                    >
                                                        {/* <TableCell sx={{ padding: "0px",textAlign:"center" }}>
                        <Checkbox
                          sx={{ padding: "0px" }}
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell> */}

                                                        {columns.map((column) => (
                                                            <Tooltip
                                                                title={
                                                                    column.id === "Narration" ? row[column.id] : null
                                                                }
                                                            >
                                                                <TableCell
                                                                    sx={{
                                                                        padding: "0px",
                                                                        paddingLeft: "4px",
                                                                        border: `1px solid ${thirdColor}`,
                                                                        minWidth: "100px",
                                                                        maxWidth: column.maxWidth,
                                                                        whiteSpace: "nowrap",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        fontWeight: row["Group"] ? 800 : null,
                                                                    }}
                                                                    key={column.id}
                                                                    style={{ minWidth: column.minWidth }}
                                                                >
                                                                    {profileDateFields.includes(column.label)
                                                                        ? convertToLocaleDateString(row[column.id])
                                                                        : row[column.id] === null
                                                                            ? ""
                                                                            : `${row[column.id]}`}
                                                                </TableCell>
                                                            </Tooltip>
                                                        ))}
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        ) : (
                            <>
                                <Box sx={{ width: "100%", textAlign: "center", my: 4 }}>
                                    <Typography>No Data</Typography>
                                </Box>
                            </>
                        )}






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

