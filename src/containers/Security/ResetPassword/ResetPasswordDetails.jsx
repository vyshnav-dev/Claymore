import React, { useState } from "react";
import { Box, Stack, Button as ButtonM, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import PropTypes from "prop-types";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ConfirmationAlert from "../../../component/Alerts/ConfirmationAlert";
import ActionButton from "../../../component/Buttons/ActionButton";
import { useAlert } from "../../../component/Alerts/AlertContext";
import { primaryColor } from "../../../config/config";
import UserInputField from "../../../component/InputFields/UserInputField";
import { securityApis } from "../../../service/Security/security";
import { useNavigate } from "react-router-dom";
import InputCommon from "../../../component/InputFields/InputCommon";
import { encrypt } from "../../../service/Security/encryptionUtils";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function BasicBreadcrumbs() {
  const style = {
    display: "flex",
    alignItems: "center",
    fontSize: "1.2rem",
    color: primaryColor,
    "@media (max-width: 600px)": {
      fontSize: "1rem", // Reduce font size on smaller screens
    },
    fontWeight: "bold",
  };
  return (
    <div
      role="presentation"
      style={{
        display: "flex",
        flexDirection: "row",
        maxWidth: "fit-content",
        alignItems: "center",
      }}
    >
      <Stack spacing={2} sx={{ flex: 1 }}>
        <Breadcrumbs
          separator={
            <NavigateNextIcon
              fontSize="small"
              sx={{
                color: primaryColor,
              }}
            />
          }
          aria-label="breadcrumb"
        >
          <Typography underline="hover" sx={style} key="1">
            Reset Password
          </Typography>
        </Breadcrumbs>
      </Stack>
    </div>
  );
}
const DefaultIcons = ({ iconsClick, userAction }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "5px",
        alignItems: "center",
        overflowX: "auto",
        scrollbarWidth: "thin",
      }}
    >
      {userAction.some((action) => action.Action === "Access") && (
        <ActionButton
          iconsClick={iconsClick}
          icon={"save"}
          caption={"Save"}
          iconName={"save"}
        />
      )}

      <ActionButton
        iconsClick={iconsClick}
        icon={"fa-solid fa-xmark"}
        caption={"Close"}
        iconName={"close"}
      />
    </Box>
  );
};

export default function ResetPassworsDetails({ userAction, disabledDetailed }) {
  const [mainDetails, setMainDetails] = useState({
    OldPassword: "",
    NewPassword: "",
    UserId:0
  });
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [confirmData, setConfirmData] = useState({});
  const [confirmType, setConfirmType] = useState(null);

  const { showAlert } = useAlert();
  const { updatepassword } = securityApis();
  const navigate = useNavigate();

  const handleIconsClick = async (value) => {
    switch (value.trim()) {
      case "close":
        handleclose();
        break;
      case "save":
        const emptyFields = [];
        if (!mainDetails.OldPassword) emptyFields.push("Old Password");
        if (!mainDetails.NewPassword) emptyFields.push("New Password");
        if (!mainDetails.CPassword) emptyFields.push("Confirm Password");
        if (emptyFields.length > 0) {
          showAlert("info", `Please Provide ${emptyFields[0]}`);
          return;
        }
        if (
          !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(
            mainDetails.NewPassword
          )
        ) {
          showAlert(
            "info",
            `Password must be at least 6 characters long and include at least one letter, one number, and one special character.`
          );
          return;
        }
        if (
          mainDetails.NewPassword !== mainDetails.CPassword
        ) {
          showAlert("info", `New Password and Confirm Password mismatch`);
          return;
        }
        setConfirmData({ message: "Save", type: "success" });
        setConfirmType("save");
        setConfirmAlert(true);

        break;

      default:
        break;
    }
  };
  // Handlers for your icons

  const handleclose = () => {
    navigate("/home");
  };

  const handleNew = () => {
    setMainDetails({ OldPassword: "", NewPassword: "" ,UserId:0});
  };

  const handleSave = async () => {
    const encryptedOldPassword = await encrypt(mainDetails?.OldPassword); 
    const encryptedNewPassword = await encrypt(mainDetails?.NewPassword);
    const saveData = {
         oldPassword :encryptedOldPassword,
         newPassword :encryptedNewPassword,
        };
    const response = await updatepassword(saveData);
    if (response.status === "Success") {
      showAlert("success", response?.message);
      handleNew();
    }
  };

  //confirmation

  const handleConfirmSubmit = () => {
    if (confirmType === "save") {
      handleSave();
    }
    setConfirmAlert(false);
    setConfirmData({});
    setConfirmType(null);
  };
  const handleConfrimClose = () => {
    setConfirmAlert(false);
    setConfirmData({});
    setConfirmType(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingLeft: 1.5,
          paddingRight: 1.5,
          flexWrap: "wrap",
        }}
      >
        <BasicBreadcrumbs />
        <DefaultIcons
          iconsClick={handleIconsClick}
          userAction={userAction}
          disabledDetailed={disabledDetailed}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          scrollbarWidth: "thin",
          paddingBottom: "30px",
        }}
      >
        <Box
          sx={{
            width: "98%",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            paddingTop: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-start", // Changed from center to flex-start
              padding: 1,
              gap: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",

              flexWrap: "wrap",
              "@media (max-width: 768px)": {
                gap: "10px", // Reduced width for small screens
              },
              "@media (max-width: 420px)": {
                gap: "2px", // Reduced width for small screens
              },
            }}
          >
            <InputCommon
              label={"Old Password"}
              name={"OldPassword"}
              type={"password"}
              disabled={false}
              mandatory={true}
              value={mainDetails.OldPassword}
              setValue={(data) => {
                const { name, value } = data;
                setMainDetails({ ...mainDetails, [name]: value });
              }}
              maxLength={60}
            />

            <InputCommon
              label={"New Password"}
              name={"NewPassword"}
              type={"password"}
              disabled={false}
              mandatory={true}
              value={mainDetails.NewPassword}
              setValue={(data) => {
                const { name, value } = data;
                setMainDetails({ ...mainDetails, [name]: value });
              }}
              maxLength={60}
            />

            <InputCommon
              label={"Confirm Password"}
              name={"CPassword"}
              type={"password"}
              disabled={false}
              mandatory={true}
              value={mainDetails.CPassword}
              setValue={(data) => {
                const { name, value } = data;
                setMainDetails({ ...mainDetails, [name]: value });
              }}
              maxLength={60}
            />
          </Box>
        </Box>
      </Box>

      <ConfirmationAlert
        handleClose={handleConfrimClose}
        open={confirmAlert}
        data={confirmData}
        submite={handleConfirmSubmit}
      />
    </Box>
  );
}
