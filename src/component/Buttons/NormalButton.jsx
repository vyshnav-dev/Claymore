// import * as React from "react";
// import { Button, useTheme } from "@mui/material";
// import { primaryColor, secondaryColor, thirdColor } from "../../config/config";

// export default function NormalButton({label, action}) {
//   const buttonStyle = {
//     backgroundColor:secondaryColor,
//     color:"white",
//     textTransform: "none",
//     padding: "1px",
//     height: "30px", // Fixed height
//     width: "60px", // Fixed width
//     "&:hover": {
//       backgroundColor:primaryColor,
//     },
//   };

//   return (
//     <Button  onClick={action} sx={buttonStyle} variant="contained">
//      {label}
//     </Button>
//   );
// }

import * as React from "react";
import { Button } from "@mui/material";
import { primaryColor, secondaryColor } from "../../config/config";

export default function NormalButton({ label, action }) {
  // const [isDisabled, setIsDisabled] = React.useState(false);

  const handleClick = async () => {
    await action(); // Execute the provided action
  };

  const buttonStyle = {
    backgroundColor: secondaryColor,
    color: "white",
    textTransform: "none",
    padding: "1px",
    height: "30px",
    width: "60px",
    "&:hover": {
      backgroundColor: primaryColor,
    },
  };

  return (
    <Button
      onClick={handleClick}
      sx={buttonStyle}
      variant="contained"
      // disabled={isDisabled} // Disable button when action is in progress
    >
      {label}
    </Button>
  );
}

