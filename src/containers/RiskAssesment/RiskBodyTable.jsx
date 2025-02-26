import React, { useState, useCallback, useMemo } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Stack, Popover, Checkbox, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import InputCommon from '../../component/InputFields/InputCommon';
import Loader from '../../component/Loader/Loader';
import { secondaryColor } from '../../config/config';



const RiskBodyTable = ({ fields, tableData, settableData, preview = false, language = "english", languageId = 1, typeName }) => {

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
    }), [

    ]);

    const bodyCell = useMemo(() => ({
        ...cellStyle,
        // minWidth: "100px",
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

            if (field.FieldDisplayType == "risk") {

                let newArray = updatedRows.find((item) => item.Name === typeName)

                const Data1 = [...newArray.Items]
                Data1[index] = {
                    ...Data1[index],
                    [field.FieldName]: data
                };
                newArray = {
                    ...newArray,
                    Items: Data1
                }
                let typeIndex = updatedRows.findIndex((item) => item.Name === typeName)
                updatedRows[typeIndex] = {
                    ...newArray
                };

            }
            else if (field.FieldDisplayType == "level") {
                let newArray = updatedRows.find((item) => item.Name === typeName)

                const Data1 = [...newArray.Items]
                Data1[index] = {
                    ...Data1[index],
                    [field.FieldName]: data
                };
                newArray = {
                    ...newArray,
                    Items: Data1
                }
                let typeIndex = updatedRows.findIndex((item) => item.Name === typeName)
                updatedRows[typeIndex] = {
                    ...newArray
                };
            }
            else if (data) {

                const { name, value } = data

                let newArray = updatedRows.find((item) => item.Name === typeName)
                const Data1 = [...newArray.Items]
                Data1[index] = {
                    ...Data1[index],
                    [name]: value
                };
                newArray = {
                    ...newArray,
                    Items: Data1
                }

                let typeIndex = updatedRows.findIndex((item) => item.Name === typeName)
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
            overflowY: 'auto'
        }}>



            <>
                <Loader loader={loading} />

                <Box
                    sx={{
                        maxHeight: "320px",
                        // minHeight: "200px",
                        overflowY: "auto",
                        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // More pronounced shadow for light mode
                        "&:hover": {
                            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // Stronger shadow on hover for light mode
                        },
                        scrollbarWidth: "thin",
                        width: "auto",

                        // maxWidth: "200vh",

                    }}

                >
                    <TableContainer
                        component={Paper}
                        sx={{
                            maxHeight: "300px",
                            // minHeight: "200px",
                            scrollbarWidth: "thin",
                            padding: "0px",
                            // maxWidth: "195vh",
                            overflowY: "auto",
                            width: 'fit-Content'

                        }}

                    >
                        <Table stickyHeader >
                            <TableHead >
                                <TableRow >

                                    {!preview && <TableCell sx={{ ...headerCellStyle, minWidth: "50px" }}> SI no</TableCell>}
                                    {sortedFields.map((field, idx) => {
                                    

                                        return (
                                            <TableCell key={idx} sx={{ ...headerCellStyle, minWidth: "100px", maxWidth: "fit-Content" }}>
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
export default RiskBodyTable;

const MemoizedTableRow = ({ row, index, handleRowChange, bodyCell, fields, language, }) => {


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


            case "risk":
                if (field.FieldName === "RiskData") {

                    return (
                        <Box
                            sx={{
                                cursor: "pointer",
                                border: "1px solid #ccc",
                                padding: "0px",
                                borderRadius: "4px",
                                display: 'flex',
                                justifyContent: 'center',
                                width: field.RowSpan ? `${250 * field.RowSpan}px` : "100%",
                                minWidth: field.RowSpan ? `${250 * field.RowSpan}px` : "150px"
                            }}
                        >
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="risk-radio-group-label"
                                    name={`${field.FieldName}-radio-group`}
                                >
                                    <FormControlLabel
                                        value={true}
                                        control={<Radio />}
                                        label="Yes"
                                        sx={radioButtonStyle}
                                        checked={row[field.FieldName] === true}
                                        onChange={() => handleRowChange(index, field, true)} // Pass updated value
                                    />
                                    <FormControlLabel
                                        value={false}
                                        control={<Radio />}
                                        label="No"
                                        sx={radioButtonStyle}
                                        checked={row[field.FieldName] === false}
                                        onChange={() => handleRowChange(index, field, false)} // Pass updated value
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    );
                }

            case "level":
                return (
                    <Box
                        sx={{
                            cursor: "pointer",
                            border: "1px solid #ccc",
                            padding: "0px",
                            borderRadius: "4px",
                            display: 'flex',
                            justifyContent: 'center',
                            width: field.RowSpan ? `${250 * field.RowSpan}px` : "100%",
                            minWidth: field.RowSpan ? `${250 * field.RowSpan}px` : "250px"
                        }}
                    >
                        <FormControl disabled={row['RiskData'] == false}>
                            <RadioGroup
                                row
                                aria-labelledby="risk-radio-group-label"
                                name={`${field.FieldName}-radio-group`}
                            >
                                <FormControlLabel
                                    value="high"
                                    control={<Radio />}
                                    label="High"
                                    sx={radioButtonStyle}
                                    checked={row[field.FieldName] === 1}
                                    onChange={() => handleRowChange(index, field, 1)} // Pass updated value
                                />
                                <FormControlLabel
                                    value="medium"
                                    control={<Radio />}
                                    label="Medium"
                                    sx={radioButtonStyle}
                                    checked={row[field.FieldName] === 2}
                                    onChange={() => handleRowChange(index, field, 2)} // Pass updated value
                                />
                                <FormControlLabel
                                    value="low"
                                    control={<Radio />}
                                    label="Low"
                                    sx={radioButtonStyle}
                                    checked={row[field.FieldName] === 3}
                                    onChange={() => handleRowChange(index, field, 3)} // Pass updated value
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
                            width: "650px",
                            maxWidth: "650px",
                            overflowY: 'auto',
                            scrollbarWidth: 'none'
                        }}
                    >
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
                            <Tooltip title={row.Data_Description} disableHoverListener={row.Data_Description.length <= 100}>
                                <Typography sx={{ fontSize: '14px' }}>{row.Data_Description}</Typography>
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
                sx={{ ...bodyCell, minWidth: "fit-Content", textAlign: "left", paddingLeft: "10px", width: "50px", position: "relative" }}

            >
                {row.SlNo}

            </TableCell>

            {fields.map((field, idx) => (
                <TableCell key={idx} sx={{ ...bodyCell, paddingLeft: "0px", maxWidth: "fit-Content" }}>
                    {renderCellContent(field, index)}
                </TableCell>
            ))}

        </TableRow>

    );
};




