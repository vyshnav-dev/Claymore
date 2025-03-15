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
import UserInputField from "../InputFields/UserInputField";
import { securityApis } from "../../service/Security/security";
import { useAlert } from "./AlertContext";
import { encrypt } from "../../service/Security/encryptionUtils";

export default function ResetPasswordAlert({
  handleClose,
  open,
  detailPageId,
}) {
  const { updateuserpassword } = securityApis();
  
  const themes = useTheme();
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    password: "",
    CPassword: "",
  });

  const handleResetPassword = async () => {
    if (!formData?.password) {
      showAlert("info", "Please Provide new password");
      return;
    }
    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(
        formData.password
      )
    ) {
      showAlert(
        "info",
        `Password must be at least 6 characters long and include at least one letter, one number, and one special character.`
      );
      return;
    }
    if (formData.password !== formData.CPassword) {
      showAlert("info", `Password and Confirm Password mismatch`);
      return;
    }

        const encryptedNewPassword = await encrypt(formData?.password);
        const saveData = {
             OldPassword :"",
             newPassword :encryptedNewPassword,
             UserId:detailPageId
            };
    const response = await updateuserpassword(saveData);
    if (response?.status === "Success") {
      showAlert("success", response?.message);
      handleClose();
      setFormData({ userId: 0, password: "" });
    }
  };

  useEffect(() => {
    setFormData({ userId: 0, password: "", CPassword: "" });
  }, [open]);

  return (
    <>
      <MDBModal
        open={open}
        onClose={() => handleClose(0)}
        tabIndex="-1"
        centered
      >
        <MDBModalDialog size="md">
          <MDBModalContent>
            <MDBModalHeader
              className={`bg-primary text-white d-flex justify-content-center`}
            >
              <MDBModalTitle>Reset Password</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody className="d-flex flex-column align-items-center">
              <Typography m={0} color="grey">
                Enter the New Password
              </Typography>
              <br />
              <UserInputField
                label={"New Password"}
                name={"password"}
                type={"password"}
                disabled={false}
                value={formData}
                setValue={setFormData}
              />

              <UserInputField
                label={"Confirm Password"}
                name={"CPassword"}
                type={"password"}
                disabled={false}
                value={formData}
                setValue={setFormData}
              />
            </MDBModalBody>

            <MDBModalFooter className="d-flex justify-content-center">
              {/* <MDBBtn color='secondary' onClick={()=>handleClose(0)}>
                Close
              </MDBBtn> */}
              <MDBBtn color="secondary" onClick={handleClose}>
                close{" "}
              </MDBBtn>
              <MDBBtn onClick={handleResetPassword} color="primary">
                Reset
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
