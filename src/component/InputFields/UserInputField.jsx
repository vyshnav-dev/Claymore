import { TextField, Tooltip, useTheme } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/system";
import { validateInput } from "./ValidateInput";
import { useAlert } from "../Alerts/AlertContext";

const CustomTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    '& textarea': {
      '&::-webkit-scrollbar': {
        width: '6px', // Adjust the width as needed
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust the color as needed
        borderRadius: '3px', // Adjust the border radius as needed
        cursor: 'pointer',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Adjust the track color as needed
      },
      // Dark mode specific styles
      '&[data-mode="dark"]::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Adjust the color as needed
      },
      '&[data-mode="dark"]::-webkit-scrollbar-track': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Adjust the track color as needed
      },
    },
  },
});

const errorMessages = {
  minimumValue: "minimumValue",
  maximumValue: "maximumValue",
  invalidInteger: "invalidInteger",
  invalidNumber: "invalidNumber",
  allowNegative: "allowNegative",
  specialCharacter: "specialCharacter",
  regexFailed: "regexFailed",
  integerRange: "integerRange",
  maxSize: "maxSize"
};


export default function UserInputField({
  name,
  label,
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
  decimalLength,
  max,
  min,
  placeholder,
  DonotAllowSpecialChar,
}) {
  const [tabPressed, setTabPressed] = useState(false);

  const { showAlert } = useAlert();

  const handleChange = (event) => {

    let inputValue = event.target.value;
    if (type === "number") {
      // Regular expression for numbers with optional decimal places
      const decimalRegex = decimalLength !== undefined
        ? new RegExp(`^\\d*\\.?\\d{0,${decimalLength}}$`) // Limit decimal places
        : /^(\d+\.?\d*|\.\d+)$/; // Allow unlimited decimals
    
      // Prevent invalid input: non-numeric characters, scientific notation, etc.
      if (!decimalRegex.test(inputValue) || inputValue.includes('e') || inputValue.includes('+') || inputValue.includes('-')) {
        return;
      }
    }
    if (type === 'text') {
      const errorResponse = validateInput({
        type,
        value: event?.target?.value ?? "",
        // minimumValue: MinimumValue,
        // maximumValue: MaximumValue,
        // allowNegative: AllowNegative, // or false based on your requirement
        // regularExpression: RegularExpression,
        donotAllowSpecialChar: DonotAllowSpecialChar,
        

      });
      if (errorResponse == errorMessages.specialCharacter) {
        showAlert("info", `special characters not allowed`);
        inputValue = ""; // Reset value if invalid
      }
      
    }
    

    const update = { ...value };
    update[name] =
      type === "number" && inputValue !== "" ? Number(inputValue) : inputValue;
    setValue(update);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      setTabPressed(true); // Set flag if Tab key is pressed
    }
  };

  const handleBlur = (event) => {
    if (tabPressed) {
      setTabPressed(false); // Reset flag after handling
      if (typeof onBlurAction === "function") {
        onBlurAction();
      }
    }
  };

  // Calculate effective width
  const effectiveWidth = 250;

  // Estimate the average width per character in pixels (adjust this value as needed)
  const averageCharWidth = 6;

  // Calculate the character threshold based on the effective width
  const tooltipThreshold = Math.floor(effectiveWidth / averageCharWidth);

  
  

  return (
    <Tooltip
      title={value[name] || ""}
      disableHoverListener={value[name]?.length <= tooltipThreshold}
      disableFocusListener={value[name]?.length <= tooltipThreshold}
      // optionally, you can add enterDelay/leaveDelay if you want
      // e.g. enterDelay={800} leaveDelay={0}
      placement="top"
    >
    <CustomTextField
      margin="normal"
      size="small"
      id="search1"
      value={
        (type === "date" && !value[name]) ||
        (type === "time" && !value[name]) ||
        (type === "datetime-local" && !value[name])
          ? " "
          : value[name] || ""
      }
      type={type}
      onMouseLeave={value[name] ? onBlurAction : null} // Trigger on mouse leave
      onBlur={handleBlur} // Trigger only if Tab key was pressed
      onKeyDown={handleKeyDown} // Detect if Tab is pressed
      label={label}
      required={mandatory}
      multiline={multiline}
      rows={multiline ? 3 : null}
      autoComplete="off"
      disabled={disabled}
      placeholder={placeholder}
      onChange={handleChange}
      InputProps={{
        inputProps: {
          maxLength: maxLength,
          max:max,
          min:min,
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
            filter:'invert(0)',
          },
          '& input[type="time"]::-webkit-calendar-picker-indicator': {
            filter:'invert(0)', // Ensures visibility in dark mode
          },
          '& input[type="datetime-local"]::-webkit-calendar-picker-indicator': {
            filter:'invert(0)',
          },
        },
      }}
      InputLabelProps={{
        style: {
          direction: direction ? "rtl" : "ltr", // Apply RTL to the label
        },
      }}
      sx={{
        width: width ? width : 250, // Adjust the width as needed
        "@media (max-width: 360px)": {
              width: 220, // Reduced width for small screens
            },
        "& .MuiInputBase-root": {
          ...(multiline ? {} : { height: 30 }), // Adjust the height of the input area if not multiline
          '& textarea': {
      '&::-webkit-scrollbar': {
        width: '6px', // Adjust the width as needed
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor:'rgba(0, 0, 0, 0.2)', // Adjust the color as needed
        borderRadius: '3px', // Adjust the border radius as needed
        cursor: 'pointer',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor:'rgba(0, 0, 0, 0.1)', // Adjust the track color as needed
      },
    },
        },
        "& .MuiInputLabel-root": {
          fontSize:"14px",
          transform: "translate(10px, 5px) scale(0.9)", // Adjust label position when not focused
          color: "inherit",
        },
        "& .MuiInputLabel-shrink": {
          transform: "translate(14px, -9px) scale(0.75)", // Adjust label position when focused
        },
        "& .MuiInputBase-input": {
          fontSize: "0.75rem", // Adjust the font size of the input text
          color:"inherit",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "currentColor", // Keeps the current border color
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "currentColor", // Optional: Keeps the border color on hover
        },
        "& .MuiFormLabel-root.Mui-focused": {
          color:"inherit", // Ensure the label color when focused
        },
        "& .MuiOutlinedInput-root": {
         
          "& fieldset": {
            borderColor: `${"#ddd"}`,
          },
          "&:hover fieldset": {
            borderColor:"currentColor", // Keeps the border color on hover
          },
          "&.Mui-focused fieldset": {
            borderColor:"currentColor", // Keeps the current border color
          },
        },
      }}
    />
    </Tooltip>
  );
}
