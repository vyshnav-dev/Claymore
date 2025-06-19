import React, { useState } from "react";
import {
  Alert,
  IconButton,
  Tooltip,
  Box,
  Button,
  Typography,
  Slide,
  keyframes,
  styled,
  useMediaQuery,
  Grid,
  ButtonGroup,
} from "@mui/material";
import { useEffect } from "react";
import { securityApis } from "../../service/Security/security";
import { useNavigate } from "react-router-dom";
import { FixedValues, primaryColor, secondaryColor } from "../../config/config";
import DashboardBox from "./DashboardCard";
import BarChart from "./BarChart";
import { dashboardApis } from "../../service/Dashboard/dashboard";
import UserInputField from "../../component/InputFields/UserInputField";
import { inspectionApis } from "../../service/Inspection/inspection";
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import AlertComponent from "./AlertComponent";
import CloseIcon from "@mui/icons-material/Close";

const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360); // Random hue (0-360)
  const saturation = Math.floor(Math.random() * 50) + 50; // Keep saturation 50-100%
  const lightness = Math.floor(Math.random() * 30) + 10; // Keep lightness low (10-40%)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};



// Keyframes for shake animation
const shakeAnimation = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-10px); }
  40%, 80% { transform: translateX(10px); }
`;

// Styled IconButton with conditional animation
const ShakingIconButton = styled(IconButton)(({ isshaking }) => ({
  position: "fixed",
  top: 60,
  right: 20,
  // backgroundColor: "#fff8e1", 
  // border: "1px solid #f57c00",
  animation: isshaking ? `${shakeAnimation} 0.5s ease-in-out infinite` : "none",
}));
const currentDate = new Date().toLocaleDateString("en-CA");
export default function Dashboard() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [shake, setShake] = useState(true);
  const [userAction, setuserAction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popupopen, setPopUpOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [type, setType] = useState(1)
  const [show, setShow] = useState(false)

  const [dateform, setDateForm] = useState({
    fromDate: currentDate,
    toDate: currentDate,
  });
  const [cardData, setCardData] = useState([]);
  const [charts, setCharts] = useState([])

  const { getdashboarddetails } = dashboardApis();
  const { getuseractionsforscreen } = securityApis();
  const { getpendingapproval } = inspectionApis();

  const isXlDevices = useMediaQuery("(min-width: 1600px)");
  const isLgDevices = useMediaQuery("(min-width: 1200px)");
  const isMdDevices = useMediaQuery("(min-width: 900px)");
  const isSmDevices = useMediaQuery("(min-width: 600px)");

  const navigate = useNavigate();

  const handleNotificationClick = () => {
    setShake(false); // Start the shake animation
    setAlertVisible(true);
    setTimeout(() => setShake(false), 1000); // Stop shaking after 2 seconds
  };

  useEffect(() => {
    if (shake) {
      setTimeout(() => setShake(false), 1000); // Stop shaking after 2 seconds
    }
  }, [shake]);


  const gridColumns = isXlDevices
    ? "repeat(12, 1fr)"
    : isLgDevices
      ? "repeat(4, 1fr)"
      : isMdDevices
        ? "repeat(3, 1fr)"
        : isSmDevices
          ? "repeat(2, 1fr)"
          : "repeat(1, 1fr)";

  useEffect(() => {
    const fetchUserActions = async () => {
      try {
        // Call both APIs using Promise.all for concurrent execution
        const [userActionsResponse] = await Promise.all([
          getuseractionsforscreen({ ScreenId: FixedValues.DashBoardMenuId }),
        ]);

        // Process user actions response
        if (userActionsResponse?.result) {
          const userActionsData = JSON.parse(userActionsResponse.result);
          setuserAction(userActionsData);
        }


      } catch (error) {
        navigate("/home");
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };
    fetchUserActions();
  }, []);

  useEffect(() => {
    const fetchNotification = async () => {
      setShake(true)
      try {
        const response = await getpendingapproval();
        if (response?.result) {
          const data = JSON.parse(response.result);
          setRows(data);
        }
      } catch (error) {
        throw error
        console.error("Error fetching notifications:", error);
      }
    };



    if (
      !loading &&
      !alertVisible &&
      userAction.some((action) => action.ActionId == 13)
    ) {
      fetchNotification(); // Initial call
      const interval = setInterval(fetchNotification, 60000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [loading]);


  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const handleNotificationPopupOpen = () => {
    setPopUpOpen(true);
  };
  const handleNotificationPopupClose = () => {
    setPopUpOpen(false);
    setAlertVisible(false);
  };




  useEffect(() => {
    const controller = new AbortController(); // Create an abort controller
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const [response1] = await Promise.all([getdashboarddetails(dateform)]);

        if (signal.aborted) return; // Stop if request was aborted

        // Handle first API response
        if (response1?.status === "Success") {
          const data1 = JSON.parse(response1.result);
          setCardData(data1?.metrics);
          setCharts(data1?.charts)
        } else {
          setCardData([]);
          setCharts([])
        }

        // Handle second API response
      } catch (error) {
        if (!signal.aborted) {
          console.error("Error fetching dashboard data:", error);
        }
      }
    };

    fetchData();

    return () => controller.abort(); // Cleanup: Abort fetch if component unmounts
  }, [dateform]);



  const handleCardData = (dataType) => {

    dataType !== 5 ? setShow(false) :setShow(true);

    setType(dataType);
    const today = new Date();
    let fromDate = currentDate;
    let toDate = currentDate;

    if (dataType === 2) {
      // This Week (Monday to today)
      const firstDayOfWeek = new Date(today);
      const day = today.getDay(); // 0 (Sunday) to 6 (Saturday)
      const diff = day === 0 ? 6 : day - 1; // Make Monday (1) the first day
      firstDayOfWeek.setDate(today.getDate() - diff);
      fromDate = firstDayOfWeek.toLocaleDateString("en-CA");
    } else if (dataType === 3) {
      // This Month (1st day of month to today)
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      fromDate = firstDayOfMonth.toLocaleDateString("en-CA");
    } else if (dataType === 4) {
      // This Year (Jan 1st to today)
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
      fromDate = firstDayOfYear.toLocaleDateString("en-CA");
    } 

    setDateForm({ fromDate, toDate });
  };


  const handleDate = (data) => {
    setDateForm(data);
    setType(0);
  }



  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack on small screens, row on larger
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 1, sm: 2 }, // Adjust gap for smaller screens
          mt: 2,
          width: "100%",
        }}
      >
        <ButtonGroup variant="outlined" aria-label="Basic button group">
          <Button
            onClick={() => handleCardData(1)}
            sx={{
              textTransform: "none",
              backgroundColor: type === 1 ? secondaryColor : null,
              color: type === 1 ? "white" : null,
            }}
          >
            Today
          </Button>
          <Button
            onClick={() => handleCardData(2)}
            sx={{
              textTransform: "none",
              backgroundColor: type === 2 ? secondaryColor : null,
              color: type === 2 ? "white" : null,
            }}
          >
            This Week
          </Button>
          <Button
            onClick={() => handleCardData(3)}
            sx={{
              textTransform: "none",
              backgroundColor: type === 3 ? secondaryColor : null,
              color: type === 3 ? "white" : null,
            }}
          >
            This Month
          </Button>
          <Button
            onClick={() => handleCardData(4)}
            sx={{
              textTransform: "none",
              backgroundColor: type === 4 ? secondaryColor : null,
              color: type === 4 ? "white" : null,
            }}
          >
            This Year
          </Button>
          <Button
            onClick={() => handleCardData(5)}
            sx={{
              textTransform: "none",
              backgroundColor: type === 5 ? secondaryColor : null,
              color: type === 5 ? "white" : null,
            }}
          >
            Customize
          </Button>
        </ButtonGroup>
      </Box>
      
        <Box sx={{ display: "flex", justifyContent: 'center', gap: 2, flexWrap: 'wrap', m: 2 }}>
        {show &&
        <>
          <UserInputField
            label={"From Date"}
            name={"fromDate"}
            type={"date"}
            disabled={false}
            mandatory={true}
            value={dateform}
            setValue={(data) => { handleDate(data) }}
            max={currentDate}
          />

          <UserInputField
            label={"To Date"}
            name={"toDate"}
            type={"date"}
            disabled={false}
            mandatory={true}
            value={dateform}
            setValue={(data) => { handleDate(data) }}
            max={currentDate}
          />
          </>
        }
        </Box>
      

      <Box m="8px">
        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns={gridColumns}
          gridAutoRows="140px"
          gap="10px"
        >
          {cardData.map((item, index) => {
            const bgColor = getRandomColor(); // Generate a new color for each card
            return (
              <Box
                key={index}
                width="100%"
                bgcolor={bgColor} // Assign random color
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                borderRadius="8px"
                p={2}
                sx={{
                  cursor: "pointer",
                  boxShadow: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <DashboardBox
                  title={item.value || 0}
                  subtitle={item.label.replace(/([A-Z])/g, " $1").trim()}
                  progress="0.75"
                  bgColor={bgColor} // Pass color for consistency
                />
              </Box>
            );
          })}
        </Box>
      </Box>


      {/* GRID & CHARTS */}

      <Box sx={{ padding: 2, width: "100%" }}>
        <Grid container spacing={2} justifyContent="center">
          {charts.map((chart, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              {chart.type === "vertical_bar" ? (
                <BarChart
                  BarChartData={chart.data || []}
                  xAxis="label"
                  yAxis="value"
                  labelName={chart.title}
                />
              ) : chart.type === "pie" ? (
                <BasicPie cardShowData={chart.data} title={chart.title} />
              ) : (
                <Typography variant="body1">Unsupported chart type</Typography>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>


      {/* Notification Icon */}
      {!loading &&
        !alertVisible &&
        userAction.some((action) => action.ActionId == 13) &&
        rows.length > 0 && (
          <Tooltip title="Authorize Orders">
            <ShakingIconButton
              isshaking={shake}
              onClick={handleNotificationClick}
            >
              <MarkUnreadChatAltIcon sx={{ fontSize: '35px' }} color="warning" />
            </ShakingIconButton>
          </Tooltip>
        )}

      {/* Alert Popup */}
      {!loading &&
        alertVisible &&
        userAction.some((action) => action.ActionId == 13) &&
        rows.length > 0 && (
          <Slide direction="left" in={alertVisible} mountOnEnter unmountOnExit>
            <Box
              sx={{
                position: "fixed",
                top: 60,
                right: 20,
                maxWidth: 300,
                zIndex: 1300,
              }}
            >
              <Alert
                severity="warning"
                icon={<MarkUnreadChatAltIcon />}
                action={
                  <>
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleNotificationPopupOpen}
                    >
                      View
                    </Button>
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={handleCloseAlert}
                    >
                      <CloseIcon />
                    </IconButton>
                  </>
                }
              >
                <Typography variant="body2">
                  You have Job Orders to Authorize.
                </Typography>
              </Alert>
            </Box>
          </Slide>
        )}

      <AlertComponent
        open={popupopen}
        onClose={handleNotificationPopupClose}
        rows={rows}
      />

    </div>
  );
}
