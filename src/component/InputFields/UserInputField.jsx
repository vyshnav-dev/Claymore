import { TextField, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/system";
import { validateInput } from "./ValidateInput";
import { useAlert } from "../Alerts/AlertContext";

const CustomTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    "& textarea": {
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderRadius: "3px",
        cursor: "pointer",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
      // Dark mode specific styles
      '&[data-mode="dark"]::-webkit-scrollbar-thumb': {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      },
      '&[data-mode="dark"]::-webkit-scrollbar-track': {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
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
  maxSize: "maxSize",
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
      const decimalRegex =
        decimalLength !== undefined
          ? new RegExp(`^\\d*\\.?\\d{0,${decimalLength}}$`)
          : /^(\d+\.?\d*|\.\d+)$/;
      if (
        !decimalRegex.test(inputValue) ||
        inputValue.includes("e") ||
        inputValue.includes("+") ||
        inputValue.includes("-")
      ) {
        return;
      }
    }
    if (type === "text") {
      const errorResponse = validateInput({
        type,
        value: event?.target?.value ?? "",
        donotAllowSpecialChar: DonotAllowSpecialChar,
      });
      if (errorResponse === errorMessages.specialCharacter) {
        showAlert("info", "special characters not allowed");
        inputValue = "";
      }
    }
    const update = { ...value };
    update[name] =
      type === "number" && inputValue !== "" ? Number(inputValue) : inputValue;
    setValue(update);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      setTabPressed(true);
    }
  };

  const handleBlur = () => {
    if (tabPressed) {
      setTabPressed(false);
      if (typeof onBlurAction === "function") {
        onBlurAction();
      }
    }
  };

  const effectiveWidth = 250;
  const averageCharWidth = 6;
  const tooltipThreshold = Math.floor(effectiveWidth / averageCharWidth);

  // Helper: if it's a date/datetime input, we can apply the forced shrink
  // so that the label doesn't overlap with the browser's date placeholder.
  const shouldShrinkLabel =
    type === "date" || type === "datetime-local" || type === "time";

  // Optionally supply a more explicit placeholder (e.g. YYYY-MM-DD) if empty
  // and the type is date/datetime.
  const finalPlaceholder =
    !value[name] && (type === "date" || type === "datetime-local")
      ? placeholder || "YYYY-MM-DD"
      : placeholder;

  return (
    <Tooltip
      title={value[name] || ""}
      disableHoverListener={!value[name] || value[name]?.length <= tooltipThreshold}
      disableFocusListener={!value[name] || value[name]?.length <= tooltipThreshold}
      placement="top"
    >
      <span>
        <CustomTextField
          margin="normal"
          size="small"
          id="search1"
          value={value[name] || ""}
          type={type}
          onMouseLeave={value[name] ? onBlurAction : null}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          label={label}
          required={mandatory}
          multiline={multiline}
          rows={multiline ? 3 : undefined}
          autoComplete="off"
          disabled={disabled}
          placeholder={finalPlaceholder}
          onChange={handleChange}
          InputProps={{
            inputProps: {
              maxLength: maxLength,
              max: max,
              min: min,
              autoComplete: "off",
              ...(type === "datetime-local"
                ? {
                    step: 1,
                    onKeyDown: (e) => {
                      if (e.key !== "Tab") e.preventDefault();
                    },
                    onClick: (e) => e.target.showPicker?.(),
                    onFocus: (e) => e.target.showPicker?.(),
                  }
                : {}),
              style: {
                direction: direction ? "rtl" : "ltr",
              },
            },
            sx: {
              "& input[type='date']::-webkit-calendar-picker-indicator": {
                filter: "invert(0)",
              },
              "& input[type='time']::-webkit-calendar-picker-indicator": {
                filter: "invert(0)",
              },
              "& input[type='datetime-local']::-webkit-calendar-picker-indicator": {
                filter: "invert(0)",
              },
            },
          }}
          InputLabelProps={{
            // Force-shrink when it's a date/time input so the label won't overlap
            // with any placeholder the browser might show
            shrink: shouldShrinkLabel || Boolean(value[name]),
            style: {
              direction: direction ? "rtl" : "ltr",
            },
          }}
          sx={{
            width: width || 250,
            "@media (max-width: 360px)": {
              width: 220,
            },
            "& .MuiInputBase-root": {
              ...(multiline ? {} : { height: 30 }),
              "& textarea": {
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  borderRadius: "3px",
                  cursor: "pointer",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                },
              },
            },
            "& .MuiInputLabel-root": {
              fontSize: "14px",
              transform: "translate(10px, 5px) scale(0.9)",
              color: "inherit",
            },
            "& .MuiInputLabel-shrink": {
              transform: "translate(14px, -9px) scale(0.75)",
            },
            "& .MuiInputBase-input": {
              fontSize: "0.75rem",
              color: "inherit",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "currentColor",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "currentColor",
            },
            "& .MuiFormLabel-root.Mui-focused": {
              color: "inherit",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#ddd",
              },
              "&:hover fieldset": {
                borderColor: "currentColor",
              },
              "&.Mui-focused fieldset": {
                borderColor: "currentColor",
              },
            },
          }}
        />
      </span>
    </Tooltip>
  );
}
