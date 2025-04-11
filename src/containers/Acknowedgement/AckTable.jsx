import * as React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Typography,
  Tooltip,
  Pagination,
  Stack,
  Checkbox,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  thirdColor,
  secondaryColor,
  primaryColor,
} from "../../config/config";
import { MDBIcon } from "mdb-react-ui-kit";

const iconsExtraSxCell = {
  fontSize: "0.8rem",
  padding: "0rem",
  "&:hover": {
    backgroundColor: "transparent",
  },
};

export default function AckTable({
  rows,
  excludedColumns = [],
  setInspId,
  setProductId,
  setPageRender,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Filter rows based on searchTerm (searches all values in a row)
  const filteredRows = React.useMemo(() => {
    if (!searchTerm) return rows;
    return rows.filter((row) =>
      Object.values(row).some((val) =>
        val &&
        val
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [rows, searchTerm]);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const currentRows = filteredRows.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  // Reset to first page when searching
  const handleSearch = () => {
    setPage(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter out excluded columns
  const filteredKeys = Object.keys(rows[0] || {})
    .filter((key) => !excludedColumns.includes(key))
    .map((key) => ({
      label: key
        .replace(/([A-Z])/g, " $1") // Add space before capital letters
        .trim() // Remove extra spaces
        .replace(/^./, (str) => str.toUpperCase()), // Capitalize first letter
      id: key, // Keep the original key as 'id'
    }));

  const handleOpenDetail = (data) => {
    setInspId(data?.Id);
    setProductId(data?.Product);
    setPageRender(4);
  };

  return (
    <Box
      sx={{
        width: "98%",
        margin: "auto",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingBottom: "5px",
        paddingTop: "5px",
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
          marginTop: "10px",
        }}
      >
        <FormControl>
          <InputLabel
            htmlFor="rows-per-page"
            sx={{
              "&.Mui-focused": {
                color: "currentColor", // Keeps the current color
              },
            }}
          >
            Show Entries
          </InputLabel>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            label="Rows per page"
            inputProps={{
              name: "rows-per-page",
              id: "rows-per-page",
            }}
            sx={{
              width: "120px",
              height: "30px",
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "currentColor",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "currentColor",
              },
            }}
          >
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            margin="normal"
            size="small"
            id="search"
            label="Search"
            autoComplete="off"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onBlur={handleSearch}
            onKeyDown={handleKeyDown}
            sx={{
              width: 200,
              "@media (max-width: 600px)": {
                width: 150,
              },
              "& .MuiOutlinedInput-root": {
                height: 30,
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
                transform: "translate(10px, 5px) scale(0.9)",
                color: primaryColor,
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(14px, -9px) scale(0.75)",
                color: primaryColor,
              },
              "& .MuiInputBase-input": {
                fontSize: "0.75rem",
                color: primaryColor,
              },
              "& .MuiFormLabel-root.Mui-focused": {
                color: primaryColor,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch} edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      {currentRows.length > 0 ? (
        <Paper sx={{ width: "100%", mb: 1 }}>
          <TableContainer
            sx={{
              maxHeight: "60vh",
              overflow: "auto",
              scrollbarWidth: "thin",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {filteredKeys.map((key) => (
                    <TableCell
                      key={key.id}
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
                      {key.label}
                    </TableCell>
                  ))}
                  <TableCell
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
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ backgroundColor: index % 2 === 1 ? thirdColor : null }}
                  >
                    {filteredKeys.map((key, i) => (
                      <TableCell
                        key={i}
                        sx={{
                          padding: "0px",
                          paddingLeft: "4px",
                          border: `1px solid ${thirdColor}`,
                          minWidth: "100px",
                          color: row.color ? row.color : "#000",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontWeight: row["Group"] ? 800 : null,
                          textAlign:
                            key.id === "Finding" ||
                            key.id === "CriticalFindings"
                              ? "center"
                              : "left",
                        }}
                      >
                        {key.id === "Finding" || key.id === "CriticalFindings" ? (
                          <Checkbox
                            checked={Boolean(row[key.id])}
                            sx={{ padding: "0px",m:0  }}
                          />
                        ) : (
                          row[key.id]
                        )}
                      </TableCell>
                    ))}
                    <TableCell
                      sx={{
                        padding: "0px",
                        paddingLeft: "4px",
                        border: `1px solid ${thirdColor}`,
                        minWidth: "100px",
                        color: "#000",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "center",
                      }}
                    >
                      <IconButton
                        onClick={() => handleOpenDetail(row)}
                        aria-label="location"
                        sx={iconsExtraSxCell}
                      >
                        <Stack direction="column" alignItems="center">
                          <MDBIcon
                            fas
                            icon="fa-solid fa-eye"
                            className="responsiveAction-icon"
                          />
                        </Stack>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Box sx={{ width: "100%", textAlign: "center", my: 4 }}>
          <Typography>No Data</Typography>
        </Box>
      )}

      {totalPages > 0 && (
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
          showFirstButton
          showLastButton
          sx={{ display: "flex", justifyContent: "center", padding: "8px 0" }}
        />
      )}
    </Box>
  );
}
