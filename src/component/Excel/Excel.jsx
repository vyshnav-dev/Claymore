import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { profileDateFields, rowsPerSheet, transactionDateTimeFields, reportDateFields } from '../../config/config';

const formDataSheetborderStyle = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

const setTextAndFormatCell = (cell, text, isHeader = false) => {
  let cleanedText = text.toString().replace(/(\r\n|\n|\r)/gm, "");
  if (isHeader) {
    cleanedText = cleanedText
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  cell.value = cleanedText;
  cell.alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "left",
  };
  if (isHeader) {
    cell.font = { bold: true };
  }
};

const ExcelExport = async ({ reportName, filteredRows, excludedFields, filteredHeader, excelCoverData }) => {
  // Date formatting functions remain the same
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const day = String(localDate.getDate()).padStart(2, "0");
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const year = localDate.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const convertToLocaleDateTimeString = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const day = String(localDateTime.getDate()).padStart(2, "0");
    const month = String(localDateTime.getMonth() + 1).padStart(2, "0");
    const year = localDateTime.getFullYear();
    const hours = String(localDateTime.getHours()).padStart(2, "0");
    const minutes = String(localDateTime.getMinutes()).padStart(2, "0");
    const seconds = String(localDateTime.getSeconds()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
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

  // Create a new ExcelJS workbook
  const workbook = new ExcelJS.Workbook();

  // Only create header report sheet if filteredHeader exists
  if (filteredHeader) {
    const formDataSheet = workbook.addWorksheet("Header Report");
    
    // Add header information
    formDataSheet.addRow(["JobOrder No", filteredHeader?.JobOrderNo]);
    formDataSheet.addRow(["Client", filteredHeader?.Client]);
    formDataSheet.addRow(["Location", filteredHeader?.Location]);
    formDataSheet.addRow(["Date Of Allocation", formatDate(filteredHeader?.DateOfAllocation)]);
    formDataSheet.addRow(["Ack Submitted Date", formatDate(filteredHeader?.AckSubmittedDate)]);
    formDataSheet.addRow(["Total Qty", filteredHeader?.TotalQty]);
    formDataSheet.addRow(["Suspended Qty", filteredHeader?.SuspendedQty]);
    formDataSheet.addRow(["Approved Qty", filteredHeader?.ApprovedQty]);
    formDataSheet.addRow(["Rejected Qty", filteredHeader?.RejectedQty]);
    formDataSheet.addRow(["Pending Qty", filteredHeader?.PendingQty]);
    formDataSheet.addRow([]); // Add empty row

    // Apply borders to all cells
    formDataSheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = formDataSheetborderStyle;
      });
    });

    // Add Technician data if excelCoverData exists
    if (excelCoverData && excelCoverData.length > 0) {
      const headerRow = formDataSheet.addRow(["Technician"]);
      headerRow.eachCell((cell) => {
        setTextAndFormatCell(cell, cell.value, true);
        cell.border = formDataSheetborderStyle;
      });

      excelCoverData.forEach((item) => {
        const row = formDataSheet.addRow([item.Technician]);
        row.eachCell((cell) => {
          setTextAndFormatCell(cell, cell.value);
          cell.alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true,
          };
          cell.border = {
            left: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" }
          };
          cell.font = { bold: false };
        });
      });
    }

    // Style the first column (A1 to A11)
    for (let row = 1; row <= 11; row++) {
      formDataSheet.getCell(`A${row}`).font = { size: 12, bold: true };
      formDataSheet.getCell(`A${row}`).alignment = { horizontal: "left" };
    }

    // Set column widths
    const setColumnWidths = (worksheet) => {
      worksheet.columns.forEach((column) => {
        let maxWidth = 10;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellLength = cell.value ? cell.value.toString().length : 0;
          maxWidth = Math.max(maxWidth, cellLength);
        });
        column.width = maxWidth + 2;
      });
    };
    setColumnWidths(formDataSheet);
  }

  // Main data sheet creation
  let sheet = null;
  let currentRowCount = 0;
  let sheetNumber = 0;

  const createNewSheet = () => {
    sheetNumber++;
    sheet = workbook.addWorksheet(`${reportName} - ${sheetNumber}`);
    currentRowCount = 0;

    const headers = Object.keys(filteredRows[0] || {}).filter(header => !excludedFields.includes(header));
    headers.forEach((header, index) => {
      sheet.getColumn(index + 1).width = 25;
    });
    
    const lastColumnLetter = columnIndexToLetter(headers.length);
    
    // Add title row
    sheet.addRow([reportName]);
    sheet.mergeCells(`A1:${lastColumnLetter}1`);
    sheet.getCell('A1').font = { size: 18, bold: true };
    sheet.getCell('A1').alignment = { horizontal: 'left' };

    // Add headers row
    const headerRow = sheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
    });
    currentRowCount++;
  };

  createNewSheet();

  // Add data rows
  filteredRows.forEach((row) => {
    if (currentRowCount > rowsPerSheet) {
      createNewSheet();
    }
    const rowData = Object.keys(filteredRows[0])
      .filter(header => !excludedFields.includes(header))
      .map((header) => {
        if (profileDateFields.includes(header)) {
          return formatDate(row[header]);
        } else if (transactionDateTimeFields.includes(header)) {
          return convertToLocaleDateTimeString(row[header]);
        } else if (reportDateFields.includes(header)) {
          return formatDate(row[header]);
        } else {
          return row[header];
        }
      }) || '';
    sheet.addRow(rowData);
    currentRowCount++;
  });

  // Save the workbook
  const formatDateTimeForFilename = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return [day, month, year].join('-') + '_' + [hours, minutes, seconds].join('-');
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const dateTimeStringForFilename = formatDateTimeForFilename();
  saveAs(
    new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    `${reportName}_${dateTimeStringForFilename}.xlsx`
  );
};

export default ExcelExport;