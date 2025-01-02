import * as React from "react";
import { Button, useTheme } from "@mui/material";
import { primaryColor, secondaryColor, thirdColor } from "../../config/config";

export default function NormalButton({label, action}) {
  const buttonStyle = {
    backgroundColor:secondaryColor,
    color:"white",
    textTransform: "none",
    padding: "1px",
    height: "30px", // Fixed height
    width: "60px", // Fixed width
    "&:hover": {
      backgroundColor:primaryColor,
    },
  };

  return (
    <Button onClick={action} sx={buttonStyle} variant="contained">
     {label}
    </Button>
  );
}
