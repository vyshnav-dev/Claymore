/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";

const DashboardBox = ({ title, subtitle}) => {
  return (
    <Box width="100%" mx="30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography variant="h4" fontWeight="bold" color="white">
            {title}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="8px">
        <Typography variant="h6" color="white">
          {subtitle}
        </Typography>
    
      </Box>
    </Box>
  );
};

export default DashboardBox;


/* eslint-disable react/prop-types */
// import { Box, Typography } from "@mui/material";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"; // Icon similar to example
// import ActionButton from "../../component/Buttons/ActionButton";
// import { MDBIcon } from "mdb-react-ui-kit";

// const DashboardBox = ({ title, subtitle, subInfo, index }) => {
//   const gradients = [
//     "linear-gradient(82.59deg, #00c48c 0%, #00a173 100%)",
//     "linear-gradient(81.67deg, #0084f4 0%, #1a4da2 100%)",
//     "linear-gradient(69.83deg, #0084f4 0%, #00c48c 100%)",
//     "linear-gradient(81.67deg, #ff647c 0%, #1f5dc5 100%)"
//   ];

//   return (
//     <Box
//       className="c-dashboardInfo"
//       sx={{
//         mb: 0.5,
//         px: 2,
//         width: "100%",
//       }}
//     >
//       <Box
//         className="wrap"
//         sx={{
//           background: "#fff",
//           boxShadow: "2px 10px 20px rgba(0, 0, 0, 0.1)",
//           borderRadius: "7px",
//           textAlign: "start",
//           position: "relative",
//           overflow: "hidden",
//           display:'flex',
//           justifyContent:'space-between',
//           pl:1
//         }}
//       >
          
//         <Box>
//         <Typography
//           variant="h6"
//           sx={{
//             fontSize: "30px",
//             fontWeight: 500,
//             color: "#6c6c6c",
//             display: "flex",
//             alignItems: "start",
//             justifyContent: "start",
//             gap: "6px",
//             pl:1
//           }}
//         >
//           {title}
//         </Typography>

//         <Typography
//           variant="h4"
//           className="c-dashboardInfo__count"
//           sx={{
//             fontWeight: 600,
//             fontSize: "20px",
//             color: "#323c43",
          
//           }}
//         >
//           {subtitle}
//         </Typography>
//         </Box>
        
//         <Box>
//           {/* <InfoOutlinedIcon sx={{ color: "yellowgreen", fontSize: 40, pr:1 }} /> */}
          
//             {/* <MDBIcon fas icon={"fa-solid fa-triangle-exclamation"} style={{fontSize:25,padding:'8px'}}  className="responsiveAction-icon" /> */}
//           </Box>
//       </Box>
//     </Box>
//   );
// };

// export default DashboardBox;

