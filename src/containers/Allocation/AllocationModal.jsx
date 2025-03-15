import {
    Box,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
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




export default function AllocationModal({ handleCloseModal, selected, hardRefresh }) {

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
        paddingLeft: "4px",
        border: `1px solid ${thirdColor}`,
        minWidth: "100px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    }
    const { GetTechnicianList } = allocationApis()
    const userData = JSON.parse(localStorage.getItem("ClaymoreUserData"))[0];

    const [formData, setFormData] = useState({})
    const [mainDetails, setMainDetails] = useState({
        JobOrderNo: '',
        Date: '',
        Client_Name: null,
    });
    const [products, setProducts] = useState([]);
    const { showAlert } = useAlert();
    const { UpsertJobOrderAllocation, GetPendingJobOrderdetails } = allocationApis()


    React.useEffect(() => {
        const fetchData = async () => {
            if (selected !== 0) {
                const response = await GetPendingJobOrderdetails({
                    JobOrderNo: selected,
                });
                if (response?.status === "Success") {
                    const myObject = JSON.parse(response.result);
                    
                    

                    setMainDetails(myObject?.PendingJobOrderDetails);
                    setProducts(myObject?.ProductDetails)
                }
            } else {
                handleNew();
            }
        };

        fetchData();
    }, [selected]);

    const handleSave = async (e) => {
        // e.preventDefault();
        const emptyFields = [];
        if (!formData?.details?.length) emptyFields.push("Technician");
        if (emptyFields.length > 0) {
            showAlert('info', `Please Allocate ${emptyFields[0]}`);
            return;
        }
        const saveData = {
            Id: 0,
            jobOrderNo: selected,
            client: mainDetails?.Client_Name,
            date: mainDetails?.Date,
            details: formData?.details,
        }


        const response = await UpsertJobOrderAllocation(saveData)
        if (response?.status === "Success") {
            handleCloseModal()
            hardRefresh();
            showAlert('success', `Technician Allocate Successfully`);
            return;
        }

    };
    return (
        <>
            <DialogContent>

                <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap',minHeight:'350px' }} >

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
                        <TableContainer component={Paper} sx={{  minHeight:'275px', maxWidth: '370px', overflowY: 'auto', mt: 2, scrollbarWidth: 'thin' }}>
                            <Table stickyHeader size="small" sx={{ minWidth: '200px' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ ...headerCellStyle }}>Product</TableCell>
                                        <TableCell sx={{ ...headerCellStyle }}>Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products?.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell
                                                sx={{
                                                    ...bodyCellStyle,
                                                    maxWidth: '150px', // Adjust width as needed
                                                    wordBreak: 'break-word',
                                                    whiteSpace: 'pre-wrap'
                                                }}
                                            >
                                                {item.Name}
                                            </TableCell>
                                            <TableCell sx={{ ...bodyCellStyle }}>{item.Quantity}</TableCell>
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
            <DialogActions>
                <NormalButton action={handleCloseModal} label="Cancel" />
                <NormalButton action={handleSave} label="Ok" />
            </DialogActions>

        </>
    );
}
