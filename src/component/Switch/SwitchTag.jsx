import React from 'react';
import { Box, Typography, FormControlLabel, Switch} from '@mui/material';

const SwitchTag = ({ checked, label, onChange, disabled, rowSpan = 0}) => {

    const checkedValue = checked === true || checked === "true";
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            // Manually trigger the onChange event with the opposite value
            onChange({
                ...event,
                target: {
                    ...event.target,
                    checked: !checkedValue, // Toggle the current checked state
                },
            });
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                // gap: "10px",
                height: "max-Content",
                // paddingTop: "10px"


            }}
        >
            <Typography sx={{ pl: 1 }}>`{label} :  </Typography>


            {/* Switch Box */}

            <Typography>No</Typography>
            <Switch
                checked={checkedValue} // If Checked is 1, switch is "Yes"
                onChange={onChange}
                onKeyDown={handleKeyDown}
                color='info'
            />
            <Typography>Yes</Typography>
            {/* <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-start",
          gap: "30px",
          flexWrap: "wrap",
          "@media (max-width: 768px)": {
            gap: "10px", // Reduced gap for smaller screens
          },
          "@media (max-width: 420px)": {
            gap: "2px", // Further reduced gap for very small screens
          },
        }}
      /> */}
        </Box>
    );
};

export default SwitchTag;
