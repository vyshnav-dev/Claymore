import React from 'react'
import { IconButton, Stack, Typography, useTheme } from '@mui/material';
import { MDBIcon } from 'mdb-react-ui-kit';
import { primaryColor } from '../../config/config';

function ActionButton({iconsClick,icon,caption,iconName}) {




    const iconsExtraSx = {
        fontSize: "0.8rem",
        padding: "0.5rem",
        "&:hover": {
            backgroundColor: "transparent",
        },
    };
    const styleIcon = {
      color: primaryColor};
    
      const styleText = {
        color:primaryColor,
        fontSize: "0.6rem",
        "@media (max-width: 600px)": {
          fontSize: "0.5rem", // Reduce font size on smaller screens
        },
      };

  return (
    <IconButton
        aria-label="New"
        sx={iconsExtraSx}
        onClick={() => iconsClick(iconName)}
      >
        <Stack direction="column" alignItems="center">
        <MDBIcon fas icon={icon} style={styleIcon}  className="responsiveAction-icon" />
          <Typography variant="caption" align="center" sx={styleText}>
            {caption}
          </Typography>
        </Stack>
      </IconButton>
  )
}

export default ActionButton
