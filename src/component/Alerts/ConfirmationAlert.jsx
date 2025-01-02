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

export default function ConfirmationAlert({ handleClose, open, data,submite }) {
  const themes = useTheme();
  return (
    <>
      <MDBModal open={open} onClose={handleClose} tabIndex='-1' centered>
        <MDBModalDialog size='sm'>
          <MDBModalContent>
            <MDBModalHeader className={`bg-${data?.type} text-white d-flex justify-content-center`}>
              <MDBModalTitle>{data?.message}</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody className='d-flex justify-content-center align-items-center'>
              <Typography m={2} color="grey">You want to {data?.message} this.</Typography>
            </MDBModalBody>
            <MDBModalFooter className='d-flex justify-content-center'>
              <MDBBtn color='secondary' onClick={handleClose}>
                Close
              </MDBBtn>
              <MDBBtn onClick={submite} color={data?.type}>{data?.message}</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
