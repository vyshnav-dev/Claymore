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

    
    const [loading, setloading] = useState(false)



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




    const handleRowChange = (index, field, data) => {
        
        
        if (preview) {
            return
        }

        const fieldName = field.FieldName;

        settableData(prevRows => {
            const updatedRows = [...prevRows];

             
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
                            width:"fit-Content"

                        }}

                    >
                        <Table stickyHeader >
                            <TableHead >
                                <TableRow >

                                    {!preview && <TableCell sx={{ ...headerCellStyle, minWidth: "50px" }}> SI no</TableCell>}
                                    {sortedFields.map((field, idx) => {
                                        
                                        return (
                                            <TableCell  key={idx} sx={{ ...headerCellStyle, minWidth: "100px",maxWidth: "fit-Content" }}>
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
                                        handleRowChange={handleRowChange}
                                        bodyCell={bodyCell}
                                        tableData={tableData}
                                        fields={sortedFields}
                                        language={language}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </>
            

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
                        // fullwidth={'100%'}
                        width={330}


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
                            width:"800px",
                            maxWidth:  "800px",
                            overflowY: 'auto',
                            scrollbarWidth:'none'
                        }}
                    >
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
                        <Tooltip title={row.Name}  disableHoverListener={row.Name.length <= 110}>
                        <Typography sx={{ fontSize: '14px' }}>{row.Name}</Typography>
                        </Tooltip>
                        </label>
                    </Box>
                )

            default:
                return null;
        }


    };


    return (
        <TableRow
            sx={{ height: "30px", padding: "0px" }}


        >
            <TableCell
                sx={{ ...bodyCell, minWidth: "30px", textAlign: "left", paddingLeft: "10px", width: "50px", position: "relative" }}
                
            >
                {row.SlNo}

            </TableCell>

            {fields.map((field, idx) => (
                <TableCell key={idx} sx={{ ...bodyCell, paddingLeft: "0px",maxWidth: "fit-Content" }}>
                    {renderCellContent(field, index)}
                </TableCell>
            ))}

        </TableRow>

    );
};





