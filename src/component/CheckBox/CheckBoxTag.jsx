import React from 'react';
import { Box, Checkbox, Tooltip, Typography, } from '@mui/material';


const CheckBoxTag = ({ checked, onChange,label,disabled,columnSpan=0 ,width=250}) => {


    const handleKeyDown = (event) => {
      if(disabled){
        return
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        // Manually trigger the onChange event with the opposite value
        onChange({
          ...event,
          target: {
            ...event.target,
            checked: !checked, // Toggle the current checked state
          },
        });
      }
    };
    const availableWidth = width + columnSpan * 50; // Dynamically calculated width
  const characterLimit = Math.floor(availableWidth /6); // Approximate character width based on font size (adjust divisor as needed)
  const truncatedLabel = label.length > characterLimit
  ? `${label.slice(0, characterLimit - 1)}...`
  : label;


  return (
    <Box sx={{ display: "flex", alignItems: "center",width:width+(columnSpan*50),opacity: disabled ? 0.5 : 1, 
      pointerEvents: disabled ? "none" : "auto",paddingTop:"10px",overflowY:"hidden"}}>
      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
        
        <Tooltip title={label} arrow  disableHoverListener={label.length <= characterLimit}>
          <Typography
            sx={{
              fontSize: '12px',
              padding: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
             
            }}
            variant="body1"
          >
            {truncatedLabel}
          </Typography>
        </Tooltip>
        <Checkbox
          checked={checked}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          inputProps={{ "aria-label": "controlled" }}
          disabled={disabled}
          sx={{ 
            padding: 0,
            color: 'default',
            '&.Mui-checked': {
              color: 'default',
            },
          }}
        />
      </label>
    </Box>
  );
};

export default CheckBoxTag;
