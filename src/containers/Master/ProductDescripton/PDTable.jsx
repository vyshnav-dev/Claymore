import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  IconButton,
  Typography,
  useTheme,
  Stack,
} from "@mui/material";
import {
  backgroundColor,
  primaryColor,
  profileDateFields,
  secondaryColor,
  selectedColor,
  thirdColor,
} from "../../../config/config";
import { MDBIcon } from "mdb-react-ui-kit";
// import AutoCompleteTag from "../../../components/Settings/TagSettings/AutoCompleteTag";
import ConfirmationAlert from "../../../component/Alerts/ConfirmationAlert";
import { useAlert } from "../../../component/Alerts/AlertContext";
import { masterApis } from "../../../service/Master/master";

const iconsExtraSx = {
  fontSize: "1rem",
  padding: "0.2rem",
  "&:hover": {
    backgroundColor: "transparent",
  },
  marginRight: 1,
};

export default function PDTable({ detailPageId, editAction}) {
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [selected, setSelected] = React.useState(0);
  const [formData, setFormData] = React.useState({})
  const [rows, setRows] = React.useState([]);
  const IdName = "Id";
  const { showAlert } = useAlert();
  const theme = useTheme();
  const { GetProductFieldList,DeleteProductField } = masterApis();
  const [confirmAlert, setConfirmAlert] = React.useState(false); //To handle alert open
  const [confirmData, setConfirmData] = React.useState({});

  const excludedFields = [IdName,'Tab','DataType','DisplayControlType',];
  const styleIcon = {
    color:null
  };
  React.useEffect(() => {
    fetchData();
  }, [detailPageId, formData,]);

  const fetchData = async () => {
    setRows([])
    const response = await GetProductFieldList({
      ProductId: detailPageId
    });
    if (response?.status === "Success") {
      const myObject = JSON.parse(response.result);   
      setRows(myObject);
    }
  };

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
    setFilteredRows(rows);
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

  //To expand double Clicked column
  const handleDoubleClick = (index) => {
    setColumns((cols) =>
      cols.map((col, i) =>
        i === index ? { ...col, maxWidth: col.maxWidth ? null : 200 } : col
      )
    );
  };

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

  const handleAction = async (id, caption) => {
    if (caption === "delete") {
      setSelected(id);
      setConfirmData({ message: "Delete", type: "danger" });
      handleConfrimOpen();
    } else if (caption === "edit") {
      editAction("", 1, id)
    }
  };

  const handleDelete = async () => {
    const response = await DeleteProductField({
      Id:selected
    }); 
     if(response?.status === "Success"){
      handleConfrimClose()
      fetchData();
      showAlert("success", response.message);
      return;
     }  
  };

  const handleConfrimOpen = () => {
    setConfirmAlert(true);
  };
  const handleConfrimClose = () => {
    setConfirmAlert(false);
  };

 
  return (
    <>
       <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          justifyContent: "flex-start", // Changed from center to flex-start
          paddingBottom: 1,
          gap: 1,
          flexWrap: "wrap",
        }}
      >
           
      </Box>
      {rows && rows.length > 0 ? (
        <Paper sx={{ width: "100%" }}>
          <TableContainer
            sx={{ maxHeight: "55vh", overflow: "auto", scrollbarWidth: "thin" }}
          >
            <Table stickyHeader sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow sx={{ position: "sticky", top: 0, zIndex:2 }}>
                  <TableCell
                    style={{
                      width:"20px",
                      position: "relative",
                      textAlign: "center",
                    }}
                    sx={{
                      padding: "0px",
                      paddingLeft: "4px",
                      border: `1px solid ${thirdColor}`,
                      fontWeight: "600",
                      font: "14px",
                      backgroundColor:secondaryColor,
                      color:"white",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                    }}
                  >
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
                        backgroundColor:secondaryColor,
                        color:'white',
                        paddingTop: "3px",
                        paddingBottom: "3px",
                      }}
                      onDoubleClick={() => handleDoubleClick(index)}
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
                  return (
                    <TableRow
                      role="checkbox"
                      tabIndex={-1}
                      key={row[IdName]}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: index % 2 === 1
                          ? thirdColor
                          : null,
                      }}
                    >
                      <TableCell
                        sx={{
                          backgroundColor:null,
                          padding: "0px",
                          paddingLeft: "4px",
                          textAlign: "center",
                          border: `1px solid ${thirdColor}`,
                          minWidth: "100px",
                          // maxWidth: column.maxWidth,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <IconButton
                          onClick={() => handleAction(row[IdName], "edit")}
                          aria-label="New"
                          sx={iconsExtraSx}
                        >
                          <Stack direction="column" alignItems="center">
                            <MDBIcon
                              fas
                              icon="edit"
                              style={styleIcon}
                              className="responsiveAction-icon"
                            />
                          </Stack>
                        </IconButton>
                        <IconButton
                          onClick={() => handleAction(row[IdName], "delete")}
                          aria-label="delete"
                          sx={iconsExtraSx}
                        >
                          <Stack direction="column" alignItems="center">
                            <MDBIcon
                              fas
                              icon="trash"
                              style={styleIcon}
                              className="responsiveAction-icon"
                            />
                          </Stack>
                        </IconButton>
                      </TableCell>
                      {columns.map((column) => (
                        <TableCell
                          sx={{
                            backgroundColor: null,
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
                          { `${row[column.id]}` }
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
      <ConfirmationAlert
        handleClose={handleConfrimClose}
        open={confirmAlert}
        data={confirmData}
        submite={handleDelete}
      />
    </>
  );
}
