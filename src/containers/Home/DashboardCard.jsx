/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";

const DashboardBox = ({ title, subtitle}) => {
  return (
    <Box width="100%" mx="30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography variant="h5" fontWeight="bold" color="white">
            {title}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="8px">
        <Typography variant="h5" color="white">
          {subtitle}
        </Typography>
    
      </Box>
    </Box>
  );
};

export default DashboardBox;
