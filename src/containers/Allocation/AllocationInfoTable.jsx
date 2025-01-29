import {
    Box,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
    Zoom,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import { MDBIcon } from "mdb-react-ui-kit";
  import {
    primaryColor,
    secondaryColor,
    thirdColor,
  } from "../../config/config";
  import TableInputes from "../../component/InputFields/TableInputes";
  import { stockCountApis } from "../../service/Transaction/stockcount";
  import { useAlert } from "../../component/Alerts/AlertContext";
  import MasterUnitTableAutoComplete from "../../component/AutoComplete/MasterAutoComplete/MasterUnitTableAutoComplete";
  
  const iconsExtraSx = {
    fontSize: "0.8rem",
    padding: "0.2rem",
    "&:hover": {
      backgroundColor: thirdColor,
    },
    marginRight: 1,
  };
  
  export default function AllocationInfoTable({ tableBody, setTableBody, baseUnit }) {
    const [selected, setSelected] = useState(0);
    const { showAlert } = useAlert();
    const { gettaglist } = stockCountApis();
  
    // Define all headers and filter them based on mainDetails properties
    const allHeaders = [
      { name: "Availabe Qty" },
      { name: "Assign Qty" },
      { name: "Technician" },
    ];
  
    const headerCellStyle = {
      padding: "0px 4px",
      border: `1px solid #ddd`,
      fontWeight: "600",
      fontSize: "14px",
      backgroundColor: secondaryColor,
      color: "white",
    };
  
    const bodyCellStyle = {
      border: `1px solid #ddd`,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontSize: "12px",
    };
  
    const styleIcon = {
      color: primaryColor,
    };
  
    const handleRowClick = (id) => {
      setSelected(id);
    };
  
    function hasDuplicateBarcode(data) {
      return data.some((item, index, array) =>
        array.findIndex((el) => el.Barcode === item.Barcode) !== index
      );
    }
    
    const handleAddRow = () => {
      const checkDataMissing = tableBody.some(
        (item) => !item?.Unit || !item?.Conversion || !item?.Barcode
      );
  
      if (checkDataMissing) {
        showAlert("info", `Please fill the row`);
        return;
      }
      
      if(hasDuplicateBarcode([...tableBody,baseUnit])){
        showAlert("info", `Please fill unique barcode`);
        return;
      }
      setTableBody((prev) => [
        ...prev,
        {
          Barcode: null,
          Conversion: null,
          Unit: null,
          Unit_Name: null,
        },
      ]);
    };
  
    const handleRowDelete = (index) => {
      if (tableBody.length > 1) {
        setTableBody((prevBatch) => prevBatch.filter((_, i) => i !== index));
      } else {
        setTableBody([
          {
            Barcode: null,
            Conversion: null,
            Unit: null,
            Unit_Name: null,
          },
        ]);
      }
    };
  
    const renderTableCell = (header, row, index) => {
      const isRowSelected = selected === index;
  
      if (header.name === "Technician") {
        return isRowSelected ? (
          <MasterUnitTableAutoComplete
            apiKey={gettaglist}
            formData={tableBody}
            setFormData={setTableBody}
            autoId="Technician"
            formDataName="Technician_Name"
            formDataiId="Technician"
            Index={index}
            tagId={14}
            baseUnit={baseUnit}
          />
        ) : (
          row["Technician_Name"]
        );
      }
  
      if (header.name === "Available Qty") {
        return isRowSelected ? (
          <TableInputes
            name={"FieldName"}
            type="text"
            // disabled={!baseUnit?.Unit}
            value={tableBody}
            setValue={setTableBody}
            index={index}
            decimalLength={10}
          />
        ) : (
          row["Available Qty"]
        );
      }
  
      if (header.name === "Assign Qty") {
        return isRowSelected ? (
          <TableInputes
            name={"Assign Qty"}
            type="text"
            // disabled={!baseUnit?.Unit}
            value={tableBody}
            setValue={setTableBody}
            index={index}
            decimalLength={10}
            tabAction={handleAddRow}
          />
        ) : (
          row["Assign Qty"]
        );
      }
  
      return row[header.name];
    };
  
    useEffect(()=>{
       setSelected(tableBody?.length - 1)
    },[tableBody?.length])
  
    return (
  
        <Box
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "start",
            marginBottom: 2,
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <TableContainer
            sx={{
              width: "auto",
              maxHeight: "70vh",
              overflowY: "auto",
              scrollbarWidth: "thin",
              m: 1,
            }}
            component={Paper}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...headerCellStyle, textAlign: "center" }}>
                    <IconButton
                      onClick={handleAddRow}
                      aria-label="add"
                      sx={{
                        fontSize: "0.8rem",
                        padding: "0.2rem",
                        "&:hover": {
                          backgroundColor: primaryColor,
                        },
                        marginRight: 1,
                      }}
                    >
                      <Stack direction="column" alignItems="center">
                        <MDBIcon
                          fas
                          icon="add"
                          style={{ color: "white" }}
                          className="responsiveAction-icon"
                        />
                      </Stack>
                    </IconButton>
                  </TableCell>
                  {allHeaders.map((header, index) => (
                    <TableCell key={index} sx={headerCellStyle}>
                      {header.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableBody.map((row, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleRowClick(index)}
                    sx={{
                      backgroundColor: row?.error ? "red" : null,
                      cursor: "pointer",
                    }}
                  >
                    <TableCell
                      sx={{
                        ...bodyCellStyle,
                        minWidth: "80px",
                        textAlign: "center",
                        padding: "0px 4px",
                      }}
                    >
                      <>
                        <IconButton
                          onClick={() => handleRowDelete(index)}
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
                      </>
                    </TableCell>
                    {allHeaders.map((header) => (
                      <TableCell
                        key={header.name}
                        sx={{
                          ...bodyCellStyle,
                          width: `${100 / allHeaders.length}%`,
                          minWidth: 100,
                          padding: selected === index ? "0px" : "4px 15px",
                          textAlign:
                            header.name === "Base Unit" ? "center" : null,
                        }}
                      >
                        {renderTableCell(header, row, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
  
    );
  }
