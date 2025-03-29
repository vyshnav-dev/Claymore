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
} from "../../../config/config";
import TableInputes from "../../../component/InputFields/TableInputes";
import TableProductAutoComplete from "../../../component/AutoComplete/TableProductAutoComplete";
import TableBinAutoComplete from "../../../component/AutoComplete/TableBinAutoComplete";
import TableUnitAutoComplete from "../../../component/AutoComplete/TableUnitAutoComplete";
import NormalModal from "../../../component/Modal/NormalModal";
import { useAlert } from "../../../component/Alerts/AlertContext";
import TableAutoComplete from "../../../component/AutoComplete/TableAutoComplete";
import ChecKBoxLabel from "../../../component/CheckBox/CheckBoxLabel";
import TableChecKBox from "../../../component/CheckBox/TableCheckBox";
import MasterUnitTableAutoComplete from "../../../component/AutoComplete/MasterAutoComplete/MasterUnitTableAutoComplete";
import AutoSelectNoHeader from "../../../component/AutoComplete/AutoSelectNoHeader";

const iconsExtraSx = {
  fontSize: "0.8rem",
  padding: "0.2rem",
  "&:hover": {
    backgroundColor: thirdColor,
  },
  marginRight: 1,
};

export default function PDInfoTable({ tableBody, setTableBody, baseUnit }) {
  const [selected, setSelected] = useState(0);
  const { showAlert } = useAlert();

  // Define all headers and filter them based on mainDetails properties
  const allHeaders = [
    { name: "Tab" },
    { name: "Type" }, 
    { name: "FieldOrder" },
    { name: "Field Name" },
    { name: "Caption" },
    { name: "DataType" },
    { name: "MaxSize" },
    { name: "DefaultValue" },
    { name: "DisplayControlType" },
    { name: "Default" },
    { name: "MinimumValue" },
    { name: "MaximumValue" },
    { name: "ToolTip" },
    { name: "Hidden" },
    { name: "ReadOnly" },
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
    // const checkDataMissing = tableBody.some(
    //   (item) => !item?.Unit || !item?.Conversion || !item?.Barcode
    // );

    // if (checkDataMissing) {
    //   showAlert("info", `Please fill the row`);
    //   return;
    // }

   
    setTableBody((prev) => [
      ...prev,
      {
        tab: null,
        Type: null,
        FieldName: null,
        Caption: null,
        dataType:0,
        maxSize:null,
        defaultValue:null,
        displayControlType:0,
        default:null,
        minimumValue:null,
        maximumValue:null,
        toolTip:null,
        fieldOrder:null,
        hidden:false,
        readOnly:false,
    }
    ]);
  };

  const handleRowDelete = (index) => {
    if (tableBody.length > 1) {
      setTableBody((prevBatch) => prevBatch.filter((_, i) => i !== index));
    } else {
      setTableBody([
        {
          tab: null,
          Type: null,
          FieldName: null,
          Caption: null,
          dataType:0,
          maxSize:null,
          defaultValue:null,
          displayControlType:0,
          default:null,
          minimumValue:null,
          maximumValue:null,
          toolTip:null,
          fieldOrder:null,
          hidden:false,
          readOnly:false,
      },
      ]);
    }
  };

  const renderTableCell = (header, row, index) => {
    const isRowSelected = selected === index;

    if (header.name === "Tab") {
      return isRowSelected ? (
        <AutoSelectNoHeader
          key={"Tab"}
          formData={tableBody}
          setFormData={setTableBody}
          autoId={"Tab"}
          formDataName={`Tab_Name`}
          formDataiId={"tab"}
          required={false}
          ColumnSpan={0}
          tableField={true}
          Menu={[{ "Id": 1, "Name": "Tab1" }, { "Id": 2, "Name": "Tab2" }]}
          width={130}
        />
      ) : (
        row["tab"]
      );
    }
    if (header.name === "DataType") {
      return isRowSelected ? (
        <AutoSelectNoHeader
          key={"dataType"}
          formData={tableBody}
          setFormData={setTableBody}
          autoId={"dataType"}
          formDataName={`dataType`}
          formDataiId={"dataType"}
          required={false}
          ColumnSpan={0}
          tableField={true}
          Menu={[{ "Id": 1, "Name": "Tab1" }, { "Id": 2, "Name": "Tab2" }]}
          width={130}
        />
      ) : (
        row["dataType"]
      );
    }
    if (header.name === "DisplayControlType") {
      return isRowSelected ? (
        <AutoSelectNoHeader
          key={"ControlType"}
          formData={tableBody}
          setFormData={setTableBody}
          autoId={"ControlType"}
          formDataName={`ControlType`}
          formDataiId={"ControlType"}
          required={false}
          ColumnSpan={0}
          tableField={true}
          Menu={[{ "Id": 1, "Name": "Tab1" }, { "Id": 2, "Name": "Tab2" }]}
          width={130}
        />
      ) : (
        row["ControlType"]
      );
    }
    if (header.name === "Hidden") {
      return isRowSelected ? (
        <AutoSelectNoHeader
          key={"hidden"}
          formData={tableBody}
          setFormData={setTableBody}
          autoId={"hidden"}
          formDataName={`hidden`}
          formDataiId={"hidden"}
          required={false}
          ColumnSpan={0}
          tableField={true}
          Menu={[{ "Id": 1, "Name": "true" }, { "Id": 2, "Name": "false" }]}
          width={130}
        />
      ) : (
        row["hidden"]
      );
    }
    if (header.name === "ReadOnly") {
      return isRowSelected ? (
        <AutoSelectNoHeader
          key={"readOnly"}
          formData={tableBody}
          setFormData={setTableBody}
          autoId={"readOnly"}
          formDataName={`readOnly`}
          formDataiId={"readOnly"}
          required={false}
          ColumnSpan={0}
          tableField={true}
          Menu={[{ "Id": 1, "Name": "true" }, { "Id": 2, "Name": "false" }]}
          width={130}
        />
      ) : (
        row["readOnly"]
      );
    }
    

    if (header.name === "Type") {
      return isRowSelected ? (
        <MasterUnitTableAutoComplete
          apiKey={gettaglist}
          formData={tableBody}
          setFormData={setTableBody}
          autoId="type"
          formDataName="Type_Name"
          formDataiId="Type"
          Index={index}
          tagId={14}
          baseUnit={baseUnit}
        />
      ) : (
        row["Type_Name"]
      );
    }

    if (header.name === "Field Name") {
      return isRowSelected ? (
        <TableInputes
          name={"fieldName"}
          type="text"
          // disabled={!baseUnit?.Unit}
          value={tableBody}
          setValue={setTableBody}
          index={index}
          decimalLength={10}
        />
      ) : (
        row["fieldName"]
      );
    }
    if (header.name === "MaxSize") {
      return isRowSelected ? (
        <TableInputes
          name={"maxSize"}
          type="text"
          // disabled={!baseUnit?.Unit}
          value={tableBody}
          setValue={setTableBody}
          index={index}
          decimalLength={10}
        />
      ) : (
        row["maxSize"]
      );
    }
    if (header.name === "DefaultValue") {
      return isRowSelected ? (
        <TableInputes
          name={"defaultValue"}
          type="text"
          // disabled={!baseUnit?.Unit}
          value={tableBody}
          setValue={setTableBody}
          index={index}
          decimalLength={10}
        />
      ) : (
        row["defaultValue"]
      );
    }
    if (header.name === "Default") {
      return isRowSelected ? (
        <TableInputes
          name={"default"}
          type="text"
          // disabled={!baseUnit?.Unit}
          value={tableBody}
          setValue={setTableBody}
          index={index}
          decimalLength={10}
        />
      ) : (
        row["default"]
      );
    }
    if (header.name === "MaximumValue") {
      return isRowSelected ? (
        <TableInputes
          name={"maximumValue"}
          type="text"
          // disabled={!baseUnit?.Unit}
          value={tableBody}
          setValue={setTableBody}
          index={index}
          decimalLength={10}
        />
      ) : (
        row["maximumValue"]
      );
    }
    if (header.name === "MinimumValue") {
      return isRowSelected ? (
        <TableInputes
          name={"minimumValue"}
          type="text"
          // disabled={!baseUnit?.Unit}
          value={tableBody}
          setValue={setTableBody}
          index={index}
          decimalLength={10}
        />
      ) : (
        row["minimumValue"]
      );
    }
    if (header.name === "ToolTip") {
      return isRowSelected ? (
        <TableInputes
          name={"toolTip"}
          type="text"
          // disabled={!baseUnit?.Unit}
          value={tableBody}
          setValue={setTableBody}
          index={index}
          decimalLength={10}
        />
      ) : (
        row["toolTip"]
      );
    }
    if (header.name === "FieldOrder") {
      return isRowSelected ? (
        <TableInputes
          name={"fieldOrder"}
          type="text"
          // disabled={!baseUnit?.Unit}
          value={tableBody}
          setValue={setTableBody}
          index={index}
          decimalLength={10}
          readOnly={true}
        />
      ) : (
        row["fieldOrder"]
      );
    }

    if (header.name === "Caption") {
      return isRowSelected ? (
        <TableInputes
          name={"Caption"}
          type="text"
          value={tableBody}
          setValue={setTableBody}
          index={index}
          decimalLength={10}
          tabAction={handleAddRow}
        />
      ) : (
        row["Caption"]
      );
    }

    return row[header.name];
  };

  useEffect(() => {
    setSelected(tableBody?.length - 1)
  }, [tableBody?.length])

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
            {tableBody?.map((row, index) => (
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

