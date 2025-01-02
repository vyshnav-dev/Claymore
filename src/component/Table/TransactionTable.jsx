import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Typography,
  TextField,
  useTheme,
  Tooltip,
  ClickAwayListener,
  Popover,
  Button,
  Zoom,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import Pagination from "@mui/material/Pagination";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import {
  backgroundColor,
  primaryColor,
  profileDateFields,
  secondaryColor,
  selectedColor,
  thirdColor,
} from "../../config/config";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import ActionButton from "../Buttons/ActionButton";
import { convertToLocaleDateString } from "../../config/functions";

const iconsExtraSx = {
  fontSize: "0.8rem",
  padding: "0.5rem",
  "&:hover": {
    backgroundColor: "transparent",
  },
  marginRight: 1,
};

export default function TransactonTable(props) {
  const { rows, IdName, mainDetails, onRowDoubleClick } = props;
  const [selected, setSelected] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const [hasMore, setHasMore] = React.useState(true);

  const itemsPerPage = 50; // Number of rows to load at a time
  const scrollContainerRef = React.useRef(null);
  const excludedFields = [
    IdName,
    "TransId",
    "Product",
    "Warehouse",
    // "Unit",
    "Bin",
    "SlNo",
    "DisableSerialNo",
    "DisableBatch",
    "error",
    ...(mainDetails?.WarehouseHeader ? ["Warehouse_Name"] : []),
    ...(!mainDetails?.BinEnabled ? ["Bin_Name"] : []),
  ];

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

  //To expand double Clicked column
  const handleDoubleClick = (index) => {
    setColumns((cols) =>
      cols.map((col, i) =>
        i === index ? { ...col, maxWidth: col.maxWidth ? null : 200 } : col
      )
    );
  };

  //To Search
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    // Filter rows based on the search term
    const filtered = rows.filter((row) =>
      columns.some((column) =>
        String(row[column.id]) // Convert value to string
          .toLowerCase()
          .includes(searchValue)
      )
    );

    // Update the displayed rows
    setFilteredRows(filtered.slice(0, itemsPerPage));
    setHasMore(filtered.length > itemsPerPage); // Reset "load more" if applicable
  };

  // Track selected column

  React.useEffect(() => {
    setFilteredRows(rows.slice(0, itemsPerPage));
  }, [rows]);


  const loadMoreData = () => {
    if (!hasMore) return;

    const currentLength = filteredRows.length;
    const newLength = Math.min(currentLength + itemsPerPage, rows.length);
    const newData = rows.slice(currentLength, newLength);

    setFilteredRows((prev) => [...prev, ...newData]);
    if (newLength === rows.length) {
      setHasMore(false); // All data has been loaded
    }
  };

  // Handle scroll event
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check if the user has scrolled near the bottom
    if (
      container.scrollTop + container.clientHeight >=
        container.scrollHeight - 50 &&
      hasMore
    ) {
      loadMoreData();
    }
  };

  return (
    <Zoom in={true}>
      <Box
        sx={{
          width: "98%",
          margin: "auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          paddingLeft: "10px",
          paddingRight: "10px",
          paddingBottom: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
          >
            <TextField
              margin="normal"
              size="small"
              id="search"
              label="Search"
              autoComplete="off"
              value={searchTerm}
              onChange={handleSearch}
              sx={{
                width: 200, // Default width
                "@media (max-width: 600px)": {
                  width: 150, // Reduced width for small screens
                },
                "& .MuiOutlinedInput-root": {
                  height: 30, // Adjust the height of the input area
                  "& fieldset": {
                    borderColor: `${primaryColor}`,
                  },
                  "&:hover fieldset": {
                    borderColor: primaryColor,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: primaryColor,
                  },
                },
                "& .MuiInputLabel-root": {
                  transform: "translate(10px, 5px) scale(0.9)", // Adjust label position when not focused
                  color: primaryColor,
                },
                "& .MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.75)", // Adjust label position when focused
                  color: primaryColor,
                },
                "& .MuiInputBase-input": {
                  fontSize: "0.75rem", // Adjust the font size of the input text
                  color: primaryColor,
                },
                "& .MuiFormLabel-root.Mui-focused": {
                  color: primaryColor,
                },
              }}
            />
          </div>
        </div>
        {filteredRows && filteredRows.length > 0 ? (
          <Paper sx={{ width: "100%", mb: 1 }}>
            {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
            {/* <TableContainer sx={{maxHeight:"60vh",overflow:"scroll" }}> */}
            <TableContainer
              ref={scrollContainerRef}
              onScroll={handleScroll}
              sx={{
                maxHeight: "55vh",
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
                        onDoubleClick={() => handleDoubleClick(index)}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.map((row, index) => (
                    <PopupState
                      variant="popover"
                      popupId={`popover-${index}`}
                      key={index}
                    >
                      {(popupState) => (
                        <>
                          <TableRow
                            tabIndex={0}
                            sx={{
                              cursor: "pointer",
                              backgroundColor: row?.error
                                ? "red"
                                : index % 2 === 1
                                ? thirdColor
                                : null,
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                              },
                              "&:focus-visible": {
                                outline: `2px solid ${thirdColor}`, // Highlight for focused row
                                backgroundColor: "rgba(0, 0, 0, 0.2)", // Optional: Change background on focus
                              },
                            }}
                            {...bindTrigger(popupState)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                popupState.open(); // Open the popover
                              }
                            }}
                            onDoubleClick={(e) => {
                              onRowDoubleClick(e, row); // Call the double-click handler
                              popupState.close(); // Close the popover
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
                                  fontWeight: row["Group"] ? 800 : null,
                                }}
                                key={column.id}
                              >
                                {profileDateFields.includes(column.label)
                                  ? convertToLocaleDateString(row[column.id])
                                  : row[column.id] === null
                                  ? ""
                                  : `${row[column.id]}`}
                              </TableCell>
                            ))}
                          </TableRow>
                          {/* Popover for Additional Details */}
                          <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "center",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "center",
                            }}
                            PaperProps={{
                              sx: {
                                backgroundColor: secondaryColor,
                                maxWidth: "300px",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                              },
                            }}
                          >
                            <IconButton
                              onClick={() => {
                                props.handleAddRow(index), popupState.close();
                              }}
                              sx={{ m: 0, p: 1, color: "white" }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <AddIcon
                                  sx={{
                                    fontSize: "1rem", // Adjusted font size
                                  }}
                                />{" "}
                                {/* Reduced icon size */}
                                <Typography
                                  variant="body2" // Smaller label text
                                  sx={{
                                    fontSize: "0.5rem", // Adjusted font size
                                  }}
                                >
                                  New
                                </Typography>
                              </Box>
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                props.handleEditRow(row), popupState.close();
                              }}
                              sx={{ m: 0, p: 1, color: "white" }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <EditIcon
                                  sx={{
                                    fontSize: "1rem", // Adjusted font size
                                  }}
                                />{" "}
                                {/* Reduced icon size */}
                                <Typography
                                  variant="body2" // Smaller label text
                                  sx={{
                                    fontSize: "0.5rem", // Adjusted font size
                                  }}
                                >
                                  Edit
                                </Typography>
                              </Box>
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                props.handleDeleteRow(index),
                                  popupState.close();
                              }}
                              onKeyDown={(event) => {
                                if (event.key === "Tab") {
                                  popupState.close(); // Open the popover
                                }
                              }}
                              sx={{ m: 0, p: 1, color: "white" }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <DeleteOutlineIcon
                                  sx={{
                                    fontSize: "1rem", // Adjusted font size
                                  }}
                                />{" "}
                                {/* Reduced icon size */}
                                <Typography
                                  variant="body2" // Smaller label text
                                  sx={{
                                    fontSize: "0.5rem", // Adjusted font size
                                  }}
                                >
                                  Delete
                                </Typography>
                              </Box>
                            </IconButton>
                          </Popover>
                        </>
                      )}
                    </PopupState>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <>
            <Box sx={{ width: "100%", textAlign: "center", my: 4 }}>
              <ActionButton
                iconsClick={props.handleAddRow}
                icon={"fa-solid fa-plus"}
                caption={"Add Data"}
                iconName={"new"}
              />
            </Box>
          </>
        )}
      </Box>
    </Zoom>
  );
}
