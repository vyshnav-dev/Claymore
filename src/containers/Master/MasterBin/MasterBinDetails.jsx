import React, { useState } from "react";
import {
  Box,
  Stack,
  Button as ButtonM,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import PropTypes from "prop-types";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect } from "react";
import ConfirmationAlert from "../../../component/Alerts/ConfirmationAlert";
import ActionButton from "../../../component/Buttons/ActionButton";
import { useAlert } from "../../../component/Alerts/AlertContext";
import { primaryColor } from "../../../config/config";
import UserInputField from "../../../component/InputFields/UserInputField";
import { stockCountApis } from "../../../service/Transaction/stockcount";

import EntityAutoComplete from "../../../component/AutoComplete/EntityAutoComplete";
import WarehouseAutoComplete from "../../../component/AutoComplete/WarehouseAutoComplete";
import { masterApis } from "../../../service/Master/master";
import UserAutoComplete from "../../../component/AutoComplete/UserAutoComplete";
import ConfirmationAlertContent from "../../../component/Alerts/ConfirmationAlertContent";
const currentDate = new Date().toISOString().split("T")[0];
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
            Bin Details
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
      {userAction.some((action) => action.Action === "New" && detailPageId !== 0) && (
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

      {userAction.some((action) => action.Action === "Property") && (
        <>
          {detailPageId !== 0 && (
            <ActionButton
              iconsClick={iconsClick}
              icon={"fa-solid fa-gears"}
              caption={"Property"}
              iconName={"property"}
            />
          )}
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function MasterBinDetails({
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
  const [property, setProperty] = useState(false);
  const {
    getstockcountdetail,
    getdocno,
    getwarehousebyentity,
    gettaglist,
    deletestockcount,
  } = stockCountApis();
  const { showAlert } = useAlert();
  const {
    gettagdetails,
    deletetag,
    checkexistenceintag,
    upsertbinmaster,
    updatetagproperties,
  } = masterApis();

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
        const response = await gettagdetails({
          id: detailPageId,
          tagId: 17,
        });
        if (response?.status === "Success") {
          const myObject = JSON.parse(response?.result);
          setMainDetails(myObject?.TagInfo[0]);
        } else {
          handleNew();
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const handleNew = async () => {
    setMainDetails({
      BE: null,
      BE_Name: null,
      Capacity: null,
      Code: null,
      Id: detailPageId,
      Name: null,
      Warehouse: null,
      Warehouse_Name: null,
    });
    setDetailPageId(0);
  };

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
        if (!mainDetails.Name) emptyFields.push("Name");
        if (!mainDetails.Code) emptyFields.push("Code");
        if (!mainDetails.BE) emptyFields.push("Entity");
        if (!mainDetails.Warehouse) emptyFields.push("Warehouse");
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

      case "property":
        handleProperty();
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
    const response = await upsertbinmaster(mainDetails);
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
    let response;
    response = await deletetag([{ id: detailPageId }], 17);
    if (response?.status === "Success") {
      showAlert("success", response?.message);
      handleNew();
      const actionExists = userAction.some((action) => action.Action === "New");
      if (!actionExists) {
        setPageRender(1);
      }
    }
  };

  const handleMasterExist = async (type) => {
    try {
      const response = await checkexistenceintag({
        tagId: 17,
        id: mainDetails?.Id,
        name: type === 1 ? mainDetails?.Name : mainDetails?.Code,
        type: type,
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

  useEffect(() => {
    if (!mainDetails?.BE) {
      setMainDetails({ ...mainDetails, Warehouse: null, Warehouse_Name: null });
    }
  }, [mainDetails?.BE]);

  const handleProperty = () => {
    setConfirmData({
      message: `You want to Activate/Inactivate the property.`,
      type: "info",
      header: "Property",
    });
    setProperty(true);
  };

  const handlePropertyConfirmation = async (status) => {
    const propertyPayload = [
      {
        id: detailPageId,
      },
    ];

    const saveData = {
      tagId: 17,
      status: status,
      ids: propertyPayload,
    };
    try {
      const response = await updatetagproperties(saveData);

      if (response?.status === "Success") {
        showAlert("success", response?.message);
        setConfirmData({});
      }
    } catch (error) {
    } finally {
      setProperty(false);
    }
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
              label={"Name"}
              name={"Name"}
              type={"text"}
              disabled={false}
              mandatory={true}
              value={mainDetails}
              setValue={setMainDetails}
              onBlurAction={() => handleMasterExist(1)}
              maxLength={100}
            />
            <UserInputField
              label={"Code"}
              name={"Code"}
              type={"text"}
              disabled={false}
              mandatory={true}
              value={mainDetails}
              setValue={setMainDetails}
              onBlurAction={() => handleMasterExist(2)}
              maxLength={100}
            />

            <UserAutoComplete
              apiKey={gettaglist}
              formData={mainDetails}
              setFormData={setMainDetails}
              label={"Entity"}
              autoId={"entity"}
              required={true}
              formDataName={"BE_Name"}
              formDataiId={"BE"}
              tagId={1}
            />

            <WarehouseAutoComplete
              apiKey={getwarehousebyentity}
              formData={mainDetails}
              setFormData={setMainDetails}
              label={"Warehouse"}
              autoId={"warehouse"}
              formDataName={"Warehouse_Name"}
              formDataiId={"Warehouse"}
              required={true}
              beId={mainDetails?.BE}
            />

            <UserInputField
              label={"Capacity"}
              name={"Capacity"}
              type={"number"}
              disabled={false}
              mandatory={false}
              value={mainDetails}
              setValue={setMainDetails}
              
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
      <ConfirmationAlertContent
        handleClose={() => setProperty(false)}
        open={property}
        data={confirmData}
        submite={handlePropertyConfirmation}
        tagId={17}
        selectedDatas={detailPageId ? detailPageId : null}
      />
    </Box>
  );
}
