import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  ListSubheader,
  Paper,
} from "@mui/material";
import { useRef } from "react";
import { secondaryColor, thirdColor } from "../../config/config";

const TagAutoSelect = ({
  formData,
  setFormData,
  label,
  autoId,
  formDataName,
  formDataiId,
  required,
  disabled,
  languageName,
  width = 250,
  ColumnSpan = 0,
  Menu=[]
}) => {
  const [searchkey, setsearchkey] = useState("");
  const [autoCompleteKey, setAutoCompleteKey] = useState(0);

    const focusedRef = useRef(false); // Use ref to track focus state
    const highlightRef = useRef(false); // Separate ref to track component focus state
      

  

  // Effect to set the formDataName based on formDataiId
  useEffect(() => {
    if (formData[formDataiId]) {
      // Find the corresponding Name from Menu using formDataiId
      const selectedOption = Menu?.find((item) => item.Id === formData[formDataiId]);

      // Set the formDataName if the selected option is found
      if (selectedOption) {
        setFormData({
          ...formData,
          [formDataName]: selectedOption.Name,  // Set the Name corresponding to the Id
        });
      }
    }
  }, [formData[formDataiId]]);

  const handleAutocompleteChange = (event, newValue) => {
    if (disabled) {
      return;
    }
    const updatedFormData = {
      ...formData,
      [formDataName]: newValue ? newValue?.Name : "",
      [formDataiId]: newValue ? newValue?.Id : 0,
    };
    setFormData(updatedFormData); // This will now update the parent's state
  
  };


 



  const handleBlur = () => {
    focusedRef.current = false; // Reset focus state when the component loses focus
    // Check for the existence in Menu or the existing formData value
    const existsInMenu = Menu.some((option) => option.Name === searchkey);
    const existingFormValue = formData[formDataName] || "";

    if (!existsInMenu && searchkey !== existingFormValue) { 
      setFormData({
        ...formData,
        [formDataName]: "",
        [formDataiId]: 0,
      });
      setsearchkey("");
      setAutoCompleteKey(prevKey => prevKey + 1);
    }
  };


  const handleInputChange = (event, newInputValue) => {
    setsearchkey(newInputValue);
  };

  const CustomListBox = React.forwardRef((props, ref) => {
    const { children, ...other } = props;
    return (
      <ul style={{ paddingTop: 0, scrollbarWidth: "thin", }} ref={ref} {...other}>
        <ListSubheader
          style={{
            backgroundColor:secondaryColor,
            padding: "5px",
            color:thirdColor
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography style={{ marginRight: "auto",fontSize:"0.8rem" }}>Name</Typography>
            <Typography style={{ marginLeft: "auto", fontSize:"0.8rem"  }}>Code</Typography>
          </div>
        </ListSubheader>
        {children}
      </ul>
    );
  });


  const calculateLabelPosition = (width, isShrink) => {
    if (width <= 300) {
      return isShrink ? Math.max(0, width * 0.2) : 15; //30 Smaller fields have smaller translateX values
    } else if (width <= 400) {
      return isShrink ? Math.max(0, width * 0.21) : 20; //30 Mid-size fields
    } else if (width <= 500) {
      return isShrink ? Math.max(0, width * 0.22) : 25; //40 Mid-size fields
    } else if (width <= 600) {
      return isShrink ? Math.max(0, width * 0.23) : 40; //50 Mid-size fields
    } else if (width <= 700) {
      return isShrink ? Math.max(0, width * 0.23) : 50; //60 Mid-size fields
    } else if (width <= 800) {
      return isShrink ? Math.max(0, width * 0.233) : 60; //70 Mid-size fields
    } else if (width > 800) {
      return isShrink ? Math.max(0, width * 0.235) : 70; //80 Mid-size fields
    } else {
      return isShrink ? 80 : 65; // Larger fields need larger translateX values
    }
  };
  const isLatinScript = (text) => {
    const latinRegex = /^[\u0000-\u007F\u00C0-\u024F\u1E00-\u1EFF]*$/;
    return latinRegex.test(text); // Returns true if the text is Latin-based (including special chars)
  };

  const filterOptions = (options, { inputValue }) => {
    return options.filter((option) => {
      const name = option?.Name || '';
      const code = option?.Code || '';
  
      // Use toLowerCase() only for Latin script inputs
      const normalizedInput = isLatinScript(inputValue)
        ? inputValue.toLowerCase()
        : inputValue;
  
      const normalizedName = isLatinScript(name) ? name.toLowerCase() : name;
      const normalizedCode = isLatinScript(code) ? code.toLowerCase() : code;
   
      
      return (
        normalizedName.includes(normalizedInput) ||
        (normalizedCode && normalizedCode.includes(normalizedInput))
      );
    });
  };
  
  return (
    <Autocomplete
      key={`${label}_${autoCompleteKey}`}
      disabled={disabled}
      size="small"
      PaperComponent={({ children }) => (
        <Paper style={{ minWidth: "150px", maxWidth: "300px" }}>
          {children}
        </Paper>
      )}
      sx={{
        width:width + ColumnSpan * 50,
      }}
      //freeSolo
      id={autoId}
      options={Menu}
      getOptionLabel={(option) => option?.Name || formData[formDataName] ||""}
      value={formData[formDataName]??""}
      onChange={handleAutocompleteChange}
      //openOnFocus={true} // Automatically open dropdown on focus
      onBlur={handleBlur} 
      filterOptions={filterOptions}
      disableClearable={!formData[formDataiId]} 
      onInputChange={handleInputChange}
      onHighlightChange={(event, option) => {
        if (option !== highlightRef.current) {
          highlightRef.current = option; // Update ref without re-rendering
        }
      }}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props; // Extract key and spread other props
        return (
        <li key={key} {...otherProps}>
          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              flexDirection: "row", // Swap direction for RTL
              textAlign: "left",
            }}
          >
            <Typography
              style={{
                marginRight:  "auto",
                marginLeft:  0,
                textAlign: "left",
                fontSize: "12px",
                color:"inherit",
              }}
            >
              {option?.Name}
            </Typography>
            {option?.Code && (
              <Typography
                style={{
                  marginLeft: "auto",
                  marginRight:  0,
                  textAlign: "right",
                  fontSize: "12px",
                  color:"inherit",
                }}
              >
                {option?.Code}
              </Typography>
            )}
          </div>
        </li>
      )}}
      renderInput={(params) => (
        <TextField
          required={required}
          label={label}
          {...params}
          disabled={disabled}
          inputProps={{
            ...params.inputProps,
            autoComplete: "off", // disable autocomplete and autofill
            // readOnly: !!formData[formDataiId],//newly added to avoid overflow when a selection and try to type after that
            style: {
              borderColor: "transparent",
              borderStyle: "solid",
              fontSize: "12px",
              height: "18px",
              padding:"0px 10px 0px 10px",
              margin: 0,
              color:"inherit",
            },
            inputProps: {
              style: { // Default to LTR if direction is not found
                fontFamily: "inherit", // Default to inherit if fontFamily is not found
              },
            },
            onKeyDown: (event) => {
              if (event.key === "F2") {
                const updatedFormData = {
                  ...formData,
                  [formDataName]: "",
                  [formDataiId]:0,
                };
                setFormData(updatedFormData);

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
            sx: {
              textAlign: "left",
              right: "auto",
            },
          }}
          sx={{
            paddingTop: "16px",
            minWidth: width + ColumnSpan * 50,
            // "@media (max-width: 360px)": {
            //   width: 220, // Reduced width for small screens
            // },
            "& .MuiOutlinedInput-input": {
              padding: "2px 2px ",
              transform: "translate(-1px, 0px) scale(1)",
              textAlign:  "left",
            },
            "& .MuiInputBase-input": {
              fontSize: "0.75rem",
            },
            "& .MuiInputLabel-outlined": {
              transform: "translate(14px, 22px) scale(0.85)",
            },
            "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
              // transform: "translate(14px, 7px) scale(0.75)",
              transform:"translate(14px, 7px) scale(0.75)", // Adjust label position when focused
              padding: "0px 2px",
              color:"inherit",
            },
            "& .MuiOutlinedInput-root": {
              height: 30, // Adjust the height of the input area
              display: "flex",
              flexDirection:"row",
              "& .MuiAutocomplete-endAdornment": {
                right:  0, // Position icons on the left in RTL
                left: "auto", // Swap the position of the icons
              },
              "& fieldset": {
                borderColor: `${
                  "#ddd"
                }`,
                textAlign:"left",
              },
              "&:hover fieldset": {
                borderColor:"currentColor", // Keeps the border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor:"currentColor", // Keeps the current border color
              },
              "& legend": {
                width: "max-content", // Let legend adjust width in RTL
              },

              "& .MuiSvgIcon-root": {
                marginRight: 0,
                marginLeft: "auto", // Adjust icon spacing
              },
            },
            "& .MuiInputLabel-root": {
              color:"inherit",
              fontSize: "14px",
              transform: null, // Adjust label position when not focused
            },
          }}
        />
      )}
      ListboxComponent={CustomListBox}
    />
  );
};

export default TagAutoSelect;

