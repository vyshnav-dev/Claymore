import { Checkbox } from "@mui/material";
import React from "react";

export default function TableChecKBox({
  value,
  changeValue,
  fieldName,
  index,
}) {
  const handleChange = (e) => {
    const updatedValue = [...value]; // Ensure `value` is treated as an object
    updatedValue[index][fieldName] = e.target.checked; // Update the specific field
    changeValue(updatedValue); // Pass the updated object to the parent
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const updatedValue = [...value];
      updatedValue[index][fieldName] = !updatedValue[index][fieldName]; // Toggle the checkbox value
      changeValue(updatedValue); // Pass the updated object to the parent
    }
  };

  return (
    <Checkbox
      checked={value[index][fieldName] || false} // Ensure it falls back to `false` if undefined
      onChange={handleChange}
      onKeyDown={handleKeyDown} // Handle Enter key press
      inputProps={{ "aria-label": "controlled" }}
      sx={{ padding: 0 }}
      color="default"
      size="small"
    />
  );
}
