import {
    Box,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField
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




export default function AllocatedModal({ handleCloseModal, selected, hardRefresh }) {

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

    const userData = JSON.parse(localStorage.getItem("ClaymoreUserData"))[0];

    const [formData, setFormData] = useState({
    })
    const [mainDetails, setMainDetails] = useState({});
    const [suspend, setSuspend] = useState([]);
    const [products, setProducts] = useState([]);
    const { showAlert } = useAlert();
    const { UpsertJobOrderAllocation, GetAllocatedJobOrderDetails,updateproductsuspend} = allocationApis()


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

    const handleSave = async () => {
        const emptyFields = [];
        if (!formData?.details?.length) emptyFields.push("Technician");
        if (emptyFields.length > 0) {
            showAlert('info', `Please Allocate ${emptyFields[0]}`);
            return;
        }
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

    };


    const handleSuspend = (e, items) => {
        const value = e.target.value;

        const data = {
            product: items?.Product,
            quantity: value || 0
        };

        // Check if the product already exists in suspend array
        setSuspend(prev => {
            const existingIndex = prev.findIndex(p => p.product === items?.Product);
            if (existingIndex !== -1) {
                // Update existing product suspendQty
                const updatedSuspend = [...prev];
                updatedSuspend[existingIndex] = data;
                return updatedSuspend;
            } else {
                // Add new product entry
                return [...prev, data];
            }
        });
    };

    const handleSubmitSuspend = async () =>{
        try {
            if(!suspend?.length){
                showAlert("info", "Please add Suspend Quantity");
            }
            else{
                const saveData = {
                    allocation:selected,
                    details:suspend
                  }
    
                  const response = await updateproductsuspend(saveData)
            if (response?.status === "Success") {
                showAlert('success', response?.message);
                handleCloseModal()
                hardRefresh();
            }
            }
            
            
        } catch (error) {
            throw error;
        }
    }



    return (
        <>
            <Box >
                <DialogContent >

                    <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', minHeight: '350px' }} >

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, maxHeight: '200px', minHeight: '200px' }}>
                            <TableContainer
                                component={Paper}
                                sx={{ maxHeight: "275px", minHeight: "275px", maxWidth: "fit-Content", overflowY: "auto", mt: 2, scrollbarWidth: "thin" }}
                            >
                                <Table stickyHeader size="small" sx={{ minWidth: "fit-Content" }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ ...headerCellStyle }}>Product</TableCell>
                                            <TableCell sx={{ ...headerCellStyle }}>Quantity</TableCell>
                                            <TableCell sx={{ ...headerCellStyle }}>Suspended Quantity</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {products?.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell
                                                    sx={{
                                                        ...bodyCellStyle,
                                                        maxWidth: "150px", // Adjust width as needed
                                                        wordBreak: "break-word",
                                                        whiteSpace: "pre-wrap",
                                                        pl:1
                                                    }}
                                                >
                                                    {item.Product_Name}
                                                </TableCell>
                                                <TableCell sx={{ ...bodyCellStyle, pl: 1 }}>{item.Quantity}</TableCell>
                                                <TableCell sx={{               // remove extra padding so the cell doesn't force space
                                                    ...bodyCellStyle

                                                }}>
                                                    <TextField
                                                        multiline
                                                        type="number"
                                                        variant="outlined"
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                                            handleSuspend({ target: { value } }, item);
                                                        }}
                                                        value={suspend.find(p => p.product === item?.Product)?.quantity || ''}
                                                        inputMode="numeric"  // Helps on mobile devices
                                                        pattern="[0-9]*"     // Allows only numbers
                                                        inputProps={{ min: 0 }}
                                                        sx={{
                                                            width: '100%',
                                                            '& .MuiOutlinedInput-root': {
                                                                display: 'flex',
                                                                flex: 1,
                                                                alignItems: 'stretch',
                                                            },
                                                            '& .MuiOutlinedInput-input': {
                                                                py: 0,
                                                            },
                                                        }}
                                                    />

                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <MultiCheckBox
                                key={'Technician'}
                                sFieldName={'Inspector'}
                                label={'Technician'}
                                // isMandatory={field?.Mandatory}
                                formDataHeader={mainDetails}
                                key1={'Technician'}
                                //disabled={isDisabled}
                                // tagId={field.LinkTag}'technition'
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

                <DialogActions >
                    <NormalButton action={handleSubmitSuspend} label="Suspend" />
                    <NormalButton action={handleSave} label="Ok" />
                    <NormalButton action={handleCloseModal} label="Cancel" />

                </DialogActions>
            </Box>
        </>
    );
}
