import React from "react";
import Box from "@mui/material/Box";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import sangsolution from "/Images/sangsolution.png";
import { Oval } from "react-loader-spinner";
import { primaryColor, secondaryColor, thirdColor } from "../../config/config";

export default function Loader({ loader, loaderClose }) {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1, // Set a higher value for maximum z-index
      }}
      open={loader}
      onClick={loaderClose}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Oval
          visible={true}
          height="75"
          width="75"
          color={secondaryColor}
          secondaryColor={thirdColor}
          strokeWidth={4}
          strokeWidthSecondary={3}
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
        <Box
          component="img"
          src={sangsolution}
          alt="Company Logo"
          sx={{
            width: "50px",
            height: "50px",
            position: "absolute",
          }}
        />
      </Box>
    </Backdrop>
  );
}
