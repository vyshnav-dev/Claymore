import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import StaticTable from "./StaticTable";
import ActionButton from "../../component/Buttons/ActionButton";
import ExcelExport from "../../component/Excel/Excel";
import { useNavigate } from "react-router-dom";
import { FixedValues } from "../../config/config";

const AlertComponent = ({ open, onClose,rows }) => {

  const navigate = useNavigate();
 
   // Local pagination states
   const [currentPage, setCurrentPage] = useState(1);
   const rowsPerPage = 5; // or let the user pick with a drop-down
 
   // Calculate slice for the current page
   const totalRows = rows.length;
   const totalPages = Math.ceil(totalRows / rowsPerPage);
 
   const startIndex = (currentPage - 1) * rowsPerPage;
   const endIndex = startIndex + rowsPerPage;
   const currentRows = rows.slice(startIndex, endIndex);
 
   // Handle pagination changes
   const handlePageChange = (event, newPage) => {
     setCurrentPage(newPage);
   };

   const handleExcelExport =async()=>{
    await ExcelExport({
      reportName: "Job Orders To Authorize",
      filteredRows:rows,
      excludedFields:["Id"],
    });
   }

   const handleMove = () =>{
    navigate("/approve",{ state: { ScreenId: FixedValues.DashBoardMenuId }});
    onClose(); 
   }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      
      <Box sx={{display:"flex",flexdirection:"row",width:"90%",p:2,justifyContent:"space-Between",alignItems:"center",margin:"auto"}}>
        <Typography sx={{fontWeight:500,fontsize:"20px"}}> Job Orders To Authorise</Typography>
        <Box sx={{display:"flex",flexdirection:"row",justifyContent:"space-Between",alignItems:"center"}}>

        <ActionButton
          iconsClick={handleMove}
          icon={"fa-solid fa-folder-open"}
          caption={"Authorize"}
          iconName={"authorize"}
        />
        <ActionButton
          iconsClick={handleExcelExport}
          icon={"fa-solid fa-file-excel"}
          caption={"Excel"}
          iconName={"excel"}
        />
  
      <ActionButton
        iconsClick={onClose}
        icon={"fa-solid fa-xmark"}
        caption={"Close"}
        iconName={"close"}
      />
        </Box>
      {/* <NormalButton action={onClose} label={`Close`} /> */}
      </Box>
      <DialogContent>
        {/* <TableContainer component={Paper} sx={{maxHeight:"50vh",scrollbarWidth:"thin"}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Expiry Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>{row.expiryDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */}
       <StaticTable rows={rows} excludedColumns={["Id"]}/>
        {/* <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "16px" }}
          onClick={onClose}
        >
          Close
        </Button> */}
       
      </DialogContent>
    </Dialog>
  );
};

export default AlertComponent;
