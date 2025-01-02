import React, { useState } from "react";
import {
  Box,
  Stack,
  Button as ButtonM,
  useTheme,
  Typography,
  styled,
  Badge,
  Avatar,
  Tooltip,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import PropTypes from "prop-types";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect } from "react";
import ConfirmationAlert from "../../../component/Alerts/ConfirmationAlert";
import ActionButton from "../../../component/Buttons/ActionButton";
import { useAlert } from "../../../component/Alerts/AlertContext";
import {
  baseUrl,
  primaryColor,
  secondaryColor,
  thirdColor,
} from "../../../config/config";
import { securityApis } from "../../../service/Security/security";
import UserInputField from "../../../component/InputFields/UserInputField";
import UserAutoComplete from "../../../component/AutoComplete/UserAutoComplete";
import UserAutoCompleteManual from "../../../component/AutoComplete/UserAutoCompleteManual";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AutoSelect from "../../../component/AutoComplete/AutoSelect";
import AutoComplete from "../../../component/AutoComplete/AutoComplete";
import InputCommon from "../../../component/InputFields/InputCommon";

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

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

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
            User Details
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

const suggestionUserType = [
  { Id: 1, Name: "Web" },
  { Id: 2, Name: "Mob" },
  { Id: 3, Name: "Both" },
];

export default function UserDetails({
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
  const [imageUpload, setImageUpload] = useState(null);

  const {
    getuserdetails,
    gettimezonelist,
    getroleslist,
    upsertuser,
    deleteuser,
    checkuserexistence,
    uploaduserfile,
    deleteuserfile,
  } = securityApis();
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchData = async () => {
      await tagDetails();
    };
    fetchData();
  }, [detailPageId]);

  const tagDetails = async () => {
    try {
      if (detailPageId == 0) {
        handleNew();
      } else {
        const response = await getuserdetails({
          id: detailPageId,
        });
        if (response?.status === "Success") {
          const myObject = JSON.parse(response?.result);
          if (myObject[0]?.ImagePath) {
            setMainDetails({
              ...myObject[0],
              ImagePath: baseUrl + myObject[0]?.ImagePath,
            });
          } else {
            setMainDetails(myObject[0]);
          }
        } else {
          handleNew();
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const handleNew = () => {
    setMainDetails({
      Email: "",
      Password: "",
      CPassword: "",
      Employee: "",
      Id: 0,
      LoginName: "",
      Mobile: "",
      Phone: "",
      Photo: "",
      RoleId: 0,
      RoleName: "",
      Timezone: 0,
      Type: "",
      UserType: 0,
      UserTypeName: "",
      ImagePath: "",
    });
    setDetailPageId(0);
    setImageUpload(null);
  };

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleIconsClick = async (value) => {
    switch (value.trim()) {
      case "new":
        handleNew();
        break;
      case "close":
        handleclose();
        break;
      case "save":
        const emptyFields = [];
        if (!mainDetails.LoginName) emptyFields.push("Login Name");
        const result = await handleUserExist();
        if (!result) {
          return; // If the user exists, stop further execution
        }
        if (!mainDetails.Employee) emptyFields.push("Employee Name");
        if (!mainDetails.RoleId) emptyFields.push("Role");
        if (!mainDetails.Email) emptyFields.push("Email");
        if (!emailRegex.test(mainDetails?.Email))
          emptyFields.push("Valid Email");
        if (!mainDetails.Password && detailPageId === 0)
          emptyFields.push("Password");
        if (!mainDetails.CPassword && detailPageId === 0)
          emptyFields.push("Confirm Password");
        if (!mainDetails.UserType) emptyFields.push("User Type");
        if (mainDetails.Mobile && !/^[0-9]{10,15}$/.test(mainDetails.Mobile))
          emptyFields.push("Valid Mobile Number");
        if (mainDetails.Phone && !/^[0-9]{10,15}$/.test(mainDetails.Phone))
          emptyFields.push("Valid Phone Number");
        if (emptyFields.length > 0) {
          showAlert("info", `Please Provide ${emptyFields[0]}`);
          return;
        }
        if (
          !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(
            mainDetails.Password
          ) &&
          detailPageId === 0
        ) {
          showAlert(
            "info",
            `Password must be at least 6 characters long and include at least one letter, one number, and one special character.`
          );
          return;
        }
        if (
          mainDetails.Password !== mainDetails.CPassword &&
          detailPageId === 0
        ) {
          showAlert("info", `Incorrect Password`);
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
  // Handlers for your icons

  const handleclose = () => {
    setPageRender(1);
  };


  const handleSave = async () => {
    const saveData = {
      id: mainDetails?.Id,
      loginName: mainDetails?.LoginName,
      employee: mainDetails?.Employee,
      photo: mainDetails?.Photo,
      timezone: mainDetails?.Timezone,
      email: mainDetails?.Email,
      phone: mainDetails?.Phone,
      mobile: mainDetails?.Mobile,
      userType: mainDetails?.UserType,
      roleId: mainDetails?.RoleId,
      password: detailPageId === 0 ? mainDetails?.Password : "",
    };

    const response = await upsertuser(saveData);
    if (response.status === "Success") {
      if (imageUpload) {
        postUploadUserFile(Number(response?.result));
      }
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
    let response;
    response = await deleteuser([{ id: detailPageId }]);
    if (response?.status === "Success") {
      if (mainDetails?.ImagePath) {
        deleteUploadImage(Number(response?.result))
      }
      showAlert("success", response?.message);
      handleNew();
      const actionExists = userAction.some((action) => action.Action === "New");
      if (!actionExists) {
        setPageRender(1);
      }
    }
  };

  const handleUserExist = async () => {
    try {
      const response = await checkuserexistence({
        userId: mainDetails?.Id,
        loginName: mainDetails?.LoginName,
      });
      if (response.status === "Success") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageUpload(file);
      setMainDetails({ ...mainDetails, ImagePath: URL.createObjectURL(file) });
    }
  };

  const handleRemoveImage = () => {
    setImageUpload(null);
    setMainDetails({ ...mainDetails, ImagePath: "" });
  };

  const postUploadUserFile = async (id) => {
    if (!imageUpload) {
      return;
    }

    const formDataFiles = new FormData();
    formDataFiles.append("previousFileName", mainDetails?.Photo || "");
    formDataFiles.append(`fileContent`, imageUpload || "");
    const response = await uploaduserfile(id, formDataFiles);
  };

  const deleteUploadImage = async (id) => {
    const response = await deleteuserfile(id, mainDetails?.Photo);
  }

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

            <InputCommon
              label={"User Name"}
              name={"Employee"}
              type={"text"}
              mandatory={true}
              disabled={false}
              value={mainDetails.Employee}
              setValue={(data) => {
                const { name, value } = data
                setMainDetails({ ...mainDetails, [name]: value })
              }}
              maxLength={50}
            />
            <InputCommon
              label={"Login Name"}
              name={"LoginName"}
              type={"text"}
              disabled={detailPageId !== 0}
              mandatory={true}
              value={mainDetails.LoginName}
              setValue={(data) => {
                const { name, value } = data
                setMainDetails({ ...mainDetails, [name]: value })
              }}
              maxLength={50}
              onBlurAction={handleUserExist}
            />
            {/* <InputCommon
              label={"User Code"}
              name={"Employee"}
              type={"text"}
              mandatory={true}
              disabled={false}
              value={mainDetails.Employee}
              setValue={(data) => {
                const { name, value } = data
                setMainDetails({ ...mainDetails, [name]: value })
              }}
              maxLength={50}
            /> */}
            <AutoComplete
              apiKey={getroleslist}
              formData={mainDetails}
              setFormData={setMainDetails}
              label={"Role"}
              autoId={"role"}
              required={true}
              formDataName={"RoleName"}
              formDataiId={"RoleId"}
            />
            {/* <AutoComplete
              apiKey={getroleslist}
              formData={mainDetails}
              setFormData={setMainDetails}
              label={"Sales Man"}
              autoId={"SalesMan"}
              required={true}
              formDataName={"SalesMan"}
              formDataiId={"SalesManId"}
            /> */}
            <InputCommon
              label={"Email Id"}
              name={"Email"}
              type={"email"}
              mandatory={true}
              disabled={false}
              value={mainDetails.Email}
              setValue={(data) => {
                const { name, value } = data
                setMainDetails({ ...mainDetails, [name]: value })
              }}
            />
            {detailPageId === 0 && (
              <>
                <InputCommon
                  label={"Password"}
                  name={"Password"}
                  type={"password"}
                  disabled={false}
                  mandatory={true}
                  value={mainDetails.Password}
                  setValue={(data) => {
                    const { name, value } = data
                    setMainDetails({ ...mainDetails, [name]: value })
                  }}
                />

                <InputCommon
                  label={"Confirm Password"}
                  name={"CPassword"}
                  type={"password"}
                  disabled={false}
                  mandatory={true}
                  value={mainDetails.CPassword}
                  setValue={(data) => {
                    const { name, value } = data
                    setMainDetails({ ...mainDetails, [name]: value })
                  }}
                  key={"Mobile"}
                  languageName={"english"}
                  key1={`Mobile`}
                  maxLength={100}
                />
              </>
            )}

            <UserAutoComplete
              apiKey={gettimezonelist}
              formData={mainDetails}
              setFormData={setMainDetails}
              label={"Time Zone"}
              autoId={"timeZone"}
              formDataName={"TimezoneName"}
              formDataiId={"Timezone"}
            />

            {/* <UserAutoCompleteManual
              formData={mainDetails}
              setFormData={setMainDetails}
              label={"User Type"}
              autoId={"userType"}
              required={true}
              suggestion={suggestionUserType}
              formDataId={"UserType"}
            /> */}
            <AutoSelect
              key={"userType"}
              formData={mainDetails}
              setFormData={setMainDetails}
              autoId={"userType"}
              formDataName={`userType_Name`}
              formDataiId={"userType"}
              required={true}
              label={"User Type"}
              languageName={"english"}
              ColumnSpan={0}
              // disabled={disabledDetailed}
              Menu={[{ "Id": 1, "Name": "Web" }, { "Id": 2, "Name": "Mob" }, { "Id": 3, "Name": "Both" }]}

            />

            {/* <UserInputField
              label={"Mobile"}
              name={"Mobile"}
              type={"text"}
              disabled={false}
              value={mainDetails}
              setValue={setMainDetails}
            /> */}
            <InputCommon
              key={"Mobile"}
              label={"Mobile"}
              value={mainDetails.Mobile}
              name={"Mobile"}
              setValue={(data) => {
                const { name, value } = data
                setMainDetails({ ...mainDetails, [name]: value })
              }}
              languageName={"english"}
              key1={`Mobile`}
              mandatory={false}
              disabled={false}
              type={"text"}
              maxLength={100}



            />

            {/* <UserInputField
              label={"Phone"}
              name={"Phone"}
              type={"text"}
              disabled={false}
              value={mainDetails}
              setValue={setMainDetails}
            /> */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                paddingTop: 1,
              }}
            >
              <Stack direction="row" spacing={2}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <>
                      {mainDetails?.ImagePath ? (
                        <Tooltip title={"Remove Photo"}>
                          <SmallAvatar
                            onClick={handleRemoveImage}
                            alt="Remy Sharp"
                            sizes="small"
                            sx={{ cursor: "pointer", backgroundColor: "lightBlue" }}
                          >
                            <RemoveIcon sx={{ p: 0.7 }} />
                          </SmallAvatar>
                        </Tooltip>
                      ) : (
                        <Tooltip title={"Add Photo"}>
                          <SmallAvatar
                            onClick={() =>
                              document
                                .getElementById("image-upload-input")
                                .click()
                            }
                            alt="Remy Sharp"
                            sizes="small"
                            sx={{ cursor: "pointer", backgroundColor: "lightBlue" }}
                          >
                            <AddIcon sx={{ p: 0.7 }} />
                          </SmallAvatar>
                        </Tooltip>
                      )}
                    </>
                  }
                >
                  <Avatar
                    alt="User Photo"
                    src={mainDetails?.ImagePath}
                    sx={{
                      width: 100,
                      height: 100,
                      border: 4,
                      borderColor: thirdColor,
                    }} // Adjust size as needed
                  />
                </Badge>

                <input
                  id="image-upload-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </Stack>
            </Box>
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
