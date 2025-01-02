import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Zoom } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  maxHeight: "90vh", // Adjust maxHeight to view height for better control
  overflow: "auto", // Adds scrollbars if content overflows

};

export default function NormalModal({
  children,
  isOpen,
  handleCloseModal,
  batch, setbatch,
  width
}) {
  return (
    <Modal
      open={isOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)",}}
      disableEnforceFocus
    >
      <Box sx={{ ...style,  width: width? width : "auto",}}>
        {children}
      </Box>
    </Modal>
  );
}
