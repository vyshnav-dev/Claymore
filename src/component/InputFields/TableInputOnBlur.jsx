import { TextField, useTheme } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/system";

const CustomTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    "& textarea": {
      "&::-webkit-scrollbar": {
        width: "6px", // Adjust the width as needed
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0, 0, 0, 0.2)", // Adjust the color as needed
        borderRadius: "3px", // Adjust the border radius as needed
        cursor: "pointer",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "rgba(0, 0, 0, 0.1)", // Adjust the track color as needed
      },
      // Dark mode specific styles
      '&[data-mode="dark"]::-webkit-scrollbar-thumb': {
        backgroundColor: "rgba(255, 255, 255, 0.2)", // Adjust the color as needed
      },
      '&[data-mode="dark"]::-webkit-scrollbar-track': {
        backgroundColor: "rgba(255, 255, 255, 0.1)", // Adjust the track color as needed
      },
    },
  },
});

export default function TableInputeOnBlur({
  name,
  type,
  disabled,
  value,
  setValue,
  width,
  multiline,
  mandatory,
  direction,
  maxLength,
  onBlurAction,
  readOnly,
  index,
  tabAction,
  decimalLength
}) {
  const [tabPressed, setTabPressed] = useState(false);

  const handleChange = (event) => {
    if(readOnly){
      return
    }
    const inputValue = event.target.value;
 
    if (type === "number") {
      // Regular expression for numbers with limited decimal places
      const decimalRegex = new RegExp(`^\\d*\\.?\\d{0,${decimalLength || 0}}$`);
  
      // Prevent non-numeric characters, scientific notation, and limit decimal places
      if (!decimalRegex.test(inputValue) || inputValue.includes('e') || inputValue.includes('+') || inputValue.includes('-')) {
        return;
      }
    }

    const update = [...value];
    update[index][name] =
      type === "number" && inputValue !== "" ? Number(inputValue) : inputValue;
    setValue(update);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      setTabPressed(true); // Set flag if Tab key is pressed
      if(typeof tabAction === "function"){
        tabAction()
      }
     
    }
  };

  const handleBlur = (event) => {
    handleChange(event)
    if (tabPressed) {
      setTabPressed(false); // Reset flag after handling
      if (typeof onBlurAction === "function") {
        onBlurAction();
      }
    }
  };

  return (
    <CustomTextField
      size="small"
      id="search1"
      value={
        (type === "date" && !value[index][name]) ||
        (type === "time" && !value[index][name]) ||
        (type === "datetime-local" && !value[index][name])
          ? " "
          : value[index][name] || ""
      }
      type={type}
      onMouseLeave={value[index][name] ? onBlurAction : null} // Trigger on mouse leave
      onBlur={handleBlur} // Trigger only if Tab key was pressed
      onKeyDown={handleKeyDown} // Detect if Tab is pressed
      required={mandatory}
      multiline={multiline}
      rows={multiline ? 3 : null}
      autoComplete="off"
      disabled={disabled}
      
      InputProps={{
        inputProps: {
          maxLength: maxLength,
          autoComplete: `off`,
          ...(type === "date"
            ? {
                onClick: (e) => e.target.showPicker?.(),
              }
            : type === "datetime-local"
            ? {
                step: 1, // For precise datetime input including seconds
                onKeyDown: (e) => {
                  // Disable manual typing for datetime fields
                  if (e.key !== "Tab") e.preventDefault();
                },
                onClick: (e) => e.target.showPicker?.(),
                onFocus: (e) => e.target.showPicker?.(),
              }
            : {}),
          style: {
            direction: direction ? "rtl" : "ltr", // Default to LTR if direction is not found
          },
        },
        sx: {
          '& input[type="date"]::-webkit-calendar-picker-indicator': {
            filter: "invert(0)",
          },
          '& input[type="time"]::-webkit-calendar-picker-indicator': {
            filter: "invert(0)", // Ensures visibility in dark mode
          },
          '& input[type="datetime-local"]::-webkit-calendar-picker-indicator': {
            filter: "invert(0)",
          },
        },
      }}
      InputLabelProps={{
        style: {
          direction: direction ? "rtl" : "ltr", // Apply RTL to the label
        },
      }}
      sx={{
        width: "100%", // Adjust the width as needed
        
        "& .MuiInputBase-root": {
          ...(multiline ? {} : { height: 30 }), // Adjust the height of the input area if not multiline
          "& textarea": {
            "&::-webkit-scrollbar": {
              width: "6px", // Adjust the width as needed
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.2)", // Adjust the color as needed
              borderRadius: "3px", // Adjust the border radius as needed
              cursor: "pointer",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(0, 0, 0, 0.1)", // Adjust the track color as needed
            },
          },
        },
        "& .MuiInputLabel-root": {
          fontSize: "14px",
          transform: "translate(10px, 5px) scale(0.9)", // Adjust label position when not focused
          color: "inherit",
        },
        "& .MuiInputLabel-shrink": {
          transform: "translate(14px, -9px) scale(0.75)", // Adjust label position when focused
        },
        "& .MuiInputBase-input": {
          fontSize: "0.75rem", // Adjust the font size of the input text
          color: "inherit",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "currentColor", // Keeps the current border color
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "currentColor", // Optional: Keeps the border color on hover
        },
        "& .MuiFormLabel-root.Mui-focused": {
          color: "inherit", // Ensure the label color when focused
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: `${"#ddd"}`,
          },
          "&:hover fieldset": {
            borderColor: "currentColor", // Keeps the border color on hover
          },
          "&.Mui-focused fieldset": {
            borderColor: "currentColor", // Keeps the current border color
          },
        },
      }}
    />
  );
}
