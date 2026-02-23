import {
    Box,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField,
    Tooltip,
    IconButton
} from "@mui/material";
import React, { useState } from "react";
import NormalButton from "../../component/Buttons/NormalButton";
import { useAlert } from "../../component/Alerts/AlertContext";
import MultiCheckBox from "../../component/MultiCheckBox.jsx/MultiCheckBox";
import { allocationApis } from "../../service/Allocation/allocation";
import UserInputField from "../../component/InputFields/UserInputField";
import {
    backgroundColor,
    primaryColor,
    profileDateFields,
    secondaryColor,
    selectedColor,
    thirdColor,
} from "../../config/config";
import UserAutoComplete from "../../component/AutoComplete/UserAutoComplete";
import Loader from "../../component/Loader/Loader";
import { masterApis } from "../../service/Master/master";
import AutoComplete from "../../component/AutoComplete/AutoComplete";
import ActionButton from "../../component/Buttons/ActionButton";
import DeleteIcon from "@mui/icons-material/Delete";



export default function AllocatedModal({ handleCloseModal, selected, hardRefresh, userAction }) {

    const headerCellStyle = {
        padding: "0px",
        paddingLeft: "4px",
        border: `1px solid ${thirdColor}`,
        fontWeight: "600",
        font: "14px",
        backgroundColor: secondaryColor,
        color: "white",
        paddingTop: "3px",
        paddingBottom: "3px",
        paddingRight: '2px'
    }

    const bodyCellStyle = {
        padding: "0px",
        // paddingLeft: "4px",
        border: `1px solid ${thirdColor}`,
        minWidth: "100px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    }
    const { GetTechnicianList } = allocationApis()
    const { getproductlist } = masterApis();

    const userData = JSON.parse(localStorage.getItem("ClaymoreUserData"))[0];
    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = useState({
    })
    const [mainDetails, setMainDetails] = useState({});
    const [transfer, setTransfer] = useState({
        From: null,
        To: null
    });
    const [suspend, setSuspend] = useState([]);
    const [products, setProducts] = useState([]);
    const { showAlert } = useAlert();
    const { UpsertJobOrderAllocation, GetAllocatedJobOrderDetails, updateproductsuspend, upsertjobtransfer } = allocationApis()

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };



    React.useEffect(() => {
        const fetchData = async () => {
            if (selected !== 0) {
                const response = await GetAllocatedJobOrderDetails({
                    id: selected,
                });
                if (response?.status === "Success") {
                    const myObject = JSON.parse(response.result);

                    const detail = myObject?.jobOrderDetails
                    if (detail) {
                        const formattedDate = detail.Date?.split("T")[0];

                        // Update the main details with the formatted date
                        setMainDetails(prevState => ({
                            ...prevState,
                            ...detail,
                            Date: formattedDate,
                        }));

                        // Update the other states with the response data
                        setProducts(myObject?.ProductDetails || []);
                        setFormData({
                            details: myObject?.InspecotrDetails
                        });
                    }

                }



            } else {
                handleNew();
            }
        };

        fetchData();
    }, [selected]);
    const handleNew = () => {
        setMainDetails({
            JobOrderNo: '',
            Date: '',
            Client_Name: null,
        })
    }

    const [localRows, setLocalRows] = useState([]);

    // Initialize localRows when products change
    React.useEffect(() => {
        if (products.length > 0) {
            setLocalRows(products.map(p => ({ ...p, isNew: false })));
        }
    }, [products]);

    const handleSave = async () => {

        try {
            const emptyFields = [];
            if (!formData?.details?.length) emptyFields.push("Technician");
            if (emptyFields.length > 0) {
                showAlert('info', `Please Allocate ${emptyFields[0]}`);
                return;
            }
            handleOpen();
            const saveData = {
                Id: selected,
                jobOrderNo: mainDetails?.JobOrderNo,
                client: mainDetails?.Client_Name,
                date: mainDetails?.Date,
                details: formData?.details,
            }

            const response = await UpsertJobOrderAllocation(saveData)
            if (response?.status === "Success") {
                handleCloseModal()
                hardRefresh();
                showAlert('success', response?.message);
                return;
            }
        } catch (error) {

        } finally {
            handleClose();
        }

    };


    // const handleSuspend = (e, items) => {
    //     const value = e.target.value;

    //     const data = {
    //         product: items?.Product,
    //         quantity: value || 0
    //     };

    //     // Check if the product already exists in suspend array
    //     setSuspend(prev => {
    //         const existingIndex = prev.findIndex(p => p.product === items?.Product);
    //         if (existingIndex !== -1) {
    //             // Update existing product suspendQty
    //             const updatedSuspend = [...prev];
    //             updatedSuspend[existingIndex] = data;
    //             return updatedSuspend;
    //         } else {
    //             // Add new product entry
    //             return [...prev, data];
    //         }
    //     });
    // };

    const validateRowsBeforeAdd = () => {
        for (const row of localRows) {
            const qty = Number(row.Quantity);

            if (row?.isNew && !row?.Product) {
                showAlert('info', 'Please select a product for  existing row before adding a new one.');
                return false;
            }

            if (row?.isNew && !qty) {
                showAlert('info', 'Please enter a valid quantity (greater than 0) for  existing row before adding a new one.');
                return false;
            }
            if (row?.isNew && !row.Remarks) {
                showAlert('info', 'Please add remarks for existing  row before adding a new one.');
                return false;
            }
        }
        return true;
    };

    // Function to add a new row
    const handleAddRow = () => {
        // Validate all existing rows first
        if (!validateRowsBeforeAdd()) {
            return;
        }

        const newRow = {
            Id: Date.now(), // temporary unique ID
            Product: 0,
            Product_Name: '',
            Quantity: 0,
            Remarks: '',
            isNew: true,
        };
        setLocalRows(prev => [...prev, newRow]);
    };

    const handleDeleteRow = (rowToDelete) => {
        // Remove the row from localRows
        setLocalRows(prev => prev.filter(row => row.Id !== rowToDelete.Id));

        // If the deleted row had a product assigned, remove its suspend entry
        if (rowToDelete.Product) {
            setSuspend(prev => prev.filter(item => item.product !== rowToDelete.Product));
        }
    };

    // Handler for product selection in new rows
    const handleProductChange = (row, selectedProduct) => {
        // If cleared (selectedProduct is null or product ID is falsy), reset the row
        if (!selectedProduct || !selectedProduct.Product) {
            setLocalRows(prev =>
                prev.map(r => (r.Id === row.Id ? { ...r, Product: null, Product_Name: '' } : r))
            );
            setSuspend(prev => prev.filter(item => item.product !== row.Product));
            return;
        }

        // Duplicate check: prevent selecting the same product in another row
        const isUsed = localRows.some(r => r.Product === selectedProduct.Product && r.Id !== row.Id);
        if (isUsed) {
            showAlert('warning', 'This product is already allocated.');
            return;
        }

        setLocalRows(prev =>
            prev.map(r => (r.Id === row.Id ? { ...r, Product: selectedProduct.Product, Product_Name: selectedProduct.Product_Name } : r))
        );

        setSuspend(prev =>
            prev.map(item =>
                item.Id === row.Id ? { ...item, product: selectedProduct.Product, productName: selectedProduct.Product_Name } : item
            )
        );
    };


    // Modify handleFieldChange to also store tempId for new rows
    const handleFieldChange = (e, row, fieldName) => {

        if (!row?.Product) {
            showAlert('info', `Please Provide Product`)
            return;
        }
        const value = e.target.value;
        setSuspend(prev => {
            // Find existing entry by product ID or tempId for new rows
            const existingIndex = prev.findIndex(p =>
                (p.product === row?.Product && row.Product)
            );
            const newEntry = {
                ...(existingIndex !== -1 ? prev[existingIndex] : {}),
                [fieldName]: value,
                product: row.Product, // might be null initially
                productName: row.Product_Name,
                Id: row.Id,  // store tempId to associate with row
                IsOld: row?.IsOld
            };
            if (existingIndex !== -1) {
                return prev.map((item, idx) => idx === existingIndex ? newEntry : item);
            } else {
                return [...prev, newEntry];
            }
        });
    };

    // Update handleSubmitSuspend to filter valid entries and validate product
    const handleSubmitSuspend = async () => {
        try {
            // Build a map of suspend entries keyed by product ID (only those with a product)
            const suspendMap = new Map(
                suspend.filter(item => item.product).map(item => [item.product, item])
            );

            const validSuspend = [];

            for (let [product, entry] of suspendMap.entries()) {
                const hasQuantity = entry.quantity !== '' && entry.quantity !== null && entry.quantity !== undefined;
                const hasRemarks = entry.remarks && entry.remarks.trim() !== '';

                const label = entry?.IsOld == 1 ? "Edit Qty": "Qty"
                // If both are empty, skip this entry (user is not suspending this product)
                if (!hasQuantity && !hasRemarks) {
                    continue;
                }

                // If at least one is filled, both must be filled
                if (!hasQuantity) {
                    showAlert('info', `Please provide ${label} for product "${entry.productName || product}"`);
                    return;
                }
                if (!hasRemarks) {
                    showAlert('info', `Please provide remarks for product "${entry.productName || product}"`);
                    return;
                }

                // Both are filled → add to valid list
                validSuspend.push(entry);
            }

            if (validSuspend.length === 0) {
                showAlert('info', 'No data to update');
                return;
            }

            // Prepare and send data
            const saveData = {
                allocation: selected,
                details: validSuspend.map(({ product, quantity, remarks }) => ({ product, quantity, remarks }))
            };
            const response = await updateproductsuspend(saveData);
            if (response?.status === 'Success') {
                showAlert('success', response?.message);
                handleCloseModal();
                hardRefresh();
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleSubmitTransfer = async () => {
        try {
            const emptyFields = [];
            if (!transfer?.From) emptyFields.push(" From Technician");
            if (!transfer?.To) emptyFields.push(" To Technician");
            if (emptyFields.length > 0) {
                showAlert('info', `Please Provide ${emptyFields[0]}`);
                return;
            }
            const saveData = {
                allocation: selected,
                fromTechnician: transfer?.From,
                toTechnician: transfer?.To
            }

            const response = await upsertjobtransfer(saveData)
            if (response?.status === "Success") {
                showAlert('success', response?.message);
                handleCloseModal()
                hardRefresh();
            }



        } catch (error) {
            throw error;
        }
    }



    return (
        <>
            <Box >
                <DialogContent >

                    <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', minHeight: '350px', width: '110vh' }} >

                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            <UserInputField
                                label={"Job Order No"}
                                name={"JobOrderNo"}
                                type={"text"}
                                disabled={true}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                                width={200}
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
                                width={200}
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
                                width={200}
                            />

                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, maxHeight: '200px', minHeight: '200px', width: '100%', }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '560px', border: '1px solid #ddd', maxHeight: "277px", mt: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, }}>
                                    {userAction.some((action) => action.Action === "Suspend") && (
                                        <ActionButton
                                            iconsClick={handleSubmitSuspend}
                                            icon={"save"}
                                            caption={"Update"}
                                            iconName={"edit"}
                                        />
                                    )}
                                    <ActionButton
                                        iconsClick={handleAddRow}
                                        icon={"fa-solid fa-plus"}
                                        caption={"Add"}
                                        iconName={"new"}
                                    />
                                </Box>

                                <TableContainer
                                    component={Paper}
                                    sx={{ maxHeight: "275px", maxWidth: "100%", overflowY: "auto", scrollbarWidth: "thin", }}
                                >
                                    <Table stickyHeader size="small" sx={{ minWidth: "fit-content", tableLayout: "auto" }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ ...headerCellStyle }}></TableCell>
                                                <TableCell sx={{ ...headerCellStyle }}>Product</TableCell>
                                                <TableCell sx={{ ...headerCellStyle }}>Qty</TableCell>
                                                {userAction.some((action) => action.Action === "Suspend") && (
                                                    <>
                                                        <TableCell sx={{ ...headerCellStyle }}>Edit Qty</TableCell>
                                                        <TableCell sx={{ ...headerCellStyle }}>Remarks</TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {localRows.map((row, index) => (
                                                <TableRow key={row.id || index}>
                                                    <TableCell sx={{ ...bodyCellStyle, minWidth: "30px", textAlign: "center" }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteRow(row)}
                                                            disabled={!row.isNew} // optional: allow deletion only for newly added rows
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell sx={{ ...bodyCellStyle, minWidth: "250px" }}>
                                                        <AutoComplete
                                                            tableField
                                                            formData={row}
                                                            setFormData={(d) => handleProductChange(row, d)}
                                                            autoId="Product"
                                                            apiKey={getproductlist}
                                                            params1="Search"
                                                            params3="Type"
                                                            params3Value={1}
                                                            formDataName="Product_Name"
                                                            formDataiId="Product"
                                                            disabled={!row.isNew}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ ...bodyCellStyle, minWidth: "50px" }}>
                                                        {row.isNew ? (
                                                            <TextField
                                                                type="number"
                                                                variant="outlined"
                                                                value={row.Quantity}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    setLocalRows(prev =>
                                                                        prev.map(r => r.Id === row.Id ? { ...r, Quantity: val } : r)
                                                                    );
                                                                    handleFieldChange(e, row, 'quantity');
                                                                }}
                                                                inputMode="numeric"
                                                                inputProps={{ min: -999999 }}
                                                                sx={{
                                                                    width: '100%',
                                                                    height: 30,
                                                                    '& .MuiOutlinedInput-root': {
                                                                        display: 'flex',
                                                                        flex: 1,
                                                                        alignItems: 'stretch',
                                                                    },
                                                                    '& .MuiOutlinedInput-input': {
                                                                        py: .5,
                                                                    },
                                                                }}
                                                            />
                                                        ) : (
                                                            <Typography sx={{ py: 0.5, pl: 1 }}>{row.Quantity}</Typography>
                                                        )}
                                                    </TableCell>
                                                    {userAction.some((action) => action.Action === "Suspend") && (
                                                        <>
                                                            <TableCell sx={{ ...bodyCellStyle }}>
                                                                <TextField
                                                                    type="text"
                                                                    variant="outlined"
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        if (/^-?\d*$/.test(value)) {
                                                                            handleFieldChange(e, row, 'quantity');
                                                                        }
                                                                    }}
                                                                    value={suspend.find(p => (p.product === row?.Product && row.Product && !row?.isNew))?.quantity || ''}
                                                                    inputMode="numeric"
                                                                    pattern="-?[0-9]*"
                                                                    inputProps={{ min: -999999 }}
                                                                    disabled={row?.isNew}
                                                                    sx={{
                                                                        width: '100%',
                                                                        height: 30,
                                                                        '& .MuiOutlinedInput-root': {
                                                                            display: 'flex',
                                                                            flex: 1,
                                                                            alignItems: 'stretch',
                                                                        },
                                                                        '& .MuiOutlinedInput-input': {
                                                                            py: 0.5,
                                                                        },
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell sx={{ ...bodyCellStyle }}>
                                                                <Tooltip title={localRows.find(p => (p.Id === row?.Id ))?.Remarks || ''} arrow>
                                                                    <TextField
                                                                        type="text"
                                                                        variant="outlined"
                                                                        onChange={(e) => {
                                                                            handleFieldChange(e, row, 'remarks')
                                                                            setLocalRows(prev =>
                                                                                prev.map(r => r.Id === row.Id ? { ...r, Remarks: e.target.value } : r)
                                                                            );
                                                                        }}
                                                                        value={localRows.find(p => (p.Id === row?.Id ))?.Remarks || ''}
                                                                        sx={{
                                                                            width: '100%',
                                                                            height: 30,
                                                                            '& .MuiOutlinedInput-root': {
                                                                                display: 'flex',
                                                                                flex: 1,
                                                                                alignItems: 'stretch',
                                                                                maxHeight: '55px',
                                                                                overflow: 'hidden',
                                                                            },
                                                                            '& .MuiOutlinedInput-input': {
                                                                                py: 0.5,
                                                                                whiteSpace: 'nowrap',
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                            },
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                            </TableCell>
                                                        </>
                                                    )}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                            <MultiCheckBox
                                key={'Technician'}
                                sFieldName={'Inspector'}
                                label={'Technicians'}
                                isMandatory={true}
                                formDataHeader={mainDetails}
                                key1={'Technician'}
                                //disabled={isDisabled}
                                objectName="details"
                                formData={formData}
                                setFormData={setFormData}
                                // disabled={disabledDetailed || field?.ReadOnly || false}
                                tag_getbusinessentitysummary={GetTechnicianList}
                                userData={userData?.UserId}
                            />


                        </Box>

                    </Box>
                </DialogContent>
                {userAction.some((action) => action.Action === "Transfer") && (
                    <>
                        <Typography sx={{ pl: 2, fontWeight: 'bold', display: 'flex', flexWrap: 'wrap' }}>Transfer</Typography>

                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', p: 1, ml: 2 }}>

                            <UserAutoComplete
                                apiKey={GetTechnicianList}
                                formData={transfer}
                                setFormData={setTransfer}
                                label={"From Technician"}
                                autoId={"Inspector"}
                                required={true}
                                formDataName={"From_Name"}
                                formDataiId={"From"}
                                criteria={2}
                                allocation={selected}
                            />
                            <UserAutoComplete
                                apiKey={GetTechnicianList}
                                formData={transfer}
                                setFormData={setTransfer}
                                label={"To Technician"}
                                autoId={"Inspector"}
                                required={true}
                                formDataName={"To_Name"}
                                formDataiId={"To"}
                                criteria={0}
                                allocation={selected}
                            />
                        </Box>
                    </>

                )}


                <DialogActions >
                    {userAction.some((action) => action.Action === "Transfer") && (
                        <NormalButton action={handleSubmitTransfer} label="Trasfer" />
                    )}


                    {userAction.some((action) => action.Action === "Save") && (
                        <NormalButton action={handleSave} label="Save" />
                    )}

                    <NormalButton action={handleCloseModal} label="Cancel" />

                </DialogActions>
            </Box>
            <Loader loader={open} loaderClose={handleClose} />
        </>
    );
}
