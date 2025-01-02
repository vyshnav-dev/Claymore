import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  ListSubheader,
  Paper,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { debounce } from "lodash";
import { stockCountApis } from "../../../service/Transaction/stockcount";
import ConfirmationAlert3Button from "../../Alerts/ConfirmationAlert3Button";
import { secondaryColor, thirdColor } from "../../../config/config";

export default function CloseStockHeaderEntityAutoComplete({
  apiKey,
  formData,
  setFormData,
  label,
  autoId,
  formDataName,
  formDataiId,
  required,
  disable,
  tagId,
  extraAction,
   tableBody,
   setTableBody
}) {
  const [iTypeF2, setiTypeF2] = useState(1);
  const [searchkey, setsearchkey] = useState("");
  const [Menu, setMenu] = useState([]);
  const [autoCompleteKey, setAutoCompleteKey] = useState(0);
  const focusedRef = useRef(false); // Use ref to track focus state
  const highlightRef = useRef(false); // Separate ref to track component focus state
  const { getentitysettings } = stockCountApis();
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [confirmData, setConfirmData] = useState({});
  const [stateData, setStateData] = useState({});

  const handleAutocompleteChange = (event, newValue) => {
    
    if (newValue && tableBody[0]?.Product) {
      setStateData(newValue)
      setConfirmData({
        message:
          "Do you want to clear all entered data and continue, or keep the data as is?",
        type: "warning",
      });
      setConfirmAlert(true)
    }else{
      handleDataChange(1,newValue)
    }
  };
  
  const handleDataChange = async (type,newValue) => {
    setTableBody(prevState => 
      prevState.map(item => {
        return {
          ...item,
          error: false
        };
      })
    )
    let updatedFormData = {
      ...formData,
      [formDataiId]: newValue ? newValue.Id : 0,
      [formDataName]: newValue ? newValue.Name : "",
      Warehouse: type !==2 ? formData["Warehouse"] :0,
      WarehouseName: type !==2 ? formData["Warehouse_Name"] : null,
    };

    if (newValue) {
      const response = await getentitysettings({ beId: newValue.Id });
      if (response?.status === "Success") {
        const entityDetails = JSON.parse(response.result);
        updatedFormData = { ...updatedFormData, ...entityDetails };
      }
    } else {
      updatedFormData = {
        ...updatedFormData,
        AmtDecimal: 1,
        BatchEnabled: false,
        BinEnabled: false,
        QtyDecimal: 1,
        SerialNoEnabled: false,
        WarehouseHeader: false,
      };
    }
    if(type === 2){
      extraAction()
    }

    if(type === 3 && tableBody?.length){
      setTableBody((prevTableBody) =>
        prevTableBody.map((item) => ({
          ...item,
          DisableBatch:!formData?.BatchEnabled ? true : item?.DisableBatch, // Set DisableBatch to true
          DisableSerialNo: !formData?.SerialNoEnabled ? true : item?.DisableSerialNo, // Set DisableSerialNo to true
        }))
      );
    }
    
    handleConfrimClose()
    setStateData({})
    setFormData(updatedFormData);
    setiTypeF2(1);
  };

  const debouncedFetchOptions = debounce(async (searchKey) => {
    if (!focusedRef.current) return;

    try {
      const response = await apiKey({
        searchString: searchKey,
        type: iTypeF2,
        tagId,
      });
      const results = JSON.parse(response?.result);
      setMenu(results || []);
    } catch {
      setMenu([]);
    }
  }, 300);

  useEffect(() => {
    if (focusedRef.current) {
      debouncedFetchOptions(searchkey);
    }
  }, [searchkey, iTypeF2]);

  const handleFocus = () => {
    focusedRef.current = true;
    debouncedFetchOptions(searchkey);
  };

  const handleBlur = () => {
    focusedRef.current = false;

    // Only clear if both searchkey and formData[formDataName] are empty
    if (!searchkey && !formData[formDataName]) {
      const existsInMenu = Menu.some((option) => option.Name === searchkey);
      const existingFormValue = formData[formDataName] || "";

      if (!existsInMenu && searchkey !== existingFormValue) {
        setFormData({
          ...formData,
          [formDataName]: "",
          [formDataiId]: 0,
        });
        setsearchkey("");
        setAutoCompleteKey((prevKey) => prevKey + 1);
      }
    }
  };

  const handleInputChange = (event, newInputValue) =>
    setsearchkey(newInputValue);

  const handleConfrimClose = (value) => {
   if(value === 1){
    handleDataChange(3,stateData)
   }
    setConfirmAlert(false);
    setConfirmData({});
  };

  const CustomListBox = React.forwardRef((props, ref) => (
    <ul style={{ paddingTop: 0, scrollbarWidth: "thin" }} ref={ref} {...props}>
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
          <Typography style={{ fontSize: "0.8rem" }}>Name</Typography>
          <Typography style={{ fontSize: "0.8rem" }}>Code</Typography>
        </div>
      </ListSubheader>
      {props.children}
    </ul>
  ));

  return (
    <>
      <Autocomplete
        key={`${label}_${autoCompleteKey}`}
        size="small"
        PaperComponent={({ children }) => (
          <Paper style={{ minWidth: "150px", maxWidth: "300px" }}>
            {children}
          </Paper>
        )}
        clearIcon={searchkey ? undefined : null}
        disabled={disable}
        // freeSolo
        id={autoId}
        options={Menu}
        onFocus={handleFocus} // Set focus state and fetch options when focused
        onBlur={handleBlur} // Reset focus state on blur
        getOptionLabel={(option) =>
          option?.Name || formData[formDataName] || ""
        }
        value={formData[formDataName] ?? ""}
        onChange={handleAutocompleteChange}
        filterOptions={(options, { inputValue }) => {
          return options.filter(
            (option) =>
              option?.Name?.toLowerCase()?.includes(
                inputValue?.toLowerCase()
              ) ||
              option?.Code?.toLowerCase()?.includes(inputValue?.toLowerCase())
          );
        }}
        onHighlightChange={(event, option) => {
          if (option !== highlightRef.current) {
            highlightRef.current = option; // Update ref without re-rendering
          }
        }}
        onInputChange={handleInputChange}
        renderOption={(props, option) => (
          <li {...props} key={option.Id}>
            <div
              className=""
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
            label={label}
            {...params}
            inputProps={{
              ...params.inputProps,
              autoComplete: "off", // disable autocomplete and autofill
              style: {
                borderColor: "transparent",
                borderStyle: "solid",
                fontSize: "12px",
                height: "18px",
                padding: "0px 25px 0px 10px",
                margin: 0,
                color: "inherit",
              },
              onKeyDown: (event, newValue) => {
                if (event.key === "F2") {
                  const updatedFormData = {
                    ...formData,
                    [formDataName]: newValue ? newValue.Name : "",
                    [formDataiId]: newValue ? newValue.Id : 0,
                  };
                  setFormData(updatedFormData);
                  setiTypeF2((prevType) => (prevType === 1 ? 2 : 1));
                  setsearchkey("");
                  event.preventDefault();
                }
                if (event.key === "Tab" || event.key === "Enter") {
                  // Select the currently highlighted option
                  if (highlightRef.current) {
                    const newValue = highlightRef.current;

                    // Set the form data directly with the highlighted option
                    setFormData({
                      ...formData,
                      [formDataName]: newValue?.Name,
                      [formDataiId]: newValue?.Id,
                    });

                    // Update the value directly
                    setsearchkey(newValue?.Name || "");
                  }
                  setTimeout(() => {
                    event.target.blur(); // Move focus to the next field
                  }, 0);
                  event.preventDefault();
                }
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: "14px",
                padding: "0 0px",
                zIndex: 1,
              },
            }}
            sx={{
              paddingTop: "16px",
              width: 250, // Default width
              "@media (max-width: 360px)": {
                width: 220, // Reduced width for small screens
              },
              "& .MuiOutlinedInput-input": {
                padding: "8px 14px",
                transform: "translate(-1px, 0px) scale(1)",
              },
              "& .MuiInputBase-input": {
                fontSize: "0.75rem",
              },
              "& .MuiInputLabel-outlined": {
                transform: "translate(14px, 22px) scale(0.85)",
              },
              "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                transform: "translate(14px, 7px) scale(0.75)",
                padding: "0px 2px",
                color: "inherit",
              },
              "& .MuiOutlinedInput-root": {
                height: 30, // Adjust the height of the input area
                "& fieldset": {
                  borderColor: `"#ddd"}`,
                },
                "&:hover fieldset": {
                  borderColor: "currentColor", // Keeps the border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "currentColor", // Keeps the current border color
                },
              },
              "& .MuiInputLabel-root": {
                color: "inherit",
              },
            }}
          />
        )}
        ListboxComponent={CustomListBox}
        isOptionEqualToValue={(option, value) => option.Id === value.Id} // Add this line
      />
      <ConfirmationAlert3Button
        handleClose={handleConfrimClose}
        open={confirmAlert}
        data={confirmData}
        submite={()=>handleDataChange(2,stateData)}
      />
    </>
  );
}
