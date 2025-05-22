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
import { useAlert } from "../../component/Alerts/AlertContext";

const AlertComponent = ({ open, onClose, rows }) => {

  const navigate = useNavigate();
  const { showAlert } = useAlert();
  // Local pagination states
  const [selectedDatas, setselectedDatas] = React.useState([]);
  const [id, setId] = useState(0);
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


  const handleSelectedRowsChange = (selectedRowsData) => {
    setselectedDatas(selectedRowsData);
  };


  const handleRowDoubleClick = (rowiId) => {
    if(rowiId){
      navigate("/approve", { state: { ScreenId: FixedValues.DashBoardMenuId, Page:2 , Id:rowiId } });
    } 
  };
  

  const handleExcelExport = async () => {
    await ExcelExport({
      reportName: "Job Orders To Authorize",
      filteredRows: rows,
      excludedFields: ["Id"],
    });
  }

  const handleMove = () => {
    // if (selectedDatas.length !== 1) {
    //   showAlert(
    //     "info",
    //     selectedDatas.length === 0
    //       ? "Please Select row "
    //       : "Can't Select Multiple Row"
    //   );
    //   return;
    // }
    navigate("/approve", { state: { ScreenId: FixedValues.DashBoardMenuId} });
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>

      <Box sx={{ display: "flex", flexdirection: "row", width: "90%", p: 2, justifyContent: "space-Between", alignItems: "center", margin: "auto" }}>
        <Typography sx={{ fontWeight: 500, fontsize: "20px" }}> Job Orders To Authorise</Typography>
        <Box sx={{ display: "flex", flexdirection: "row", justifyContent: "space-Between", alignItems: "center" }}>

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
      </Box>
      <DialogContent>
        <StaticTable
          rows={rows}
          excludedColumns={["Id"]}
          onSelectedRowsChange={handleSelectedRowsChange}
          onRowDoubleClick={handleRowDoubleClick}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AlertComponent;
