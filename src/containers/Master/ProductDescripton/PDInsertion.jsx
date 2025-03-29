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
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import PropTypes from "prop-types";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect } from "react";
import ConfirmationAlert from "../../../component/Alerts/ConfirmationAlert";
import ActionButton from "../../../component/Buttons/ActionButton";
import { useAlert } from "../../../component/Alerts/AlertContext";
import {
    primaryColor,
    secondaryColor,
    thirdColor,
} from "../../../config/config";
import UserInputField from "../../../component/InputFields/UserInputField";
import { masterApis } from "../../../service/Master/master";

// import MasterProductConfirmation from "./MasterProductConfirmation";
import { Info } from "@mui/icons-material";
import AutoSelect from "../../../component/AutoComplete/AutoSelect";
import UserAutoComplete from "../../../component/AutoComplete/UserAutoComplete";
import PDFieldAutoCompleteList from "./PDFieldAutoCompleteList";
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




export default function PDInsertion({
    formData,
    setFormData,
    numberList,
    setNumberList
}) {

    const userData = JSON.parse(localStorage.getItem("ClaymoreUserData"))[0];
    const {
        GetDatatype,
    } = masterApis();



    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>

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
                        // flexDirection: "column",
                        paddingTop: "10px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            padding: 1,
                            gap: "10px",
                            //   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",

                            // flexWrap: "wrap",
                            "@media (max-width: 768px)": {
                                gap: "10px", // Reduced width for small screens
                            },
                            "@media (max-width: 420px)": {
                                gap: "2px", // Reduced width for small screens
                            },
                        }}
                    >





                        <Box
                            sx={{
                                display: "flex",
                                // width: "100%",
                                flexDirection: "row",
                                justifyContent: "flex-start", // Changed from center to flex-start
                                padding: 1,
                                gap: "10px",
                                //   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",

                                flexWrap: "wrap",
                                "@media (max-width: 768px)": {
                                    gap: "10px", // Reduced width for small screens
                                },
                                "@media (max-width: 420px)": {
                                    gap: "2px", // Reduced width for small screens
                                },
                            }}
                        >


                            <AutoSelect
                                key={"tab"}
                                formData={formData}
                                setFormData={setFormData}
                                autoId={"tab"}
                                formDataName={`Tab_Name`}
                                formDataiId={"Tab"}
                                required={true}
                                label={"Tab"}
                                languageName={"english"}
                                ColumnSpan={0}
                                Menu={[{ "Id": 1, "Name": "EQUIPMENT INFORMATION" }, { "Id": 2, "Name": "SAFE WORKING LOAD AS PERLOADCHART" },]}

                            />
                            <UserInputField
                                label={"Field Name"}
                                name={"Name"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={formData}
                                setValue={setFormData}
                                maxLength={100}
                            />
                            <UserInputField
                                label={"Caption"}
                                name={"Caption"}
                                type={"text"}
                                disabled={false}
                                mandatory={true}
                                value={formData}
                                setValue={setFormData}
                                maxLength={100}
                            />
                            <UserInputField
                                        label={"Field Order"}
                                        name={"FieldOrder"}
                                        type={"number"}
                                        disabled={false}
                                        mandatory={true}
                                        value={formData}
                                        setValue={setFormData}
                                        // onBlurAction={() => handleMasterExist(2)}
                                        maxLength={100}
                                    />

                            <AutoSelect
                                key={"displayControlType"}
                                formData={formData}
                                setFormData={setFormData}
                                autoId={"displayControlType"}
                                formDataName={`DisplayControlType_Name`}
                                formDataiId={"DisplayControlType"}
                                required={true}
                                label={"Display ControlType"}
                                languageName={"english"}
                                ColumnSpan={0}
                                // disabled={disabledDetailed}
                                Menu={[{ "Id": 1, "Name": "text" }, { "Id": 2, "Name": "date" }, { "Id": 3, "Name": "dropdown" }, { "Id": 4, "Name": "number" }]}

                            />



                            {formData?.DisplayControlType === 3 ?(
                                <PDFieldAutoCompleteList
                                numberList={numberList}
                                setNumberList={setNumberList}
                                // detailPageId={detailPageId}
                                fieldId={formData.Id}
                              />

                            ):(<>

                                    <UserInputField
                                        label={"Default Value"}
                                        name={"DefaultValue"}
                                        type={
                                            formData?.DisplayControlType === 4
                                                ? "number"
                                                : formData?.DisplayControlType === 2
                                                    ? "date"
                                                    : formData?.DisplayControlType === 1
                                                        ? "text"
                                                        : null
                                        }
                                        disabled={false}
                                        mandatory={true}
                                        value={formData}
                                        setValue={setFormData}
                                        // onBlurAction={() => handleMasterExist(2)}
                                        maxLength={100}
                                    />

                                    <UserAutoComplete
                                        apiKey={GetDatatype}
                                        formData={formData}
                                        setFormData={setFormData}
                                        autoId={"dataType"}
                                        formDataName={`DataType_Name`}
                                        formDataiId={"DataType"}
                                        required={true}
                                        label={"Data Type"}
                                        User={userData?.UserId}
                                    />

                                    <UserInputField
                                        label={"MaxSize"}
                                        name={"MaxSize"}
                                        type={"number"}
                                        disabled={false}
                                        mandatory={true}
                                        value={formData}
                                        setValue={setFormData}
                                        maxLength={100}
                                    />



                                    <AutoSelect
                                        key={"Default"}
                                        formData={formData}
                                        setFormData={setFormData}
                                        autoId={"Default"}
                                        formDataName={`Default_Name`}
                                        formDataiId={"Default"}
                                        required={true}
                                        label={"Default"}
                                        languageName={"english"}
                                        ColumnSpan={0}
                                        // disabled={disabledDetailed}
                                        Menu={[{ "Id": true, "Name": "true" }, { "Id": false, "Name": "false" },]}

                                    />
                                    <AutoSelect
                                        key={"fieldType"}
                                        formData={formData}
                                        setFormData={setFormData}
                                        autoId={"fieldType"}
                                        formDataName={`FieldType_Name`}
                                        formDataiId={"FieldType"}
                                        required={true}
                                        label={"Field Type"}
                                        languageName={"english"}
                                        ColumnSpan={0}
                                        // disabled={disabledDetailed}
                                        Menu={[{ "Id": 1, "Name": "Main" }, { "Id": 2, "Name": "Body" },]}

                                    />

                                    <UserInputField
                                        label={"Minimum Value"}
                                        name={"MinimumValue"}
                                        type={"number"}
                                        disabled={false}
                                        mandatory={true}
                                        value={formData}
                                        setValue={setFormData}
                                        // onBlurAction={() => handleMasterExist(2)}
                                        maxLength={100}
                                    />
                                    <UserInputField
                                        label={"Maximum Value"}
                                        name={"MaximumValue"}
                                        type={"number"}
                                        disabled={false}
                                        mandatory={true}
                                        value={formData}
                                        setValue={setFormData}
                                        // onBlurAction={() => handleMasterExist(2)}
                                        maxLength={100}
                                    />

                                    <UserInputField
                                        label={"ToolTip"}
                                        name={"ToolTip"}
                                        type={"text"}
                                        disabled={false}
                                        mandatory={true}
                                        value={formData}
                                        setValue={setFormData}
                                        // onBlurAction={() => handleMasterExist(2)}
                                        maxLength={100}
                                    />
                                    

                                    <AutoSelect
                                        key={"Hidden"}
                                        formData={formData}
                                        setFormData={setFormData}
                                        autoId={"Hidden"}
                                        formDataName={`Hidden_Name`}
                                        formDataiId={"Hidden"}
                                        required={true}
                                        label={"Hidden"}
                                        languageName={"english"}
                                        ColumnSpan={0}
                                        // disabled={disabledDetailed}
                                        Menu={[{ "Id": true, "Name": "true" }, { "Id": false, "Name": "false" },]}

                                    />
                                    <AutoSelect
                                        key={"readOnly"}
                                        formData={formData}
                                        setFormData={setFormData}
                                        autoId={"readOnly"}
                                        formDataName={`ReadOnly_Name`}
                                        formDataiId={"ReadOnly"}
                                        required={true}
                                        label={"Read Only"}
                                        languageName={"english"}
                                        ColumnSpan={0}
                                        // disabled={disabledDetailed}
                                        Menu={[{ "Id": true, "Name": "true" }, { "Id": false, "Name": "false" },]}

                                    />
                                </>)

                            }




                        </Box>



                    </Box>
                </Box>
            </Box>



        </Box>
    );
}
