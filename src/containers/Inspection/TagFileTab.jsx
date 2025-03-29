import React, { useRef, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
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
} from "@mui/material";
// import { tagsApis } from "../../../../services/tags/tagsApi";
import { useEffect } from "react";
import TagAccordions from "../../component/Accordion/Accordion";

import { MDBIcon } from "mdb-react-ui-kit";
import ConfirmationAlert2 from "../../component/Alerts/ConfirmationAlert2";
import { allowedExtensionsTagAttachments,IMAGE_URL, thirdColor,secondaryColor } from "../../config/config";
import { useAlert } from "../../component/Alerts/AlertContext";
import NormalButton from "../../component/Buttons/NormalButton";
import { inspectionApis } from "../../service/Inspection/inspection";
import CloseIcon from '@mui/icons-material/Close';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

export default function TagFileTab({
  expanded,
  onChange,
  formData,
  setFormData,
  disabledDetailed,
  menuObj,
  detailPageId,
  dbTagAttachmentDetails,
  setdbTagAttachmentDetails


}) {
  const { deleteattachments} = inspectionApis();
  

  const newFileRef = useRef();

  //   const [languageData, setlanguageData] = useState({});
  const { showAlert } = useAlert();


//   const languageDatasJson = TagLanguageBasedValues[currentLanguageName?.toLowerCase()] || {};
//   const alertMessages = TagLanguageBasedValues[currentLanguageName?.toLowerCase()] || {};
 
  const [editFileIndex, seteditFileIndex] = useState(null);
  const [autoCompleteData, setautoCompleteData] = useState({});

   //-----------Confirmation Alert---------------
   const [confirmType, setConfirmType] = useState(null);
   const [confirmAlert, setConfirmAlert] = useState(false);
   const [confirmData, setConfirmData] = useState({});

   const [selectedObj, setSelectedObj] = useState(null)
   const [selectedIndex, setSelectedIndex] = useState(null)

  //  image dailog
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogImageSrc, setDialogImageSrc] = useState('');

   const handleConfrimClose = () => {
    setConfirmAlert(false);
    setConfirmData({})
    setConfirmType(null)
    setSelectedIndex(null)
    setSelectedObj(null)
  };


 
  


  const updateFileTab = (data)=>{
    setFormData((prevFormData) => ({
      ...prevFormData,
      Attachment: data
    }));
  }
  
  

  const headerCellStyle = {
    padding: "0px",
    paddingLeft: "4px",
    paddingRight: "4px",
    border: `1px solid ${thirdColor}`,
    fontWeight: "600",
    font: "14px",
    backgroundColor:secondaryColor,
    color:"white",
    paddingTop: "3px",
    paddingBottom: "3px",
    minWidth: "60px",
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
    color:secondaryColor,
  };
  const iconsExtraSx = {
    fontSize: "1rem",
    padding: "0.5rem",
    "&:hover": {
      backgroundColor: "transparent",
    },
    marginRight: 1,
  };



  

  //#region file upload

  const handleFileChange = (event) => {
    if(disabledDetailed){
      return
    }
    const file = event.target.files[0];
    
    if (file) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (allowedExtensionsTagAttachments.includes(extension)) {
      newFileRef.current = file; // Store the file in the ref
    } else {
      showAlert("info", `${"Allowed File type"} : ${allowedExtensionsTagAttachments.join(', ')}`);
      event.target.value = ''; // Clear the file input if not allowed
      newFileRef.current = null; // Clear the stored file reference
    }
    }
  };

  const handleAddFile = async () => {
    if(disabledDetailed){
      return
    }
    // if(!autoCompleteData.AttachType){
    //   showAlert("info",`${alertMessages.invalidInput} : ${dropdownField.Caption}`)
    //   return
    // }
    const fileInput = document.getElementById("masterFilesId"); // Replace with your actual file input ID
    
    

    const fileToAdd = newFileRef.current;
    const existingFile = formData?.Attachment[editFileIndex]?.FileName;

    

    let errorMessage = "";

    const formData1 = new FormData();

    try {
      if (fileToAdd || existingFile) {
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, ""); // Create a timestamp
        const todayDate = new Date()
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "");
        const nameParts = fileToAdd?.name?.split("."); // Split the file name to separate the extension
        const extension = nameParts?.pop().toLowerCase(); // Remove the last part (extension)
        const baseName = nameParts?.join("."); // Rejoin the remaining parts in case the name contained periods
        // const modifiedName = `${docType}__userId_${timestamp}.${extension}`; // Construct the modified name

        const modifiedName = `${autoCompleteData.AttachType_Name}.${extension}`;
        //   formData1.append("iType",11);
        // formData1.append("imageFiles", fileToAdd,modifiedName);
        // const response = await UploadFiles(master,formData1);

        
        const url = URL.createObjectURL(fileToAdd);
       
          const generateUniqueSLNo = () => {
            let newSLNo = formData?.Attachment.length > 0 ? Math.max(...formData?.Attachment.map(file => file.SLNo)) + 1 : 1;
            // Ensure SLNo does not already exist
            while (formData?.Attachment.some(file => file.SLNo === newSLNo)) {
              newSLNo++; // Increment SLNo until it is unique
            }
            return newSLNo;
          };
          const newSLNo = generateUniqueSLNo();
          
          const updatedFile= [
            ...formData?.Attachment,
            {
              FileName: fileToAdd?.name,
              file: fileToAdd, // Include the File object
              SLNo: newSLNo,
              FileName_Url:url
            },
          ];
          updateFileTab(updatedFile)
      
        // setFileNames(prevNames => [...prevNames, modifiedName]);
        newFileRef.current = null; // Clear the ref

        if (fileInput) {
          fileInput.value = ""; // Clear the file input field
        }

        seteditFileIndex(null);
        // setautoCompleteData({ AttachType_Name: "", AttachType: 0, RefNo: "" });
      }
    } catch (error) {
      
    }
  };
  //#endregion file upload

  //#region file download
  const formatPath = (path) => path.replace(/^\.\.\//, IMAGE_URL + "/");

  const handleDownload = (fileObj) => {
    
    if (fileObj.FileName_Url) {
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
      const fileNameParts = fileObj.FileName.split(".");
      const extension = fileNameParts[fileNameParts.length - 1].toLowerCase();
      const formattedPath = formatPath(fileObj.FileName_Url);
      
      if (imageExtensions.includes(extension)) {
        // Handle images: display in a new tab
        const htmlContent = `<html>
                               <head><title>Image Viewer</title></head>
                               <body><img src="${formattedPath}" style="max-width: 100%; height: auto;"></body>
                             </html>`;
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
      
        // It's an existing file, download it from the URL
        const link = document.createElement("a");
        link.href = formattedPath;
        link.download = fileObj.FileName;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (fileObj.file) {
      // It's a newly uploaded file, create a URL and download it
      const url = window.URL.createObjectURL(fileObj.file);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileObj.FileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }
  };
  //#endregion file download



   //#region Delete file
  //To delete
  //------------------------------------------------------------
  const deleteClick =(fileObj,index)=>{
    if(disabledDetailed){
      return
    }

    const existsIndbTagAttachmentDetails = dbTagAttachmentDetails.some((file) => file.SLNo == fileObj.SLNo);
    if (existsIndbTagAttachmentDetails && detailPageId>0) {
    setConfirmData({
      message: "Do you want to Delete",
      type: "danger",
      button: "Delete",
      title: "Delete",
      close: "Close",
    });
    setConfirmType("delete");
    setConfirmAlert(true);
    setSelectedObj(fileObj)
    setSelectedIndex(index)
    }else {
      
    const updatedFiles = formData?.Attachment.filter((_, i) => i !== index);
    updateFileTab(updatedFiles);
   
     
    }

  }
  const handledeletePhoto = async (fileObj,index) => {
    
  //   // Check if the file exists locally but not yet saved on the server (i.e., no FileName, but file exists)
  // if (!fileObj.FileName && fileObj.file) {
  //   // Just remove from the allFiles state
  //   const updatedFiles = formData?.TagAttachments.filter((_, i) => i !== index);
  //   updateFileTab(updatedFiles);
  //   handleConfrimClose()
  //   return; // No API call needed
  // }
  // else if(!fileObj.FileName && !fileObj.file){
  //   const updatedFiles = formData?.TagAttachments.filter((_, i) => i !== index);
  //   updateFileTab(updatedFiles);
  //   handleConfrimClose()
  //   return
  // }
    // If FileName exists, proceed with API call
    const deletePayload = {
      id: detailPageId,
      SLNo: fileObj.SLNo,
      FileName: fileObj.FileName,
    }

    try {
      const response = await deleteattachments(deletePayload);

      if (response?.status === "Success") {
       
        showAlert("success",response?.message)
      
     
       // Remove the file from the allFiles state after successful API response
      const updatedFiles = formData.Attachment.filter((_, i) => i !== index);
      updateFileTab(updatedFiles);
  
      setdbTagAttachmentDetails((attachments) =>
        attachments.filter((attachment) => attachment.SLNo !== fileObj.SLNo)
      );
    
      }
    } catch (error) {
    
      // if(error){
       
    
      //     warningOpen();
      //     setWaringData({ message:  error?.message, type: "warning" });
        
      // }
    } finally {
      setConfirmAlert(false);
      setConfirmData({});
      setConfirmType(null);
      setSelectedIndex(null)
      setSelectedObj(null)
  
    }
  };

  const handleClickOpen = (imageUrl) => {
    setOpenDialog(true);
    setDialogImageSrc(imageUrl);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

 
  return (
    <Box>
      <TagAccordions
        label={"Attachments"}
        type={1}
        expanded={expanded}
        onChange={onChange}
      >
        {/* {expanded && */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            // justifyContent: "flex-start",
            // paddingBottom: 1,
            // gap: 1,
            // flexWrap: "wrap",
          }}
        >
         
          <Box >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                scrollbarWidth: "thin",
                overflowX: "auto",
                //flexDirection: direction === 'rtl' ? 'row-reverse' : 'row', // Change direction based on rtl or ltr
                paddingBottom: 5,
                opacity: disabledDetailed ? 0.5 : 1, 
                pointerEvents: disabledDetailed ? "none" : "auto",
              }}
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept={allowedExtensionsTagAttachments.map(ext => `.${ext}`).join(', ')}
                id="masterFilesId"
                style={{ width: "fit-Content" }}
                
              />
              <div>
                <NormalButton action={handleAddFile} label={`${"Add"}`} />
              </div>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-start",
              marginBottom: 2,
              gap: 1,
              flexWrap: "wrap",
              // opacity: disabledDetailed ? 0.5 : 1, // Make it visually appear disabled
              // pointerEvents: disabledDetailed ? "none" : "auto", // Disable pointer events when disabled
            }}
          >
            <TableContainer
              sx={{
                width: "fit-content",
                maxHeight: "50vh",
                overflowY: "auto",
                scrollbarWidth: "thin",
              }}
              component={Paper}
            >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={headerCellStyle}></TableCell>
                    {/* <TableCell sx={headerCellStyle}>{languageDatasJson.DocumentType}</TableCell>
                    <TableCell sx={headerCellStyle}>{languageDatasJson.ReferenceNumber}</TableCell> */}
                    <TableCell sx={headerCellStyle}>File</TableCell>
                    {/* {disabledDetailed && */}
                    <TableCell sx={headerCellStyle}>Image</TableCell>
                    {/* } */}
                    {!disabledDetailed &&
                    <TableCell sx={headerCellStyle}>Delete</TableCell>
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData?.Attachment &&
                    formData?.Attachment?.map((fileObj, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell
                            sx={{
                              ...bodyCell,
                              minWidth: "80px",
                              textAlign: "center",
                            }}
                          >
                            {index + 1}
                          </TableCell>
                          
                          
                          <TableCell
                            sx={{
                              ...bodyCell,
                              minWidth: "80px",
                              textAlign: "center",
                            }}
                          >{(fileObj.FileName ||fileObj.file) &&
                            <IconButton
                              onClick={() => handleDownload(fileObj)}
                              aria-label="delete"
                              sx={iconsExtraSx}
                            >
                              <Stack direction="column" alignItems="center">
                                <MDBIcon
                                  fas
                                  icon="fa-solid fa-circle-down"
                                  style={styleIcon}
                                  className="responsiveAction-icon"
                                />
                              </Stack>
                            </IconButton>
                            }
                          </TableCell>
                          {/* {disabledDetailed && */}
                          <TableCell
                            sx={{
                              ...bodyCell,
                              minWidth: "80px",
                              textAlign: "center",
                            }}
                          >
                            {fileObj?.FileName_Url ?(<img
                              src={fileObj?.FileName_Url}
                              alt="Thumbnail"
                              style={{ cursor: 'pointer', width: '30px', height: '30px' }} // Adjust the style as needed
                              onClick={() => handleClickOpen(fileObj?.FileName_Url)}
                            />):(<><BrokenImageIcon sx={{ color: secondaryColor }} /><span>No image</span></>)}
                            
                          </TableCell>
                          {/* } */}
                          {!disabledDetailed &&
                          <TableCell
                            sx={{
                              ...bodyCell,
                              minWidth: "80px",
                              textAlign: "center",
                            }}
                          >
                            <IconButton
                              onClick={() => deleteClick(fileObj,index)}
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
                          </TableCell>
                         }
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        {/* } */}
      </TagAccordions>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="image-dialog-title"
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '60%', // Set the dialog width to 60% of the screen size
              maxHeight: '80vh',
            },
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleDialogClose}
          sx={{
            position: 'absolute',
            right: 20,
            top: 8,
            color: "#FFF",
            backgroundColor: secondaryColor,
            '&:hover': { // Overrides the default hover style
              backgroundColor: secondaryColor, // Keeps the same background color on hover
              // Optionally, you can adjust the opacity to 1 if it still fades
              opacity: 1,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <img src={dialogImageSrc} alt="Full Size" style={{ width: '100%', height: 'auto' }} />
        </DialogContent>
      </Dialog>

      <ConfirmationAlert2
        handleClose={handleConfrimClose}
        open={confirmAlert}
        data={confirmData}
        submite={()=>handledeletePhoto(selectedObj,selectedIndex)}
      />
    </Box>
  );
}

