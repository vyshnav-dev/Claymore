import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { MDBIcon } from "mdb-react-ui-kit";
import { Box } from "@mui/material";
// import { useCustomTheme } from "../../config/themeContext";
// import { icon } from "@fortawesome/fontawesome-svg-core";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => {
  const theme = useTheme();
  
  // const { currentTheme } = useCustomTheme();
  return (
    <MuiAccordionSummary
      expandIcon={
        props.expanded ? (
          <RemoveCircleOutlineIcon
            sx={{
              fontSize: "1.25rem",
              color:"#26668b"
            }}
          />
        ): (
          <AddCircleOutlineIcon
            sx={{
              fontSize: "1.25rem",
              color:"#26668b"
            }}
          />
        )
      }
      {...props}
    />
  );
})(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(180deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    marginLeft: "auto", // Push the icon to the far right
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function CustomizedAccordions({
  children,
  icons,
  label,
  expanded,
  onChange,
}) {
  // const { currentTheme } = useCustomTheme();
  // const theme = useTheme();
  
  return (
    <div>
      <Accordion expanded={expanded} onChange={onChange}>
        <AccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          expanded={expanded}
          // theme={theme}
        >
          {icons && (
     <Box style={{ position: "relative", width: "30px" }}>
     <MDBIcon
       fas
       icon={icons}
       style={{
         fontSize: "15px",
         color:"#26668b"
       }}
     />
   </Box>
          )}
     
          <Typography>{label}</Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
}
