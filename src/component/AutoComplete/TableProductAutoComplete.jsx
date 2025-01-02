import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  ListSubheader,
  Paper,
} from "@mui/material";
import { debounce } from "lodash";
import { secondaryColor, thirdColor } from "../../config/config";
import { useAlert } from "../Alerts/AlertContext";
import { stockCountApis } from "../../service/Transaction/stockcount";

export default function TableProductAutoComplete({
  apiKey,
  formData,
  setFormData,
  autoId,
  formDataName,
  formDataiId,
  required,
  disable,
  Index,
  beId,
  width,
  batch,
  setBatch,
  serial, setSerial
}) {
  const [iTypeF2, setiTypeF2] = useState(1);
  const [inputValue, setInputValue] = useState(""); // Track displayed input text
  const [Menu, setMenu] = useState([]);
  const [autoCompleteKey, setAutoCompleteKey] = useState(0);
  const { getproductproperties } = stockCountApis();
  const focusedRef = useRef(false);
  const highlightRef = useRef(false);
  const { showAlert } = useAlert();

  const handleAutocompleteChange = (event, newValue) => {
    handleDataChange(newValue);
  };

  const handleDataChange = async (newValue) => {
    let updatedFormData = [...formData];
    updatedFormData[Index][formDataiId] = newValue ? newValue.Id : 0;
    updatedFormData[Index][formDataName] = newValue ? newValue.Name : "";
    updatedFormData[Index]["Product_Code"] = newValue ? newValue.Code : "";
    updatedFormData[Index].error = false

    if (newValue) {
      const response = await getproductproperties({ productId: newValue.Id });
      if (response?.status === "Success") {
        const entityDetails = JSON.parse(response.result);
        updatedFormData[Index]["DisableBatch"] = entityDetails
          ? entityDetails?.DisableBatch
          : false;
        updatedFormData[Index]["DisableSerialNo"] = entityDetails
          ? entityDetails?.DisableSerialNo
          : false;
   
      }
    } else {
      updatedFormData[Index]["DisableBatch"] = false;
      updatedFormData[Index]["DisableSerialNo"] = false; 
    }
    updatedFormData[Index]["Unit"] = 0;
    updatedFormData[Index]["Unit_Name"] = "";
    updatedFormData[Index]["Qty"] = 0;
    const batchExist = batch.filter(
      (row) => row.TransDtId !== formData[Index].TransDtId
    );
    setBatch(batchExist);
    updatedFormData[Index]["Qty"] = 0;

    const serialExist = serial.filter(
      (row) => row.TransDtId !== formData[Index].TransDtId
    );
    setSerial(serialExist);  

    setFormData(updatedFormData);
    setInputValue(newValue ? newValue.Name : ""); // Set displayed input
    setiTypeF2(1);
  };

  const fetchOptions = async (searchKey) => {
    if (!focusedRef.current) return;
    if(!beId){
      setMenu([]);
      const updatedFormData = [...formData];
      updatedFormData[Index][formDataiId] = 0;
      updatedFormData[Index][formDataName] = "";
      updatedFormData[Index]["ProductCode"] = ""; 
      setFormData(updatedFormData);
      setInputValue(""); // Set displayed input
      showAlert("info", `Please Provide Entity`)
      return
    }
    try {
      const response = await apiKey({
        searchString: searchKey,
        type: iTypeF2,
        beId,
      });
      const results = JSON.parse(response?.result);
      setMenu(results || []);
    } catch (error) {
      setMenu([]);
    }
  };

  const debouncedFetchOptions = useCallback(debounce(fetchOptions, 300), [
    beId,
    iTypeF2,
  ]);

  useEffect(() => {
    if (focusedRef.current) {
      debouncedFetchOptions(inputValue);
    }
  }, [inputValue, debouncedFetchOptions]);

  const handleFocus = () => {
    focusedRef.current = true;
    fetchOptions(inputValue);
  };

  const handleBlur = () => {
    focusedRef.current = false;
    const existsInMenu = Menu.some((option) => option.Name === inputValue);
    const existingFormValue = formData[Index][formDataName] || "";

    if (!existsInMenu && inputValue !== existingFormValue) {
      const updatedFormData = [...formData];
      updatedFormData[Index][formDataiId] = 0;
      updatedFormData[Index][formDataName] = "";
      setFormData(updatedFormData);
      setInputValue(""); // Clear input if no match
      setAutoCompleteKey((prevKey) => prevKey + 1);
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue); // Update displayed input directly
    debouncedFetchOptions(newInputValue);
  };

  const CustomListBox = React.forwardRef((props, ref) => {
    const { children, ...other } = props;
    return (
      <ul
        style={{ paddingTop: 0, scrollbarWidth: "thin" }}
        ref={ref}
        {...other}
      >
        <ListSubheader
          style={{
            backgroundColor: secondaryColor,
            padding: "5px",
            color: thirdColor,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography style={{ marginRight: "auto", fontSize: "0.8rem" }}>
              Name
            </Typography>
            <Typography style={{ marginLeft: "auto", fontSize: "0.8rem" }}>
              Code
            </Typography>
          </div>
        </ListSubheader>
        {children}
      </ul>
    );
  });

  return (
    <Autocomplete
      key={`${autoCompleteKey}`}
      size="small"
      PaperComponent={({ children }) => (
        <Paper style={{ minWidth: "150px", maxWidth: "300px" }}>
          {children}
        </Paper>
      )}
      disabled={disable}
      // freeSolo
      id={autoId}
      options={Menu}
      inputValue={inputValue} // Control displayed input text
      onFocus={handleFocus}
      onBlur={handleBlur}
      value={formData[Index][formDataName] ?? ""}
      getOptionLabel={(option) =>
        option?.Name || formData[Index][formDataName] || ""
      }
      onChange={handleAutocompleteChange}
      filterOptions={(options, { inputValue }) =>
        options.filter(
          (option) =>
            option?.Name?.toLowerCase()?.includes(inputValue?.toLowerCase()) ||
            option?.Code?.toLowerCase()?.includes(inputValue?.toLowerCase())
        )
      }
      onInputChange={handleInputChange}
      renderOption={(props, option) => (
        <li {...props} key={option.Id}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography style={{ marginRight: "auto", fontSize: "12px" }}>
              {option.Name}
            </Typography>
            <Typography style={{ marginLeft: "auto", fontSize: "12px" }}>
              {option?.Code}
            </Typography>
          </div>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          required={required}
          {...params}
          inputProps={{
            ...params.inputProps,
            autoComplete: "off",
            style: {
              fontSize: "12px",
              height: "18px",
              padding: "0px 25px 0px 10px",
            },
          }}
          sx={{ width:"100%"}}
        />
      )}
      ListboxComponent={CustomListBox}
      isOptionEqualToValue={(option, value) => option.Id === value.Id}
    />
  );
}
