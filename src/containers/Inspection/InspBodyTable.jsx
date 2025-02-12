import React, { useState, useCallback, useMemo } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Stack, Popover, Checkbox, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { MDBCardBody, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { useEffect } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import InputCommon from '../../component/InputFields/InputCommon';
// import ConfirmationAlert2 from '../../../component/Alerts/ConfirmationAlert2';
import Loader from '../../component/Loader/Loader';
import AutoComplete from '../../component/AutoComplete/AutoComplete';
import { secondaryColor, thirdColor } from '../../config/config';
import { useAlert } from '../../component/Alerts/AlertContext';
// import { ItemSelectionPopup } from './ItemSelectionPopup';



const InspBodyTable = ({ fields, tableData, settableData, Batch, setBatch, preview = false, language = "english", languageId = 1, typeName }) => {

    const { showAlert } = useAlert();

    const [activeRowIndex, setActiveRowIndex] = useState(null);
    const [loading, setloading] = useState(false)




    //Bifurcation states
    const [bifurcationPopupOpen, setBifurcationPopupOpen] = useState(false);
    const [selectedHeader, setSelectedHeader] = useState('');



    const [canFocus, setCanFocus] = useState(true);

    const cellStyle = useMemo(() => ({
        padding: "0px",
        paddingLeft: "4px",
        border: "1px solid #ddd",
        fontWeight: "600",
        fontSize: "14px",

        paddingTop: "0px",
        paddingBottom: "0px",
    }), []);

    const headerCellStyle = useMemo(() => ({
        padding: "0px",
        paddingLeft: "4px",
        border: "1px solid #ddd",
        fontWeight: "600",
        font: "14px",
        backgroundColor: secondaryColor,
        color: "white",
        paddingTop: "3px",
        paddingBottom: "3px",
        textAlign:'center'
    }), [

    ]);

    const bodyCell = useMemo(() => ({
        ...cellStyle,
        minWidth: "100px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    }), [cellStyle]);




    const rowClick = (index) => {
        // if(!formData.language_Name){
        //   showAlert("info","Choose language")
        //   return
        // }
        setActiveRowIndex(index)
    }








    // const handleRowChange = (index, field, data) => {
    //     console.log('field', field);

    //     if (preview) {
    //         return;
    //     }

    //     const fieldName = field.FieldName;

    //     settableData(prevRows => {
    //         const updatedRows = [...prevRows];
    //         console.log('upd', updatedRows);

    //         if (field.FieldDisplayType === "check type") {
    //             const checkValues = ['s', 'ns', 'na', 'se'];

    //             let newArray = updatedRows.find(item => item.Name === typeName);

    //             const Data1 = [...newArray.Data];

    //             // Check if field.FieldName is in checkValues
    //             if (checkValues.includes(fieldName)) {
    //                 // Set the selected field to the provided data
    //                 Data1[index] = {
    //                     ...Data1[index],
    //                     [fieldName]: data
    //                 };

    //                 // Set all other fields in checkValues to 0
    //                 checkValues.forEach(key => {
    //                     if (key !== fieldName) {
    //                         Data1[index][key] = 0; // Set value to 0 for other keys
    //                     }
    //                 });
    //             } else {
    //                 // Set default values for all keys in checkValues to 0 if not already present
    //                 checkValues.forEach(key => {
    //                     if (!(key in Data1[index])) {
    //                         Data1[index][key] = 0;
    //                     }
    //                 });
    //             }

    //             newArray = {
    //                 ...newArray,
    //                 Data: Data1
    //             };

    //             const typeIndex = updatedRows.findIndex(item => item.Name === typeName);
    //             updatedRows[typeIndex] = {
    //                 ...newArray
    //             };
    //         } 
    //          else if (data) {
    //             const { name, value } = data;

    //             let newArray = updatedRows.find(item => item.Name === typeName);
    //             const Data1 = [...newArray.Data];
    //             Data1[index] = {
    //                 ...Data1[index],
    //                 [name]: value
    //             };

    //             newArray = {
    //                 ...newArray,
    //                 Data: Data1
    //             };

    //             const typeIndex = updatedRows.findIndex(item => item.Name === typeName);
    //             updatedRows[typeIndex] = {
    //                 ...newArray
    //             };
    //         }

    //         return updatedRows;
    //     });
    // };


    const handleRowChange = (index, field, data) => {
        
        
        if (preview) {
            return
        }

        const fieldName = field.FieldName;

        settableData(prevRows => {
            const updatedRows = [...prevRows];

            // if (field.FieldDisplayType == "risk") {
                
            //     let newArray = updatedRows.find((item)=>item.Name === typeName)
                
            //     const Data1 = [...newArray.items]
            //     Data1[index] = {
            //         ...Data1[index],
            //         [field.FieldName]: data
            //     };
            //     newArray = {
            //         ...newArray,
            //         items:Data1
            //     }
            //     let typeIndex = updatedRows.findIndex((item)=>item.Name === typeName)
            //     updatedRows[typeIndex] = {
            //         ...newArray
            //     };

            // }
            // else 
            if (field.FieldDisplayType == "check type"){
                let newArray = updatedRows.find((item)=>item.Category_Name === typeName)
                
                const Data1 = [...newArray.Items]
                Data1[index] = {
                    ...Data1[index],
                    [field.FieldName]: data
                };
                newArray = {
                    ...newArray,
                    Items:Data1
                }
                let typeIndex = updatedRows.findIndex((item)=>item.Category_Name === typeName)
                updatedRows[typeIndex] = {
                    ...newArray
                };
            }
            else if (data) {
                
                const { name, value } = data

                let newArray = updatedRows.find((item)=>item.Category_Name === typeName)
                const Data1 = [...newArray.Items]
                Data1[index] = {
                    ...Data1[index],
                    [name]: value
                };
                newArray = {
                    ...newArray,
                    Items:Data1
                }
                
                let typeIndex = updatedRows.findIndex((item)=>item.Category_Name === typeName)
                updatedRows[typeIndex] = {
                    ...newArray
                };

            }
            return updatedRows;
            
            
        });
    };
    const validateFormData = () => {


        // Filter out tableData where both field and caption are empty
        const filteredRows = tableData.filter(row => row.field !== 0 && row.caption !== '' && row.width !== 0);

        const missingFieldRows = tableData.filter(row => (row.field == 0) || (!row.field));
        const missingCaptionRows = tableData.filter(row => row.caption === '');
        const missingWidthRows = tableData.filter(row => row.width === 0);
        // Show specific alerts based on the missing conditions
        if (missingFieldRows.length > 0) {
            showAlert('info', "Some tableData are missing the 'field' value.");
            return false;
        }

        if (missingCaptionRows.length > 0) {
            showAlert('info', "Some tableData are missing the 'caption' value.");
            return false;
        }

        if (missingWidthRows.length > 0) {
            showAlert('info', "Some tableData are missing the 'width' value.");
            return false;
        }
        // If no valid tableData remain after filtering, handle that scenario
        if (filteredRows.length === 0) {
            showAlert('info', "No valid tableData to save");
            return false;
        }

        return true;
    };


    const handleHeaderClick = (header) => {


        setSelectedHeader(header);
        setBifurcationPopupOpen(true);
    };








    // After selecting items from popup
    // const handleItemsSelected = (selectedItems) => {
    //   setItemPopupOpen(false);
    //   // Insert one new row per selected item at the end of tableData
    //   settableData(prevRows => {
    //     const updatedRows = [...prevRows];
    //     selectedItems.forEach(item => {
    //       const newRow = createNewRow();
    //       // Set the Item field with item.Id and Item_Name with item.Name
    //       newRow["Item"] = item.Id;
    //       newRow["Item_Name"] = item.Name;
    //       updatedRows.push(newRow);
    //     });
    //     return updatedRows;
    //   });
    // };



    useEffect(() => {

        if (canFocus == false) {



            setCanFocus(true)
        }
    }, [document.activeElement])


    const sortedFields = useMemo(() => {
        return fields.slice().sort((a, b) => a.FieldOrder - b.FieldOrder);
    }, [fields]);
    return (

        <Box sx={{
            // opacity: preview ? 0.5 : 1,
            pointerEvents: preview ? 'none' : 'auto', 
            overflowY:'auto'
        }}>



            <>
                <Loader loader={loading} />
                {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>

                    <Tooltip title="Delete Selected Rows">
                        <IconButton sx={{ fontSize: "16px" }} onClick={handleDeleteSelectedRows} color="error">
                            <MDBIcon fas icon="trash" />
                        </IconButton>
                    </Tooltip>

                </Box> */}

                <Box
                    sx={{
                        maxHeight: "320px",
                        // minHeight: "200px",
                        overflow: "auto",
                        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // More pronounced shadow for light mode
                        "&:hover": {
                            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // Stronger shadow on hover for light mode
                        },
                        scrollbarWidth: "thin",
                        width: "auto",

                    }}

                >
                    <TableContainer
                        component={Paper}
                        sx={{
                            maxHeight: "300px",
                            // minHeight: "200px",
                            scrollbarWidth: "thin",
                            padding: "0px",
                            // width: "fit-content",
                            overflowY: "auto",

                        }}

                    >
                        <Table stickyHeader >
                            <TableHead >
                                <TableRow >

                                    {!preview && <TableCell sx={{ ...headerCellStyle, minWidth: "50px" }}> SI no</TableCell>}
                                    {sortedFields.map((field, idx) => {
                                        // const isClickable = inputConfig?.bBifurcation? field.FieldName=="AddCharge" : false;
                                        const isClickable = field?.FieldName == "AddCharge" ? true : false;
                                        return (
                                            <TableCell onClick={() => isClickable && handleHeaderClick(field.FieldName)} key={idx} sx={{ ...headerCellStyle, minWidth: "100px" }}>
                                                {field.Caption}
                                            </TableCell>
                                        )
                                    })}

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row, index) => (
                                    <MemoizedTableRow
                                        key={index}
                                        row={row}
                                        index={index}
                                        rowClick={rowClick}
                                        handleRowChange={handleRowChange}
                                        bodyCell={bodyCell}
                                        tableData={tableData}
                                        fields={sortedFields}
                                        showAlert={showAlert}
                                        language={language}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </>
            {/* {itemPopupOpen &&
          <ItemSelectionPopup
        open={itemPopupOpen}
        onClose={handleClosePopup}
        onSelect={handleItemsSelected}
        allowMultipleSelection={itemPopupRowIndex === tableData.length - 1}
        
      />
    } */}

        </Box>

    );
};
export default InspBodyTable;

const MemoizedTableRow = ({ row, index, rowClick, handleRowChange, bodyCell, fields, language, Batch, showAlert, }) => {


    const radioButtonStyle = {
        "& .MuiSvgIcon-root": {
            fontSize: 14,
            color: '#26668b'
        },
        "& .MuiFormControlLabel-label": {
            fontSize: 12, // Adjust the label font size as needed
        },
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [showIcons, setShowIcons] = useState(false);

    //Batch
    const [batchPopupOpen, setBatchPopupOpen] = useState(false);
    const [currentRowIndex, setCurrentRowIndex] = useState(null);
    const [selectedBatchData, setSelectedBatchData] = useState([])
    const [selectedQuantity, setSelectedQuantity] = useState(null)
    const [selectedIsino, setselectedIsino] = useState(null)



    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMouseEnter = () => {
        setShowIcons(true);
    };

    const handleMouseLeave = () => {
        setShowIcons(false);
    };

    const isMenuOpen = Boolean(anchorEl);

    //#region batch row
    const handleBatchClick = (rowIndex) => {
        if (!row.Quantity > 0) {


            showAlert("info", "Enter quntity")

            return

        }


        const selectedBatch = Batch.filter(batch => batch.iSiNo === row.iSiNo);
        setCurrentRowIndex(rowIndex);
        setBatchPopupOpen(true);
        setSelectedBatchData(selectedBatch);
        setSelectedQuantity(row.fQty);
        setselectedIsino(row.iSiNo)
    };












    const handleBlur = () => {
        setTimeout(() => {
            if (ref.current && !ref.current.contains(document.activeElement)) {
                rowClick(0);
            }
        }, 0);
    };
    const handleChange = (e) => {
        const updatedValue = { ...value }; // Ensure `value` is treated as an object
        updatedValue[fieldName] = e.target.checked; // Update the specific field
        changeValue(updatedValue); // Pass the updated object to the parent
    };

    const renderCellContent = (field, index) => {
        const fieldValue = row[field.FieldName];

        switch ((field?.FieldDisplayType)?.toLowerCase()) {
            case 'text box':
                return (
                    <InputCommon
                        value={fieldValue}
                        name={field.FieldName}
                        setValue={(data) => handleRowChange(index, field, data)}
                        languageName={language}
                        key={field?.FieldName}
                        mandatory={field?.Mandatory}

                        // disabled={disabledDetailed || field?.ReadOnly || false}
                        type={field?.FieldType.toLowerCase()}
                        maxLength={field?.MaxSize}
                        AllowNegative={field?.Negative ?? true}
                        DefaultValue={field?.DefaultValue}
                        ErrorMessage={field?.ErrorMessage}
                        // onBlur={(data) => handleOnBlur(field?.FieldName, data)}
                        ColumnSpan={field?.ColumnSpan}
                        RowSpan={field?.RowSpan}
                        multiline={field?.RowSpan > 1 ? true : null}
                        CharacterCasing={field?.CharacterCasing ?? 0}
                        RegularExpression={field?.RegularExpression}
                        dateType={field?.AllowDate}
                        DonotAllowSpecialChar={field?.DonotAllowSpecialChar}
                        tableField={true}
                        fullwidth={'100%'}


                    />
                );


            case "check type":

                return (
                    <Box
                            sx={{
                              cursor: "pointer",
                              border: "1px solid #ccc",
                              padding: "0px",
                              borderRadius: "4px",
                              display:'flex',
                              justifyContent:'center',
                              width: field.RowSpan ? `${250 * field.RowSpan}px` : "100%",
                              minWidth:field.RowSpan ? `${250 * field.RowSpan}px` : "250px"
                            }}
                          >
                            <FormControl>
                              <RadioGroup
                                row
                                aria-labelledby="risk-radio-group-label"
                                name={`${field.FieldName}-radio-group`}
                              >
                                <FormControlLabel
                                  value="S"
                                  control={<Radio />}
                                  label="S"
                                  sx={radioButtonStyle}
                                  checked={row[field.FieldName] === 1}
                                  onChange={() => handleRowChange(index, field, 1)} // Pass updated value
                                />
                                <FormControlLabel
                                  value="NS"
                                  control={<Radio />}
                                  label="NS"
                                  sx={radioButtonStyle}
                                  checked={row[field.FieldName] === 2}
                                  onChange={() => handleRowChange(index, field, 2)} // Pass updated value
                                />
                                <FormControlLabel
                                  value="NA"
                                  control={<Radio />}
                                  label="NA"
                                  sx={radioButtonStyle}
                                  checked={row[field.FieldName] === 3}
                                  onChange={() => handleRowChange(index, field, 3)} // Pass updated value
                                />
                                <FormControlLabel
                                  value="SE"
                                  control={<Radio />}
                                  label="SE"
                                  sx={radioButtonStyle}
                                  checked={row[field.FieldName] === 4}
                                  onChange={() => handleRowChange(index, field, 4)} // Pass updated value
                                />
                              </RadioGroup>
                            </FormControl>
                          </Box>
                );



            case 'cell':

                return (
                    <Box
                        sx={{

                            border: "1px solid #ccc",
                            padding: "5px",
                            borderRadius: "4px",
                            display: 'flex',
                            justifyContent: 'start',
                            width: field.RowSpan ? `${250 * field.RowSpan}px` : "100%",
                        }}
                    >
                        <Typography sx={{ fontSize: '14px' }}>{row.Name}</Typography>

                    </Box>
                )

            default:
                return null;
        }


    };


    return (
        <TableRow
            sx={{ height: "30px", padding: "0px" }}
            onClick={() => rowClick(index)}
            onFocus={() => rowClick(index)}
            //onMouseEnter={() => rowClick(index)}  // Add this line

            onMouseLeave={handleMenuClose}


        >
            {/* Checkbox column */}
            {/* <TableCell sx={{ ...bodyCell, minWidth: "30px", paddingLeft: "0px", textAlign: "center", width: "30px" }}>
                <Checkbox
                    checked={row.selected || false}
                    onChange={(e) => handleSelectRow(index, e.target.checked)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            // Toggle the checkbox value when Enter is pressed
                            handleSelectRow(index, !row.selected);
                        }
                    }}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{ padding: 0, width: "20px", transform: "scale(0.7)", }}
                    color="default" />
            </TableCell> */}
            <TableCell
                sx={{ ...bodyCell, minWidth: "30px", textAlign: "left", paddingLeft: "10px", width: "50px", position: "relative" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {index + 1}

            </TableCell>

            {fields.map((field, idx) => (
                <TableCell key={idx} sx={{ ...bodyCell, paddingLeft: "0px" }}>
                    {renderCellContent(field, index)}
                </TableCell>
            ))}

        </TableRow>

    );
};





