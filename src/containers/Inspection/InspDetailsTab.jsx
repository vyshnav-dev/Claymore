import { Box } from '@mui/material'
import React from 'react'
import UserInputField from '../../component/InputFields/UserInputField'

export default function InspDetailsTab({mainDetails,setMainDetails}) {
  return (
    
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
            label={"Date of Inspection"}
            name={"doi"}
            type={"date"}
            disabled={false}
            mandatory={true}
            value={mainDetails}
            setValue={setMainDetails}
            // onBlurAction={() => handleMasterExist(2)}
            maxLength={100}
        />
        <UserInputField
            label={"Previous Inspection Report"}
            name={"iReport"}
            type={"text"}
            disabled={false}
            mandatory={true}
            value={mainDetails}
            setValue={setMainDetails}
            // onBlurAction={() => handleMasterExist(2)}
            maxLength={100}
        />
        <UserInputField
            label={"Test Method"}
            name={"testMethod"}
            type={"text"}
            disabled={false}
            mandatory={true}
            value={mainDetails}
            setValue={setMainDetails}
            // onBlurAction={() => handleMasterExist(2)}
            maxLength={100}
        />
        <UserInputField
            label={"Expiry Date"}
            name={"ExpiryDate"}
            type={"date"}
            disabled={false}
            mandatory={true}
            value={mainDetails}
            setValue={setMainDetails}
            // onBlurAction={() => handleMasterExist(2)}
            maxLength={100}
        />
        <UserInputField
            label={"Last Proof Load Test"}
            name={"LoadTest"}
            type={"text"}
            disabled={false}
            mandatory={true}
            value={mainDetails}
            setValue={setMainDetails}
            // onBlurAction={() => handleMasterExist(2)}
            maxLength={100}
        />
        <UserInputField
            label={"Calibrated Test Equipment"}
            name={"TestEquipment"}
            type={"text"}
            disabled={false}
            mandatory={true}
            value={mainDetails}
            setValue={setMainDetails}
            // onBlurAction={() => handleMasterExist(2)}
            maxLength={100}
        />
        <UserInputField
            label={"Client Test Equipment"}
            name={"ClientTestEquipment"}
            type={"text"}
            disabled={false}
            mandatory={true}
            value={mainDetails}
            setValue={setMainDetails}
            // onBlurAction={() => handleMasterExist(2)}
            maxLength={100}
        />
       
        

       

        
    </Box>
  )
}
