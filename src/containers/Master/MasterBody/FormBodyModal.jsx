import {
    Box,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import UserInputField from "../../../component/InputFields/UserInputField";
import NormalButton from "../../../component/Buttons/NormalButton";
import { useAlert } from "../../../component/Alerts/AlertContext";
import UserAutoComplete from "../../../component/AutoComplete/UserAutoComplete";

export default function FormBodyModal({ handleCloseModal, upsertSubcategorytmaster, getcategorylist, getproductlist, formData, setFormData,id,getSubCategorydetails }) {

    const { showAlert } = useAlert();

    const handleEdit = async () => {
        try {
          if (id == 0) {
            setFormData({
              id: 0,
              description: null,
              code: null,
              category: 0,
              Product_Name: null,
              CategoryName: null,
              Product: null
            })
          } else {
            const response = await getSubCategorydetails({
              Id: id,
            });
            if (response?.status === "Success") {
              const myObject = JSON.parse(response?.result);
              if (myObject) {
                setFormData({
                  ...myObject[0],
                });
              }
            }
          }
        } catch (error) {
          throw error;
        }
      }
    
      useEffect(() => {
        handleEdit();
      },[id])
    
    const handleSave = async () => {
      const update = {...formData}
      setFormData[update]
      const emptyFields = [];
      if (!formData.Product) emptyFields.push("Product");
      if (!formData.Category) emptyFields.push("Category");
      if (!formData.Name) emptyFields.push("Description)");
      if (!formData.Code) emptyFields.push("Sl No");
      if (emptyFields.length > 0) {
        showAlert('info', `Please Provide ${emptyFields[0]}`);
        return;
      }
      const response = await upsertSubcategorytmaster(formData)
      if(response?.status === "Success" ){
        handleCloseModal()
        setFormData({})
        showAlert('success', `Description Added Successfully`);
        return;
      }

    };
    return (
        <>
            <DialogContent>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <UserAutoComplete
                        apiKey={getproductlist}
                        formData={formData}
                        setFormData={setFormData}
                        label={"Product"}
                        autoId={"product"}
                        required={true}
                        formDataName={"Product_Name"}
                        formDataiId={"Product"}
                    />
                    <UserAutoComplete
                        apiKey={getcategorylist}
                        formData={formData}
                        setFormData={setFormData}
                        label={"Category"}
                        autoId={"category"}
                        required={true}
                        formDataName={"CategoryName"}
                        formDataiId={"Category"}
                        Product={formData?.Product}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <UserInputField
                        label={"Sl No"}
                        name={"Code"}
                        type={"text"}
                        disabled={false}
                        mandatory={true}
                        value={formData}
                        setValue={setFormData}
                        //   onBlurAction={() => handleMasterExist(2)}
                        maxLength={100}
                    />
                    <UserInputField
                        label={"Description"}
                        name={"Name"}
                        type={"text"}
                        disabled={false}
                        mandatory={true}
                        value={formData}
                        setValue={setFormData}
                        maxLength={100}
                        multiline={true}
                    />
                </Box>




            </DialogContent>
            <DialogActions>
                <NormalButton action={handleCloseModal} label="Cancel" />
                <NormalButton action={handleSave} label="Ok" />
            </DialogActions>

        </>
    );
}
