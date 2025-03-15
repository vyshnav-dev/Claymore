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
// import { masterApis } from "../../../service/Master/master";
// import ChecKBoxLabel from "../../../component/CheckBox/CheckBoxLabel";
import UserInputField from "../../component/InputFields/UserInputField";

export default function ApproveConfirmation({
  handleClose,
  open,
  data,
  submite,
  selectedDatas,
  itemLabel,
  mainDetails,
  setMainDetails
}) {
  const themes = useTheme();
//   const { gettagpropertiesdetails } = masterApis();
  const [activeData, setActiveData] = useState({});

//   useEffect(() => {
//     if (selectedDatas) {
//       const fetchData = async () => {
//         const response = await gettagpropertiesdetails({
//           tagId: 11,
//           id: selectedDatas,
//         });
//         if (response?.status === "Success") {
//           const myObject = JSON.parse(response?.result);
//           setActiveData(myObject);
//         } else {
//           handleNew();
//         }
//       };
//       fetchData();
//     } else {
//       handleNew();
//     }
//   }, [open]);

  

  return (
    <>
      <MDBModal open={open} onClose={handleClose} tabIndex="-1" centered>
        <MDBModalDialog >
          <MDBModalContent>
            {/* Modal Header */}
            <MDBModalHeader
              className={`bg-${
                !selectedDatas
                  ? data?.type
                  : itemLabel === 'reject'
                  ? "danger"
                  : "success"
              } text-white d-flex justify-content-center`}
            >
              <MDBModalTitle>{data?.header}</MDBModalTitle>
            </MDBModalHeader>

            {/* Modal Body */}
            <MDBModalBody className="d-flex flex-column justify-content-center align-items-center text-center">
                {itemLabel === 'approve' ? (<Typography m={2} color="grey">
                {data?.message}
              </Typography>):(
                <UserInputField
                name={"Remarks"}
                type={"text"}
                disabled={false}
                mandatory={true}
                value={mainDetails}
                setValue={setMainDetails}
                multiline={true}
                width={400}
                placeholder={"Add Remarks..."}
            />
              )}
              
            </MDBModalBody>

            {/* Modal Footer */}
            <MDBModalFooter className="d-flex justify-content-center">
              <MDBBtn color="secondary" onClick={handleClose}>
                Close
              </MDBBtn>
              { itemLabel === 'reject' ? (
                <MDBBtn onClick={() => submite(1)} color={"danger"}>
                  Reject
                </MDBBtn>
              ) :itemLabel === 'correction' ? (
                <MDBBtn onClick={() => submite(3)} color={"primary"}>
                  Correct
                </MDBBtn>
              ):itemLabel === 'suspend' ? (
                <MDBBtn onClick={() => submite(4)} color={"danger"}>
                  Suspend
                </MDBBtn>
              ):(
                <MDBBtn onClick={() => submite(2)} color={"success"}>
                  Approve
                </MDBBtn>
              )}
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
