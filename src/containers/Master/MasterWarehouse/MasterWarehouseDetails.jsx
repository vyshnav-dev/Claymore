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
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import PropTypes from "prop-types";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect } from "react";
import ConfirmationAlert from "../../../component/Alerts/ConfirmationAlert";
import ActionButton from "../../../component/Buttons/ActionButton";
import { useAlert } from "../../../component/Alerts/AlertContext";
import {
  primaryColor,
  secondaryColor,
  thirdColor,
} from "../../../config/config";
import UserInputField from "../../../component/InputFields/UserInputField";
import { stockCountApis } from "../../../service/Transaction/stockcount";
import { masterApis } from "../../../service/Master/master";
import MasterSelectionAutoComplete from "./MasterSelectionAutoComplete";
import { MDBIcon } from "mdb-react-ui-kit";
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
            Warehouse Details
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

export default function MasterWarehouseDetails({
  setPageRender,
  detailPageId: summaryId,
  userAction,
  disabledDetailed,
}) {
  const [mainDetails, setMainDetails] = useState({});
  const [companyList, setCompanyList] = useState([]);
  const [detailPageId, setDetailPageId] = useState(summaryId);
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [confirmData, setConfirmData] = useState({});
  const [confirmType, setConfirmType] = useState(null);
  const [property, setProperty] = useState(false);
  const { gettaglist } = stockCountApis();
  const { showAlert } = useAlert();
  const {
    gettagdetails,
    deletetag,
    checkexistenceintag,
    upsertwarehousemaster,
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
          tagId: 13,
        });
        if (response?.status === "Success") {
          const myObject = JSON.parse(response?.result);
          setMainDetails(myObject?.TagInfo[0]);
          setCompanyList([...myObject?.EntityInfo, { BE: 0, BE_Name: null }]);
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
      AltName: null,
      Code: null,
      Id: detailPageId,
      Location: null,
      Name: null,
    });
    setCompanyList([{ BE: 0, BE_Name: null }]);
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

        const filteredCompanyList = companyList
          .filter((item) => item.BE && item.BE !== 0) // Filter out items where BE is 0 or not present
          .map((item) => ({ be: item.BE }));
        if (!filteredCompanyList?.length) emptyFields.push("Entity");
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
    const filteredCompanyList = companyList
      .filter((item) => item.BE && item.BE !== 0) // Filter out items where BE is 0 or not present
      .map((item) => ({ be: item.BE }));
    const saveData = {
      id: mainDetails?.Id,
      name: mainDetails?.Name,
      code: mainDetails?.Code,
      altName: mainDetails?.AltName,
      location: mainDetails?.Location,
      entityInfo: filteredCompanyList,
    };

    const response = await upsertwarehousemaster(saveData);
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
    response = await deletetag([{ id: detailPageId }], 13);
    if (response?.status === "Success") {
      showAlert("success", response?.message);
      handleNew();
      const actionExists = userAction.some((action) => action.Action === "New");
      if (!actionExists) {
        setPageRender(1);
      }
    }
  };

  const handleDeleteRow = (index) => {
    if (companyList?.length <= 1) {
      setCompanyList([{ BE: 0, BE_Name: null }]);
    } else {
      setCompanyList((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleMasterExist = async (type) => {
    try {
      const response = await checkexistenceintag({
        tagId: 13,
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
      tagId: 13,
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

            <UserInputField
              label={"Alt Name"}
              name={"AltName"}
              type={"text"}
              disabled={false}
              mandatory={false}
              value={mainDetails}
              setValue={setMainDetails}
              maxLength={100}
            />

            <UserInputField
              label={"Location"}
              name={"Location"}
              type={"text"}
              disabled={false}
              mandatory={false}
              value={mainDetails}
              setValue={setMainDetails}
              maxLength={100}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                alignItems: "center",
                width: "100%",
                paddingTop: 1,
              }}
            >
              <Typography variant="body1">Entites</Typography>
              <Box
                sx={{
                  borderBottom: "1px dotted",
                  // borderBottmColor: getBorderColor(),
                  marginLeft: "8px", // Adjust spacing to your preference
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: "100%",
            
              }}
            >
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: "70vh",
                  overflowY: "auto",
                  width: "auto",
                  overflowX: { xs: "auto", md: "hidden" }, // Horizontal scroll for small screens
                  m: 1,
                  "&::-webkit-scrollbar": { width: "8px", height: "8px" },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "gray",
                    borderRadius: "4px",
                  },
                }}
              >
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          ...headerCellStyle,
                          textAlign: "center",
                          backgroundColor: secondaryColor,
                          minWidth: { xs: "50px", sm: "60px" }, // Responsive min-widths
                        }}
                      ></TableCell>
                      <TableCell
                        sx={{
                          ...headerCellStyle,
                          backgroundColor: secondaryColor,
                          minWidth: "100px",
                        }}
                      >
                        Entities
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companyList.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        <TableCell
                          sx={{
                            ...bodyCellStyle,
                            minWidth: "60px",
                            textAlign: "center",
                            padding: "0px 4px",
                          }}
                        >
                          {companyList?.length - 1 === index ? null : (
                            <IconButton
                              onClick={() => handleDeleteRow(index)}
                              aria-label="delete"
                              sx={iconsExtraSx}
                            >
                              <Stack direction="column" alignItems="center">
                                <MDBIcon
                                  fas
                                  icon="trash"
                                  style={{ color: primaryColor }}
                                  className="responsiveAction-icon"
                                />
                              </Stack>
                            </IconButton>
                          )}
                        </TableCell>
                        {visibleHeaders.map((header) => (
                          <TableCell
                            key={header}
                            sx={{
                              ...bodyCellStyle,
                              width: {
                                xs: "50%",
                                sm: `${100 / visibleHeaders.length}%`,
                              }, // Responsive widths
                              padding: "0px",
                              textAlign: header === "Batch" ? "center" : null,
                            }}
                          >
                            <MasterSelectionAutoComplete
                              apiKey={gettaglist}
                              autoId={"entity"}
                              formDataName={"BE_Name"}
                              formDataiId={"BE"}
                              required={true}
                              tagId={1}
                              index={index}
                              companyList={companyList}
                              setCompanyList={setCompanyList}
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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

<ConfirmationAlertContent
        handleClose={() => setProperty(false)}
        open={property}
        data={confirmData}
        submite={handlePropertyConfirmation}
        tagId={13}
        selectedDatas={detailPageId ? detailPageId : null}
      />
    </Box>
  );
}
