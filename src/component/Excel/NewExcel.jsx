import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const borderStyle = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

const ExcelExport = async ({ reportName, data }) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('RFQ');

  // === Set column widths ===
  worksheet.columns = [
    { width: 6 }, { width: 20 }, { width: 30 }, { width: 20 }, { width: 15 },
    { width: 15 }, { width: 20 }, { width: 25 }, { width: 15 }, { width: 20 },
    { width: 20 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 },
    { width: 20 }, { width: 20 }, { width: 20 }
  ];

  worksheet.mergeCells('B2:D2');
  const logoCell = worksheet.getCell('B2');
  logoCell.value = 'LOGO\n';
  logoCell.font = { size: 18, bold: true };
  logoCell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' };
  worksheet.getRow(2).height = 100;



  // === REQUEST FOR QUOTATION ===
  worksheet.mergeCells('K2:P2');
  const titleCell = worksheet.getCell('K2');
  titleCell.value = 'REQUEST FOR QUOTATION';
  titleCell.font = { size: 18, bold: true };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // === Vendor Info ===
  const vendorFields = [
    ['Vendor Name', data.vendor.name],
    ['Address', data.vendor.address[0] || ''],
    ['Address', data.vendor.address[1] || ''],
    ['Address', data.vendor.address[2] || ''],
    ['Phone', data.vendor.phone],
    ['Email', data.vendor.email],
    ['Vendor Document Ref', data.vendor.documentRef]
  ];
  const vendorValues = [
    data.vendor.name,
    data.vendor.address[0] || '',
    data.vendor.address[1] || '',
    data.vendor.address[2] || '',
    data.vendor.phone,
    data.vendor.email,
    data.vendor.documentRef
  ];

  vendorFields.forEach(([label, val], i) => {
    const row = 3 + i;
    worksheet.getCell(`B${row}`).value = label;
    worksheet.getCell(`B${row}`).font = { bold: true };
    worksheet.getCell(`B${row}`).border = borderStyle;

    const inputCell = worksheet.getCell(`C${row}`);
    inputCell.value = val;
    inputCell.border = borderStyle;
  });


  // === RFQ Info ===
  const rfqValues = [
    ['Date', data.rfq.date],
    ['RFQ Number', data.rfq.rfqNumber],
    ['Submission Deadline', data.rfq.deadline],
    ['Delivery Location', data.rfq.deliveryLocation],
    ['Delivery Timeline', data.rfq.deliveryTimeline],
    ['Currency', data.rfq.currency]
  ];

  rfqValues.forEach(([label, val], i) => {
    const row = 3 + i;
    worksheet.getCell(`G${row}`).value = label;
    worksheet.getCell(`G${row}`).font = { bold: true };
    worksheet.getCell(`G${row}`).border = borderStyle;

    const inputCell = worksheet.getCell(`H${row}`);
    inputCell.value = val;
    inputCell.border = borderStyle;
  });


  worksheet.getCell('P4').value = 'Input for Vendor';

  worksheet.getCell('P4').border = borderStyle;

  // === Table Header Row ===
  const headers = [
    'No', 'Item', 'Part No', 'Description', 'Manufacturer', 'Model', 'Type',
    'UOM', 'Required Quantity', 'Offered Qty', 'Unit Price', 'Gross Value',
    'Attachment', 'Comments', 'Remarks by Vendor'
  ];
  const tableHeaderRow = worksheet.getRow(9);
  headers.forEach((header, i) => {
    const cell = tableHeaderRow.getCell(i + 2);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F4F4F' }
    };
    cell.border = borderStyle;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // === Table Rows (with yellow input columns) ===
  data.items.forEach((item, idx) => {
    const rowIdx = 10 + idx;
    const row = worksheet.getRow(rowIdx);
    const values = [
      idx + 1,
      item.item,
      item.partNo,
      item.description,
      item.manufacturer,
      item.model,
      item.type,
      item.uom,
      item.requiredQty,
      item.offeredQty,
      item.unitPrice,
      item.unitPrice * item.offeredQty,
      item.attachment,
      item.comments,
      item.vendorRemarks
    ];
    values.forEach((val, colIdx) => {
      const cell = row.getCell(colIdx + 2);
      cell.value = val;
      cell.border = borderStyle;
      if ([10, 11, 12].includes(colIdx + 2)) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00' } // Yellow for inputs
        };
      }
    });
  });


  // === COMMERCIAL TERMS Section ===
  const startingTableRow = 11; // or wherever your table starts
  const dataRows = data.items.length; // assuming tableData is your table's data array

  const tableEndRow = startingTableRow + dataRows; // end row of table
  const gap = 2; // number of blank rows
  const sectionStartRow = tableEndRow + gap; // start COMMERCIAL TERMS two rows below table

  // === COMMERCIAL TERMS Section ===
  worksheet.getCell(`B${sectionStartRow}`).value = 'COMMERCIAL TERMS BY VENDOR';
  worksheet.getCell(`B${sectionStartRow}`).font = { bold: true, size: 16 };

  const terms = [
    ['Payment Terms', data.commercial.paymentTerms],
    ['Warranty Terms', data.commercial.warrantyTerms],
    ['Incoterms', data.commercial.incoterms],
    ['Delivery Address Considered', data.commercial.deliveryAddressConsidered],
    ['Other Details', data.commercial.otherDetails]
  ];

  

  terms.forEach(([label, val], i) => {
    const row = sectionStartRow + 1 + i;
    worksheet.getCell(`B${row}`).value = label;
    worksheet.getCell(`B${row}`).font = { bold: true };

    const inputCell = worksheet.getCell(`D${row}`);
    inputCell.value = val
    inputCell.border = borderStyle;
  });

  // === Totals Table Section ===
  const totals = [['Gross Value', data.totals.grossValue],
  ['Tax Rate', data.totals.taxRate],
  ['Tax', data.totals.tax],
  ['Shipping & Handling', data.totals.shippingHandling],
  ['Other', data.totals.other],
  ['Net Value', data.totals.netValue]
  ];
  

  totals.forEach(([label, val], i) => {
    const row = sectionStartRow + 1 + i;
    const labelCell = worksheet.getCell(`J${row}`);
    labelCell.value = label;
    labelCell.font = { bold: true };
    labelCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFBFBFBF' }
    };
    labelCell.border = borderStyle;

    const valueCell = worksheet.getCell(`K${row}`);
    valueCell.value = val;
    valueCell.border = borderStyle;

    // worksheet.getCell(`L${row}`).border = borderStyle;
  });

  // === Bottom yellow bar ===
  worksheet.mergeCells(`B${sectionStartRow + 7}:R${sectionStartRow + 7}`);

  // === Footer address line ===
  worksheet.mergeCells(`B${sectionStartRow + 11}:R${sectionStartRow + 11}`);
  worksheet.getCell(`B${sectionStartRow + 11}`).value = 'Company Address, Phone No, Email Address, Website';
  worksheet.getCell(`B${sectionStartRow + 11}`).alignment = { horizontal: 'center' };


  // === Export File ===
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(blob, `${reportName || 'RFQ_Template'}.xlsx`);
};

export default ExcelExport;
