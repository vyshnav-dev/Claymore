import React, { useState } from "react";
import { Box, Stack, Button as ButtonM, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import PropTypes from "prop-types";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect } from "react";
import ConfirmationAlert from "../../../component/Alerts/ConfirmationAlert";
import ActionButton from "../../../component/Buttons/ActionButton";
import { useAlert } from "../../../component/Alerts/AlertContext";
import { primaryColor } from "../../../config/config";
import { securityApis } from "../../../service/Security/security";
import UserInputField from "../../../component/InputFields/UserInputField";
import RoleTree from "./RoleTree";

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
            Role Details
          </Typography>
        </Breadcrumbs>
      </Stack>
    </div>
  );
}
const DefaultIcons = ({ iconsClick, detailPageId, userAction }) => {
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
      {userAction.some((action) => action.Action === "New") && (
        <ActionButton
          iconsClick={iconsClick}
          icon={"fa-solid fa-plus"}
          caption={"New"}
          iconName={"new"}
        />
      )}
      {userAction.some(
        (action) =>
          (action.Action === "New" && detailPageId === 0) ||
          (action.Action === "Edit" && detailPageId !== 0)
      ) && (
          <ActionButton
            iconsClick={iconsClick}
            icon={"save"}
            caption={"Save"}
            iconName={"save"}
          />
        )}
      {userAction.some((action) => action.Action === "Delete") && (
        <>
          {detailPageId != 0 ? (
            <ActionButton
              iconsClick={iconsClick}
              icon={"trash"}
              caption={"Delete"}
              iconName={"delete"}
            />
          ) : null}
        </>
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

export default function RoleDetails({
  setPageRender,
  detailPageId: summaryId,
  userAction,
  disabledDetailed,
}) {
  const [mainDetails, setMainDetails] = useState({});
  const [detailPageId, setDetailPageId] = useState(summaryId);
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [confirmData, setConfirmData] = useState({});
  const [confirmType, setConfirmType] = useState(null);
  const [menuAction, setMenuAction] = useState([]);
  const [child, setChild] = useState([]);
  const { getroledetails, upsertrole, checkrolenameexistence, deleterole } =
    securityApis();
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchData = async () => {
      await tagDetails();
    };
    fetchData();
  }, [detailPageId]);

  const tagDetails = async () => {
    try {
      if (detailPageId === 0) {
        handleNew();
      } else {


        const response = await getroledetails({
          Role: detailPageId,
        });
        if (response?.status === "Success") {
          const myObject = JSON.parse(response?.result);
          setMainDetails(myObject?.RoleDetails[0]);
          setMenuAction(myObject?.ScreenDetails);
        } else {
          handleNew();
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const handleNew = () => {
    setMainDetails({ Id: 0, RoleName: "" });
    setDetailPageId(0);
    setMenuAction([]);
  };

  const handleIconsClick = (value) => {
    switch (value.trim()) {
      case "new":
        handleNew();
        break;
      case "close":
        handleclose();
        break;
      case "save":
        const emptyFields = [];
        let namePattern = /[A-Za-z]/;

        if (!mainDetails.RoleName) {
          emptyFields.push("Role Name");
        } else if (!namePattern.test(mainDetails.RoleName)) {
          showAlert("info", "Role Name must contain at least one letter.");
          return;
        }
        if (!child.length) emptyFields.push("Actions");
        if (emptyFields.length > 0) {
          showAlert("info", `Please Provide ${emptyFields[0]}`);
          return;
        }
        setConfirmData({ message: "Save", type: "success" });
        setConfirmType("save");
        setConfirmAlert(true);
        break;
      case "delete":
        setConfirmData({ message: "Delete", type: "danger" });
        setConfirmType("delete");
        setConfirmAlert(true);
        break;

      default:
        break;
    }
  };

  const handleclose = () => {
    setPageRender(1);
  };

  const handleSave = async () => {
    const updatedArray = child.map(({ ScreenId, ActionId }) => ({
      screenId: ScreenId,
      actionId: ActionId,
    }));
    const saveData = {
      id: mainDetails?.Id,
      name: mainDetails?.RoleName,
      details: updatedArray,
    };
    const response = await upsertrole(saveData);
    if (response.status === "Success") {
      showAlert("success", response?.message);
      handleNew();
      const actionExists = userAction.some((action) => action.Action === "New");
      if (!actionExists) {
        setPageRender(1);
      }
    }
  };

  //confirmation

  const handleConfirmSubmit = () => {
    if (confirmType === "save") {
      handleSave();
    } else if (confirmType === "delete") {
      if (detailPageId == 0) {
        setConfirmAlert(false);
        setConfirmData({});
        setConfirmType(null);
        return;
      }
      deleteClick();
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

  //Delete alert open
  const deleteClick = async () => {
    const response = await deleterole([{ id: detailPageId }]);
    if (response?.status === "Success") {
      showAlert("success", response?.message);
      handleNew();
      const actionExists = userAction.some((action) => action.Action === "New");
      if (!actionExists) {
        setPageRender(1);
      }
    }
  };

  const handleChild = (data) => {
    setChild(data);
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
          detailPageId={detailPageId}
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
            <UserInputField
              label={"Role Name"}
              name={"RoleName"}
              type={"text"}
              disabled={false}
              mandatory={true}
              value={mainDetails}
              setValue={setMainDetails}
              maxLength={50}
            // onBlurAction={handleRoleExist}
            />
          </Box>
          <RoleTree menuAction={menuAction} handleChild={handleChild} />
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
