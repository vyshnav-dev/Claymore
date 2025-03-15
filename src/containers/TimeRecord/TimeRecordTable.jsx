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
} from "@mui/material";
import {
  thirdColor,
  secondaryColor,
  primaryColor,
} from "../../config/config";

const iconsExtraSx = {
  fontSize: "0.8rem",
  padding: "0.5rem",
  "&:hover": {
    backgroundColor: "transparent",
  },
  marginRight: 1,
};

export default function TimeRecordTable({ rows,excludedColumns = [] }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentRows = rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

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

  
  return (
    <Box
      sx={{
        width: "98%",
        margin: "auto",
        // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingBottom: "5px",
        paddingTop:"5px"
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
          marginTop:"10px"
        }}
      >
        {/* <FormControl>
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
                borderColor: "currentColor", // Keeps the current border color
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "currentColor", // Optional: Keeps the border color on hover
              },
            }}
          >
         
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl> */}

        {/* <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <Tooltip title="Refresh">
            <IconButton onClick={hardRefresh} sx={iconsExtraSx}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fit Content">
            <IconButton onClick={handleFitContent} sx={iconsExtraSx}>
              <FitScreenIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Expand All">
            <IconButton onClick={handleExpandAll} sx={iconsExtraSx}>
              <FullscreenIcon />
            </IconButton>
          </Tooltip>
          <TextField
            margin="normal"
            size="small"
            id="search"
            label="Search"
            autoComplete="off"
            value={searchTerm}
            onChange={(event)=>setSearchTerm(event.target.value)}
            onBlur={handleSearch}              
            onKeyDown={handleKeyDown}            
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
            InputProps={{
              // (3) add a search icon as an end-adornment:
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch} edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div> */}
      </div>

      {currentRows.length > 0 ? (
        <Paper sx={{ width: "fit-Content", mb: 1 }}>
          <TableContainer sx={{ maxHeight: "60vh", overflow: "auto", scrollbarWidth: "thin" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                <TableCell  sx={{
                                            padding: "0px",
                                            paddingLeft: "4px",
                                            border: `1px solid ${thirdColor}`,
                                            fontWeight: "600",
                                            font: "14px",
                                            backgroundColor: secondaryColor,
                                            color: "white",
                                            paddingTop: "3px",
                                            paddingBottom: "3px",
                                          }}>
                                            Sl No
                                            </TableCell>
                  {filteredKeys.map((key) => (
                    <TableCell key={key} sx={{
                                            padding: "0px",
                                            paddingLeft: "4px",
                                            border: `1px solid ${thirdColor}`,
                                            fontWeight: "600",
                                            font: "14px",
                                            backgroundColor: secondaryColor,
                                            color: "white",
                                            paddingTop: "3px",
                                            paddingBottom: "3px",
                                          }}>
                      {key?.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.map((row, index) => (
                  <TableRow  key={index} sx={{ backgroundColor: index % 2 === 1 ? thirdColor : null }}>
                    <TableCell key={index}  sx={{
                                                    padding: "0px",
                                                    paddingLeft: "4px",
                                                    border: `1px solid ${thirdColor}`,
                                                    minWidth: "100px",
                                                    color:row.color?row.color:"#000",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    fontWeight: row["Group"] ? 800 : null,
                                                    
                                                  }}>{index + 1}</TableCell>
                    {filteredKeys.map((key, i) => (
                      <TableCell key={i}  sx={{
                                                    padding: "0px",
                                                    paddingLeft: "4px",
                                                    border: `1px solid ${thirdColor}`,
                                                    minWidth: "100px",
                                                    color:row.color?row.color:"#000",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    fontWeight: row["Group"] ? 800 : null,
                                                    
                                                  }}>{row[key?.id]}</TableCell>
                    ))}
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

      {/* {totalPages > 0 && (
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
      )} */}
    </Box>
  );
}

