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
import { inspectionApis } from "../../service/Inspection/inspection";




export default function InvoiceModal({ handleCloseModal, selected, hardRefresh, userAction }) {


    const currentDate = new Date().toLocaleDateString("en-CA");
    const [mainDetails, setMainDetails] = useState({
        Date: currentDate,
        PreparedBy: '',
        Remarks: ''
    });
    const { showAlert } = useAlert();
    const { upsertinvoice,getinvoicedetails } = inspectionApis()


    React.useEffect(() => {
        const fetchData = async () => {
            if (selected !== 0) {
                const response = await getinvoicedetails({
                    allocation: selected,
                });
                if (response?.status === "Success") {
                    const myObject = JSON.parse(response.result);
                        setMainDetails(myObject[0]);
                }



            } else {
                handleNew();
            }
        };

        fetchData();
    }, [selected]);
    const handleNew = () => {
        setMainDetails({
            Date: currentDate,
            PreparedBy: '',
            Remarks: ''
        })
    }

    const handleSave = async () => {
        const emptyFields = [];
        if (!mainDetails.PreparedBy) {
            emptyFields.push("Prepare By");
        }
        else if (!mainDetails.Date) {
            emptyFields.push("Date");
        }
        else if (!mainDetails.Remarks) {
            emptyFields.push("Remarks");
        }
        if (emptyFields.length > 0) {
            showAlert('info', `Please Provide ${emptyFields[0]}`);
            return;
        }
        const saveData = {
            allocation: selected,
            date: mainDetails?.Date,
            preparedBy: mainDetails?.PreparedBy,
            remarks: mainDetails?.Remarks,
        }

        const response = await upsertinvoice(saveData)
        if (response?.status === "Success") {
            handleCloseModal()
            hardRefresh();
            showAlert('success', response?.message);
            return;
        }

    };



    return (
        <>
            <Box >
                <DialogContent >

                    <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', }} >

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <UserInputField
                                label={"Prepared By"}
                                name={"PreparedBy"}
                                type={"text"}
                                disabled={false}
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
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                                width={200}
                            />
                            <UserInputField
                                label={"Remarks"}
                                name={"Remarks"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={mainDetails}
                                setValue={setMainDetails}
                                maxLength={100}
                                width={200}
                                multiline={true}
                            />

                        </Box>





                    </Box>

                </DialogContent>

                <DialogActions >

                    {userAction.some((action) => action.Action === "Invoice") && (
                        <NormalButton action={handleSave} label="Save" />
                    )}

                    <NormalButton action={handleCloseModal} label="Cancel" />

                </DialogActions>
            </Box>
        </>
    );
}

