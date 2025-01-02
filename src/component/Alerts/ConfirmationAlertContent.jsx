import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import { Typography, useTheme } from "@mui/material";
import { masterApis } from "../../service/Master/master";

export default function ConfirmationAlertContent({
  handleClose,
  open,
  data,
  submite,
  selectedDatas,
  tagId,
}) {
  const themes = useTheme();
  const { gettagpropertiesdetails } = masterApis();
  const [activeData, setActiveData] = useState({})

  useEffect(() => {
    if (selectedDatas) {
      const fetchData = async () => {
        const response = await gettagpropertiesdetails({
          tagId: tagId,
          id: selectedDatas,
        });
        if (response?.status === "Success") {
          const myObject = JSON.parse(response?.result); 
          setActiveData(myObject)
        }else{
            handleNew()
        }
      };
      fetchData();
    } else {
        handleNew()
    }
  }, [open]);


  const handleNew = ()=>{
    setActiveData({
        Id: 0,
        Status: null,
      });
  }
  return (
    <>
      <MDBModal open={open} onClose={handleClose} tabIndex="-1" centered>
        <MDBModalDialog size={!selectedDatas? "md" : "sm"}>
          <MDBModalContent>
            {/* Modal Header */}
            <MDBModalHeader
              className={`bg-${
                !selectedDatas ? data?.type : activeData?.Status === 0 ? "danger" : "success"
              } text-white d-flex justify-content-center`}
            >
              <MDBModalTitle>{data?.header}</MDBModalTitle>
            </MDBModalHeader>

            {/* Modal Body */}
            <MDBModalBody className="d-flex flex-column justify-content-center align-items-center text-center">
              <Typography m={2} color="grey">
                {data?.message}
              </Typography>
            </MDBModalBody>

            {/* Modal Footer */}
            <MDBModalFooter className="d-flex justify-content-center">
              <MDBBtn color="secondary" onClick={handleClose}>
                Close
              </MDBBtn>
              {!selectedDatas ? (
                <>
                  <MDBBtn onClick={() => submite(0)} color={"success"}>
                    Activate
                  </MDBBtn>
                  <MDBBtn onClick={() => submite(3)} color={"danger"}>
                    InActivate
                  </MDBBtn>
                </>
              ) : activeData?.Status === 0 ? (
                <MDBBtn onClick={() => submite(3)} color={"danger"}>
                  InActivate
                </MDBBtn>
              ) : (
                <MDBBtn onClick={() => submite(0)} color={"success"}>
                  Activate
                </MDBBtn>
              )}
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
