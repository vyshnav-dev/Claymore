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
    useMediaQuery,
    useTheme,
  } from "@mui/material";
  import React, { useState } from "react";
//   import { sideBarApis } from "../../services/sideBarApis/sideBarApis";
  import { MDBIcon } from "mdb-react-ui-kit";
//   import { tagSettingsApis } from "../../../services/settings/TagSettings/tagSettings";
  import { Edit } from "@mui/icons-material";
  import {
    backgroundColor,
    primaryColor,
    profileDateFields,
    secondaryColor,
    selectedColor,
    thirdColor,
} from "../../../config/config";
import UserInputField from "../../../component/InputFields/UserInputField";
import NormalButton from "../../../component/Buttons/NormalButton";
import { useAlert } from "../../../component/Alerts/AlertContext";
  
  const iconsExtraSx = {
    fontSize: "1rem",
    padding: "0.2rem",
    "&:hover": {
      backgroundColor: "transparent",
    },
    marginRight: 1,
  };
  
  export default function PDFieldAutoCompleteList({
    numberList,
    setNumberList,
    detailPageId,
    fieldId,
  }) {
    const [formData, setFormData] = useState({
        Id:'',
        Name:''
    });
    const { showAlert } = useAlert();
    // const { Navbar_getlanguagelist } = sideBarApis();
    // const { getnumberlistexistence } = tagSettingsApis();
    const [edit, setEdit] = useState([]);
  
    // Determine the header order based on the keys in the first object
    const headers =
      numberList.length > 0
        ? Object.keys(numberList[0]).filter(
            (header) => header !== "TagId" && header !== "LanguageId"
          ) // Exclude TagId
        : [];
  
    const headerCellStyle = {
      padding: "0px",
      paddingLeft: "4px",
      border: `1px solid ${thirdColor}`,
      fontWeight: "600",
      font: "14px",
      backgroundColor:secondaryColor,
      color:'white',
      paddingTop: "3px",
      paddingBottom: "3px",
    };
  
    const bodyCell = {
      padding: "0px",
      paddingLeft: "4px",
      border: `1px solid ${thirdColor}`,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    };
  
    const styleIcon = {
      color:null,
    };
  
    // const handleAction = (id) => {
    //   const updatedDetails = languageDetails.filter(
    //     (detail) => detail.LanguageId !== id
    //   );
  
    // };

    console.log('edit',edit.length);
    
  
    const handleAdd = async () => {
      const emptyFields = [];
      if (!formData.Id) emptyFields.push("Id");
      if (!formData.Name) emptyFields.push("Caption");
  
      if (emptyFields.length > 0) {
        showAlert("info", `Please Provide ${emptyFields[0]}`);
        return;
      }
      const checkIdExist = numberList.some((data) => data.Id === formData.Id);
  
      const checkNameExist = numberList.some(
        (data) => data.Name === formData.Name
      );
      if (checkIdExist && !edit.length) emptyFields.push("Id Already Exist");
      if (checkNameExist && !edit.length) emptyFields.push("Name Already Exist");
  
      if (emptyFields.length > 0) {
        showAlert("info", `${emptyFields[0]}`);
        return;
      }
      if (Object.keys(formData).length > 0 && !edit.length) {
        setNumberList((prevState) => [...prevState, formData]);
      } else {
        setNumberList((prevState) =>
          prevState.map((item) =>
            item.Id === formData.Id ? { ...item, Name: formData.Name } : item
          )
        );
      }
      setFormData({});
      setEdit([]);
    };
  
    const handleAction = async (id, index, type) => {
    //   const response = await getnumberlistexistence({
    //     tagId: detailPageId,
    //     id,
    //     fieldId,
    //   });
    //   if (response?.status !== "Success") {
    //     showAlert("info", `Can't ${type}`);
    //     return;
    //   }
      if (type === "Edit") {
        setEdit([index]);
        setFormData(numberList[index]);
      } else if (type === "Delete") {
        const updatedDetails = numberList.filter((detail) => detail.Id !== id);
        setNumberList(updatedDetails);
        setEdit([]);
      }
    };

    console.log('number',numberList);
    
  
    const handleEdit = (row) => {
      setEdit(row);
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
            // border:'1px solid #ddd'
          }}
        >
          <UserInputField
            label="Id"
            value={formData}
            setValue={setFormData}
            type="number"
            name="Id"
            maxLength={100}
            // direction={true}
            disabled={edit?.length}
          />
          <UserInputField
            label="Caption"
            value={formData}
            setValue={setFormData}
            type="text"
            name="Name"
            maxLength={100}
            // direction={true}
          />
  
          <div style={{ margin: 15 }}>
            <NormalButton action={handleAdd} label="Add" />
          </div>
        </Box>
        {numberList && numberList.length ? (
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-start", // Changed from center to flex-start
              marginBottom: 2,
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <TableContainer
              sx={{
                width: "fit-content",
                maxHeight: "20vh",
                overflowY: "auto",
                scrollbarWidth: "thin",
              }}
              component={Paper}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow sx={{ position: "sticky", top: 0, zIndex: 2 }}>
                    <TableCell
                      style={{ position: "relative" }}
                      sx={headerCellStyle}
                    ></TableCell>
                    {headers.map((header, index) => (
                      <TableCell
                        key={index}
                        style={{ position: "relative" }}
                        sx={headerCellStyle}
                      >
                        {header} {/* Display the dynamic header */}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {numberList.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          ...bodyCell,
                          width: "60px",
                          textAlign: "center",
                        }}
                      >
                        <IconButton
                          onClick={() => handleAction(row.Id, index, "Delete")}
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
                        <IconButton
                          onClick={() => handleAction(row.Id, index, "Edit")}
                          aria-label="delete"
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
                      </TableCell>
                      {headers.map((header, cellIndex) => (
                        <TableCell
                          key={cellIndex}
                          sx={{ ...bodyCell, minWidth: "150px" }}
                        >
                          {row[header]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : null}
      </>
    );
  }
