import {
    Box,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
//   import { tagSettingsApis } from "../../../services/settings/TagSettings/tagSettings";
//   import TagSettingsMenuInput from "../../../components/Settings/TagSettings/TagSettingsMenuInput";
import UserInputField from "../../../component/InputFields/UserInputField";
import NormalButton from "../../../component/Buttons/NormalButton";
import { useAlert } from "../../../component/Alerts/AlertContext";
import UserAutoComplete from "../../../component/AutoComplete/UserAutoComplete";

export default function FormBodyModal({ handleCloseModal, selected, submitAction, treeRefresh }) {
    const [formData, setFormData] = useState({
        id: 0,
        name: null,
        caption: null,
        moduleId: 1,
        menuIndex: 0,
        shortcutKey: null,
        description: null,
        toolTip: null,
        isGroup: true,
        parentId: selected,
        accessibilityLevel: 0,
        iconPath: null,
        url: null,
        typeId: 1,
        externalLink: null,
        screenTypeId: 1,
    });
    const { showAlert } = useAlert();
    // const {upsertmenu} = tagSettingsApis()

    // const handleSave = async () => {
    //   const update = {...formData}
    //   update.caption = formData.name
    //   setFormData[update]
    //   const emptyFields = [];
    //   if (!formData.name) emptyFields.push("name");
    //   if (emptyFields.length > 0) {
    //     showAlert('info', `Please Provide ${emptyFields[0]}`);
    //     return;
    //   }
    //   const response = await upsertmenu(formData)
    //   if(response?.status === "Success" ){
    //     submitAction()
    //     treeRefresh()
    //     handleCloseModal()
    //     showAlert('success', `Menu Added Successfully`);
    //     return;
    //   }

    // };
    return (
        <>
            <DialogContent>
                <Box sx={{ display: 'flex',gap:2 }}>
                    <UserAutoComplete
                        //   apiKey={gettaglist}
                        formData={formData}
                        setFormData={setFormData}
                        label={"Product"}
                        autoId={"product"}
                        required={true}
                        formDataName={"Product_Name"}
                        formDataiId={"Product"}
                        tagId={12}
                    />
                    <UserAutoComplete
                        //   apiKey={gettaglist}
                        formData={formData}
                        setFormData={setFormData}
                        label={"Category"}
                        autoId={"category"}
                        required={true}
                        formDataName={"Category_Name"}
                        formDataiId={"Category"}
                        tagId={12}
                    />
                </Box>
                <Box sx={{ display: 'flex',gap:2 }}>
                    <UserInputField
                        label={"Sl No"}
                        name={"Name"}
                        type={"number"}
                        disabled={false}
                        mandatory={true}
                        value={formData}
                        setValue={setFormData}
                        //   onBlurAction={() => handleMasterExist(2)}
                        maxLength={100}
                    />
                    <UserInputField
                        label={"Description"}
                        name={"Name1"}
                        type={"text"}
                        disabled={false}
                        mandatory={true}
                        value={formData}
                        setValue={setFormData}
                        //   onBlurAction={() => handleMasterExist(2)}
                        maxLength={100}
                        multiline={true}
                    />
                </Box>




            </DialogContent>
            <DialogActions>
                <NormalButton action={handleCloseModal} label="Cancel" />
                <NormalButton label="Ok" />
            </DialogActions>

        </>
    );
}
