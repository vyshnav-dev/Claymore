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
  itemLabel
}) {
  const themes = useTheme();
//   const { gettagpropertiesdetails } = masterApis();
  const [activeData, setActiveData] = useState({});
  const [mainDetails, setMainDetails] = useState({});

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

  const handleNew = () => {
    setActiveData({
      Id: 0,
      Status: null,
    });
  };

  return (
    <>
      <MDBModal open={open} onClose={handleClose} tabIndex="-1" centered>
        <MDBModalDialog size={!selectedDatas ? "md" : "sm"}>
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
                name={"findings"}
                type={"text"}
                disabled={false}
                mandatory={true}
                value={mainDetails}
                setValue={setMainDetails}
                multiline={true}
            />
              )}
              
            </MDBModalBody>

            {/* Modal Footer */}
            <MDBModalFooter className="d-flex justify-content-center">
              <MDBBtn color="secondary" onClick={handleClose}>
                Close
              </MDBBtn>
              { itemLabel === 'reject' ? (
                <MDBBtn onClick={() => submite(3)} color={"danger"}>
                  Reject
                </MDBBtn>
              ) : (
                <MDBBtn onClick={() => submite(0)} color={"success"}>
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
