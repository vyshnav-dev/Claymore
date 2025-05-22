
import React from "react";
import { Dialog, DialogContent, IconButton, Typography } from "@mui/material";

const ImageModal = ({ isOpen, imageUrl, handleCloseImagePopup }) => {
 

  return (
    <Dialog open={isOpen} onClose={handleCloseImagePopup}>
      <DialogContent>
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="Not accessible"
              style={{ width: "300px" }}
            />
          </>
        ) : (
          <Typography variant="body1">
            Image not found or not accessible.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
