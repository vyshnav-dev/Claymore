import React from 'react'
import UserInputField from '../../component/InputFields/UserInputField'
import { Box } from '@mui/material'
// import ChecKBoxLabel from '../../component/CheckBox/CheckBoxLabel'

export default function AcknowledgementTab({ formData, setFormData }) {
    return (
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


            <UserInputField
                label={"Findings"}
                name={"Finding"}
                type={"text"}
                disabled={false}
                mandatory={false}
                value={formData}
                setValue={setFormData}
                multiline={true}
                maxLength={50}
            />
            <UserInputField
                label={"Target Date of Closure"}
                name={"TargetDateOfClosure"}
                type={"date"}
                disabled={false}
                mandatory={false}
                value={formData}
                setValue={setFormData}
            />
            <UserInputField
                label={"Critical Finding"}
                name={"CriticalFinding"}
                type={"text"}
                disabled={false}
                mandatory={false}
                value={formData}
                setValue={setFormData}
                multiline={true}
                maxLength={60}
            />
            <UserInputField
                label={"Target Date of Closure"}
                name={"TargetDateOfClosure1"}
                type={"date"}
                disabled={false}
                mandatory={false}
                value={formData}
                setValue={setFormData}
            />
            <UserInputField
                label={"Other Remarks"}
                name={"OtherRemarks"}
                type={"text"}
                disabled={false}
                mandatory={false}
                value={formData}
                setValue={setFormData}
                multiline={true}
                maxLength={60}
            />

            {/* <ChecKBoxLabel
                label={"Reject"}
                value={formData}
                changeValue={setFormData}
                fieldName={"Reject"}
            />

            <UserInputField
                label={"Reject Remarks"}
                name={"RejectRemarks"}
                type={"text"}
                disabled={false}
                mandatory={false}
                value={formData}
                setValue={setFormData}
                multiline={true}
                maxLength={60}
            /> */}

        </Box>
    )
}
