import { Box, Checkbox, Typography } from "@mui/material";
import React from "react";

export default function ChecKBoxLabel1({
  label,
  value,
  changeValue,
  yesField,
  noField,
  width,
}) {
  const handleChange = (e) => {
    const updatedValue = { ...value };
    if (label === "Yes") {
      updatedValue[yesField] = e.target.checked;
      if (e.target.checked) updatedValue[noField] = false; // Uncheck "No"
    } else if (label === "No") {
      updatedValue[noField] = e.target.checked;
      if (e.target.checked) updatedValue[yesField] = false; // Uncheck "Yes"
    }
    changeValue(updatedValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const updatedValue = { ...value };
      if (label === "Yes") {
        updatedValue[yesField] = !updatedValue[yesField];
        if (updatedValue[yesField]) updatedValue[noField] = false; // Uncheck "No"
      } else if (label === "No") {
        updatedValue[noField] = !updatedValue[noField];
        if (updatedValue[noField]) updatedValue[yesField] = false; // Uncheck "Yes"
      }
      changeValue(updatedValue);
    }
  };

  

  return (
    <Box sx={{ display: "flex", alignItems: "center", width: width ? width : 250 }}>
      <Checkbox
        checked={label === "Yes" ? value[yesField] || false : value[noField] || false}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        inputProps={{ "aria-label": label }}
        sx={{ paddingRight: 1 }}
        color="default"
        size="small"
      />
      <Typography sx={{ fontSize: "12px", padding: 0 }} variant="body1">
        {label}
      </Typography>
    </Box>
  );
}

