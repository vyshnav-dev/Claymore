import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { profileDateFields, rowsPerSheet } from '../../config/config';

const ExcelExport = async ({ reportName, filteredRows, excludedFields}) => {

    //for local time in dd-mm-yyyy format
    const formatDate = (dateString) => {
        
        if (!dateString) return ""; // Return an empty string for null or undefined values
        const date = new Date(dateString);
        if (isNaN(date)) return dateString; // If date is invalid, return the original string
      
        // Convert to local time
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      
        const day = String(localDate.getDate()).padStart(2, "0");
        const month = String(localDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
        const year = localDate.getFullYear();
        
        return `${day}-${month}-${year}`;
      };
      
  function columnIndexToLetter(columnIndex) {
    let columnLetter = '';
    while (columnIndex > 0) {
      let remainder = (columnIndex - 1) % 26;
      columnLetter = String.fromCharCode(65 + remainder) + columnLetter;
      columnIndex = parseInt((columnIndex - remainder) / 26, 10);
    }
    return columnLetter;
  }

  let sheet = null;
  let currentRowCount = 0;
  let sheetNumber = 0; // To increment sheet names if necessary

  // Create a new ExcelJS workbook
  const workbook = new ExcelJS.Workbook();

  // Add a sheet for the data
  const createNewSheet = () => {
    sheetNumber++;
    sheet = workbook.addWorksheet(`${reportName} - ${sheetNumber}`);
    currentRowCount = 0; // Reset row count for the new sheet


    const headers = Object.keys(filteredRows[0] || {}).filter(header => !excludedFields.includes(header));
    headers.forEach((header, index) => {
      sheet.getColumn(index + 1).width = 25;
    });
    const lastColumnLetter = columnIndexToLetter(headers.length);
    // Add the first two rows as in the image
    sheet.addRow([reportName]);
    sheet.mergeCells(`A1:${lastColumnLetter}1`); // Merge cells for the title row
    sheet.getCell('A1').font = { size: 18, bold: true }; // Style the title row
    sheet.getCell('A1').alignment = { horizontal: 'left' };

    // Style the headers
    const headerRow = sheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
    });
    currentRowCount++;
  };

  createNewSheet();

 // Add the data
 filteredRows.forEach((row) => {
    if (currentRowCount >= rowsPerSheet) {
      createNewSheet();
    }
    const rowData = Object.keys(filteredRows[0])
      .filter(header => !excludedFields.includes(header))
      .map((header) => profileDateFields.includes(header) ? formatDate(row[header]) : row[header]) || '';
    sheet.addRow(rowData);
    currentRowCount++;
  });

  // Write to a buffer and then save using FileSaver
  const formatDateTimeForFilename = () => {
    const now = new Date();
    let day = '' + now.getDate();
    let month = '' + (now.getMonth() + 1);
    const year = now.getFullYear();
    let hours = '' + now.getHours();
    let minutes = '' + now.getMinutes();
    let seconds = '' + now.getSeconds();

    if (day.length < 2) day = '0' + day;
    if (month.length < 2) month = '0' + month;
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (seconds.length < 2) seconds = '0' + seconds;

    return [day, month, year].join('-') + '_' + [hours, minutes, seconds].join('-');
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const dateTimeStringForFilename = formatDateTimeForFilename();
  saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${reportName}_${dateTimeStringForFilename}.xlsx`);
};

export default ExcelExport;
