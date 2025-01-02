import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, Zoom } from "@mui/material";

import { useAlert } from "../Alerts/AlertContext";
import {
  profileDateFields,
  secondaryColor,
  selectedColor,
  thirdColor,
} from "../../config/config";

export default function ReportTable(props) {
  const { rows, setRows, IdName } = props;
  const [selected, setSelected] = React.useState(null);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const { showAlert } = useAlert();
  const excludedFields = ["BE", "Product", "Unit", "Warehouse", "Bin","TransId"];

  //To apply some filters on table rows
  const initialColumns =
    rows && rows.length > 0
      ? Object.keys(rows[0])
          .filter((key) => !excludedFields.includes(key))
          .map((key) => ({
            id: key,
            label:
              key.charAt(0).toUpperCase() +
              key
                .slice(1)
                .replace(/([A-Z])/g, " $1")
                .trim(), // Format label as readable text
            minWidth: 100, // Set default minWidth for all columns
            maxWidth: 200,
          }))
      : [];
  React.useEffect(() => {
    setColumns(initialColumns);
  }, [rows]);

  //To expand column on mouse dragging
  const handleResize = (index, event) => {
    const startWidth = columns[index].minWidth;
    const startX = event.clientX;

    const handleMouseMove = (e) => {
      const currentX = e.clientX;
      const newWidth = Math.max(50, startWidth + (currentX - startX));
      setColumns((cols) =>
        cols.map((col, i) =>
          i === index ? { ...col, minWidth: newWidth, maxWidth: newWidth } : col
        )
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleClick = (event, row, index) => {
    // setSelected(index);
  };

  React.useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  React.useEffect(() => {
    setSelected(null);
  }, [props.changesTriggered]);

  //To convert date and time to dd/mm/yyyy format
  const convertToLocaleDateString = (dateString) => {
    if (!dateString) return ""; // Return an empty string for null or undefined values
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // If date is invalid, return the original string

    // Convert to local time
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );

    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = localDate.getFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <Zoom in={filteredRows?.length}>
      <Box
        sx={{
          width: "98%",
          margin: "auto",
          marginTop: "5px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {filteredRows && filteredRows.length > 0 ? (
          <Paper sx={{ width: "100%" }}>
            {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
            {/* <TableContainer sx={{maxHeight:"60vh",overflow:"scroll" }}> */}
            <TableContainer
              sx={{
                maxHeight: "60vh",
                overflow: "auto",
                scrollbarWidth: "thin",
              }}
            >
              <Table stickyHeader sx={{ minWidth: 750 }}>
                <TableHead>
                  <TableRow sx={{ position: "sticky", top: 0 }}>
                    {columns.map((column, index) => (
                      <TableCell
                        key={column.id}
                        style={{
                          minWidth: column.minWidth,
                          position: "relative",
                        }}
                        sx={{
                          padding: "0px",
                          paddingLeft: "4px",
                          border: `1px solid ${thirdColor}`,
                          fontWeight: "600",
                          font: "14px",
                          backgroundColor: secondaryColor,
                          color: "white",
                          paddingTop: "3px",
                          paddingBottom: "3px",
                        }}
                      >
                        {column.label}
                        <span
                          style={{
                            position: "absolute",
                            height: "100%",
                            right: 0,
                            top: 0,
                            width: "5px",
                            cursor: "col-resize",
                            backgroundColor: "rgba(0,0,0,0.1)",
                          }}
                          onMouseDown={(e) => handleResize(index, e)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    const isEvenRow = index % 2 === 0;

                    return (
                      <TableRow
                        key={index}
                        onClick={(event) => handleClick(event, row, index)}
                        role="checkbox"
                        aria-checked={selected === index}
                        onDoubleClick={() =>
                          props.onRowDoubleClick(row[IdName])
                        }
                        tabIndex={-1}
                        sx={{
                          cursor: "pointer",
                          backgroundColor:
                            selected === index
                              ? selectedColor
                              : index % 2 === 1
                              ? thirdColor
                              : null,
                        }}
                      >
                        {columns.map((column) => (
                          <TableCell
                            sx={{
                              padding: "0px",
                              paddingLeft: "4px",
                              border: `1px solid ${thirdColor}`,
                              minWidth: "100px",
                              maxWidth: column.maxWidth,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            key={column.id}
                            style={{ minWidth: column.minWidth }}
                          >
                            {profileDateFields.includes(column.label)
                              ? convertToLocaleDateString(row[column.id])
                              : `${row[column.id]}`}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <>
            <Box sx={{ width: "100%", textAlign: "center", my: 4 }}>
              <Typography>No Data</Typography>
            </Box>
          </>
        )}
      </Box>
    </Zoom>
  );
}
