import React, { useState } from "react";
import {
  Box,
  Stack,
  Button as ButtonM,
  useTheme,
  useMediaQuery,
  Typography,
  TableCell,
  Table,
  TableHead,
  TableRow,
  TableContainer,
  IconButton,
  Paper,
  TableBody,
  Badge,
  styled,
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
import UserInputField from "../../../component/InputFields/UserInputField";
import { stockCountApis } from "../../../service/Transaction/stockcount";
import { masterApis } from "../../../service/Master/master";
import { MDBIcon } from "mdb-react-ui-kit";
import MasterSelectionAutoComplete from "../MasterWarehouse/MasterSelectionAutoComplete";
import UserAutoComplete from "../../../component/AutoComplete/UserAutoComplete";
import MasterStateAutoComplete from "../../../component/AutoComplete/MasterEntityAutoComplete/MasterStateAutoComplete";
import { securityApis } from "../../../service/Security/security";
import ChecKBoxLabel from "../../../component/CheckBox/CheckBoxLabel";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
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
const headerCellStyle = {
  padding: "0px 4px",
  border: `1px solid #ddd`,
  fontWeight: "600",
  fontSize: "14px",
  color: "white",
};

const bodyCellStyle = {
  border: `1px solid #ddd`,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontSize: "12px",
};

const iconsExtraSx = {
  fontSize: "0.8rem",
  padding: "0.4rem",
  "&:hover": {
    backgroundColor: thirdColor,
  },
};

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const visibleHeaders = ["Name"];

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
            Business Entity Details
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

export default function MasterEntityDetails({
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
  const [property, setProperty] = useState(false);
  const { gettaglist, upsertstockcount } = stockCountApis();
  const { showAlert } = useAlert();
  const {
    gettagdetails,
    deletetag,
    checkexistenceintag,
    getstatebycountry,
    upsertentitymaster,
    uploadentitylogofile,
    deleteentitylogofile,
    updatetagproperties,
  } = masterApis();
  const { gettimezonelist } = securityApis();
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
          tagId: 1,
        });

        if (response?.status === "Success") {
          const myObject = JSON.parse(response?.result);
          const formattedDocDate =
            myObject?.TagInfo[0]?.AccountingPeriod?.split("T")[0];
          if (myObject?.TagInfo[0]?.LogoPath) {
            setMainDetails({
              ...myObject?.TagInfo[0],
              LogoPath: baseUrl + myObject?.TagInfo[0]?.LogoPath,
              AccountingPeriod: formattedDocDate,
            });
          } else {
            setMainDetails({
              ...myObject?.TagInfo[0],
              AccountingPeriod: formattedDocDate,
            });
          }
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
      AccountingPeriod: currentDate,
      Address: null,
      AmtDecimal: 0,
      BatchEnabled: false,
      BinEnabled: false,
      Code: null,
      CompanyLogo: null,
      Country: null,
      Country_Name: null,
      Fax: null,
      FunctionalCurrency: null,
      FunctionalCurrency_Name: null,
      Id: detailPageId,
      LogoPath: null,
      Name: null,
      QtyDecimal: 0,
      SerialNoEnabled: false,
      State: null,
      State_Name: null,
      Telephone: null,
      TimeZone: null,
      TimeZone_Name: null,
      WarehouseHeader: false,
      Website: "",
    });
    setImageUpload(null);
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

        if (!mainDetails.FunctionalCurrency)
          emptyFields.push("FunctionalCurrency");
        if (!mainDetails.AccountingPeriod) emptyFields.push("AccountingPeriod");
        if (
          mainDetails.Telephone &&
          !/^[0-9]{7,20}$/.test(mainDetails.Telephone)
        )
          emptyFields.push("Valid Telephone Number");
        if (mainDetails.Fax && !/^[0-9]{7,20}$/.test(mainDetails.Fax))
          emptyFields.push("Valid Fax");
        const urlPattern =
          /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
        if (mainDetails.Website && !urlPattern.test(mainDetails.Website)) {
          emptyFields.push("Valid Website URL");
        }
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
    const saveData = {
      id: mainDetails?.Id,
      name: mainDetails?.Name,
      code: mainDetails?.Code,
      accountingPeriod: mainDetails?.AccountingPeriod,
      functionalCurrency: mainDetails?.FunctionalCurrency,
      companyLogo: mainDetails?.CompanyLogo,
      address: mainDetails?.Address,
      telephone: mainDetails?.Telephone,
      fax: mainDetails?.Fax,
      country: mainDetails?.Country,
      state: mainDetails?.State,
      timezone: mainDetails?.Timezone,
      website: mainDetails?.Website,
      preferences: {
        binEnabled: mainDetails?.BinEnabled,
        batchEnabled: mainDetails?.BatchEnabled,
        serialNoEnabled: mainDetails?.SerialNoEnabled,
        warehouseHeader: mainDetails?.WarehouseHeader,
        qtyDecimal: mainDetails?.QtyDecimal,
        amtDecimal: mainDetails?.AmtDecimal,
      },
    };

    const response = await upsertentitymaster(saveData);
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

  const postUploadUserFile = async (id) => {
    if (!imageUpload) {
      return;
    }

    const formDataFiles = new FormData();
    formDataFiles.append("previousFileName", mainDetails?.CompanyLogo || "");
    formDataFiles.append(`fileContent`, imageUpload || "");
    const response = await uploadentitylogofile(id, formDataFiles);
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
    response = await deletetag([{ id: detailPageId }], 1);
    if (response?.status === "Success") {
      if (mainDetails?.LogoPath) {
        deleteUploadImage(Number(response?.result));
      }
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
        tagId: 1,
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageUpload(file);
      setMainDetails({ ...mainDetails, LogoPath: URL.createObjectURL(file) });
    }
  };

  const handleRemoveImage = () => {
    setImageUpload(null);
    setMainDetails({ ...mainDetails, LogoPath: "" });
  };

  const deleteUploadImage = async (id) => {
    const response = await deleteentitylogofile(id, mainDetails?.CompanyLogo);
  };

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
      tagId: 1,
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
              autoId={"functionalCurrency"}
              formDataName={"FunctionalCurrency_Name"}
              formDataiId={"FunctionalCurrency"}
              required={true}
              label={"Functional Currency"}
              tagId={4}
              formData={mainDetails}
              setFormData={setMainDetails}
            />

            <UserInputField
              label={"Accounting Period"}
              name={"AccountingPeriod"}
              type={"date"}
              disabled={false}
              mandatory={true}
              value={mainDetails}
              setValue={setMainDetails}
            />

            <UserInputField
              label={"Address"}
              name={"Address"}
              type={"text"}
              disabled={false}
              mandatory={false}
              value={mainDetails}
              setValue={setMainDetails}
              maxLength={500}
            />

            <UserInputField
              label={"Telephone"}
              name={"Telephone"}
              type={"text"}
              disabled={false}
              mandatory={false}
              value={mainDetails}
              setValue={setMainDetails}
              maxLength={100}
            />

            <UserInputField
              label={"Fax"}
              name={"Fax"}
              type={"number"}
              disabled={false}
              mandatory={false}
              value={mainDetails}
              setValue={setMainDetails}
              maxLength={100}
            />

            <UserAutoComplete
              apiKey={gettaglist}
              autoId={"countryName"}
              formDataName={"Country_Name"}
              formDataiId={"Country"}
              required={false}
              label={"Country"}
              tagId={24}
              formData={mainDetails}
              setFormData={setMainDetails}
            />

            <MasterStateAutoComplete
              apiKey={getstatebycountry}
              autoId={"state"}
              formDataName={"State_Name"}
              formDataiId={"State"}
              required={false}
              label={"State"}
              countryId={mainDetails?.Country}
              formData={mainDetails}
              setFormData={setMainDetails}
            />

            <UserAutoComplete
              apiKey={gettimezonelist}
              formData={mainDetails}
              setFormData={setMainDetails}
              label={"Time Zone"}
              autoId={"timeZone"}
              formDataName={"TimeZone_Name"}
              formDataiId={"Timezone"}
            />

            <UserInputField
              label={"Website"}
              name={"Website"}
              type={"text"}
              disabled={false}
              mandatory={false}
              value={mainDetails}
              setValue={setMainDetails}
              maxLength={100}
            />

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
                      {mainDetails?.LogoPath ? (
                        <Tooltip title={"Remove Logo"}>
                          <SmallAvatar
                            onClick={handleRemoveImage}
                            alt="Remy Sharp"
                            sizes="small"
                            sx={{
                              cursor: "pointer",
                              backgroundColor: "lightBlue",
                            }}
                          >
                            <RemoveIcon sx={{ p: 0.7 }} />
                          </SmallAvatar>
                        </Tooltip>
                      ) : (
                        <Tooltip title={"Add Logo"}>
                          <SmallAvatar
                            onClick={() =>
                              document
                                .getElementById("image-upload-input")
                                .click()
                            }
                            alt="Remy Sharp"
                            sizes="small"
                            sx={{
                              cursor: "pointer",
                              backgroundColor: "lightBlue",
                            }}
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
                    variant="rounded"
                    src={mainDetails?.LogoPath}
                    sx={{
                      width: 100,
                      height: 100,
                      border: 3,
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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                alignItems: "center",
                width: "100%",
                paddingTop: 1,
              }}
            >
              <Typography variant="body1">Preferences</Typography>
              <Box
                sx={{
                  borderBottom: "1px dotted",
                  // borderBottmColor: getBorderColor(),
                  marginLeft: "8px", // Adjust spacing to your preference
                }}
              />
            </Box>

            <ChecKBoxLabel
              label={"Bin Enabled"}
              value={mainDetails}
              changeValue={setMainDetails}
              fieldName={"BinEnabled"}
            />
            <ChecKBoxLabel
              label={"Batch Enabled"}
              value={mainDetails}
              changeValue={setMainDetails}
              fieldName={"BatchEnabled"}
            />

            <ChecKBoxLabel
              label={"SerialNo Enabled"}
              value={mainDetails}
              changeValue={setMainDetails}
              fieldName={"SerialNoEnabled"}
            />

            <ChecKBoxLabel
              label={"Warehouse Header"}
              value={mainDetails}
              changeValue={setMainDetails}
              fieldName={"WarehouseHeader"}
            />
            <UserInputField
              label={"Qty Decimal"}
              name={"QtyDecimal"}
              type={"number"}
              disabled={false}
              mandatory={false}
              value={mainDetails}
              setValue={setMainDetails}
            />

            <UserInputField
              label={"Amt Decimal"}
              name={"AmtDecimal"}
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
        tagId={1}
        selectedDatas={detailPageId ? detailPageId : null}
      />
    </Box>
  );
}
