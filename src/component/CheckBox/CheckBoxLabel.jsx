import { Box, Checkbox, Typography } from "@mui/material";
import React from "react";

export default function ChecKBoxLabel({
  label,
  value,
  changeValue,
  fieldName,
  width,
}) {
  const handleChange = (e) => {
    const updatedValue = { ...value }; // Ensure `value` is treated as an object
    updatedValue[fieldName] = e.target.checked; // Update the specific field
    changeValue(updatedValue); // Pass the updated object to the parent
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const updatedValue = { ...value };
      updatedValue[fieldName] = !updatedValue[fieldName]; // Toggle the checkbox value
      changeValue(updatedValue); // Pass the updated object to the parent
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", width: width ? width : 250 }}>
      <Checkbox
        checked={value[fieldName] || false} // Ensure it falls back to `false` if undefined
        onChange={handleChange}
        onKeyDown={handleKeyDown} // Handle Enter key press
        inputProps={{ "aria-label": "controlled" }}
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
