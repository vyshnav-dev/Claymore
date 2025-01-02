import React from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
import { Typography, useTheme } from '@mui/material';

export default function ConfirmationAlert3Button({ handleClose, open, data,submite }) {
  const themes = useTheme();
  return (
    <>
      <MDBModal open={open} onClose={()=>handleClose(0)} tabIndex='-1' centered>
        <MDBModalDialog size='md'>
          <MDBModalContent>
            <MDBModalHeader className={`bg-${data?.type} text-white d-flex justify-content-center`}>
              <MDBModalTitle>Warning</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody className='d-flex justify-content-center align-items-center'>
              <Typography m={2} color="grey"> {data?.message}</Typography>
            </MDBModalBody>
            <MDBModalFooter className='d-flex justify-content-center'>
              {/* <MDBBtn color='secondary' onClick={()=>handleClose(0)}>
                Close
              </MDBBtn> */}
              <MDBBtn color='secondary' onClick={()=>handleClose(1)}>
              Keep Data
              </MDBBtn>
              <MDBBtn onClick={submite} color={data?.type}>Continue</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
