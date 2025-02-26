import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/Settings";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useNavigate } from "react-router-dom";
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  Popover,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { logoImage, primaryColor } from "../../config/config";
import Loader from "../Loader/Loader";
import { securityApis } from "../../service/Security/security";
import ConfirmationAlert from "../Alerts/ConfirmationAlert";
import { set } from "lodash";
import { getScreen } from "../../config";

function Header() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menu, setMenu] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [menuId, setMenuId] = React.useState(0);
  const [activeSubMenuId, setActiveSubMenuId] = React.useState(null);
  const [anchorElLogout, setAnchorElLogout] = React.useState(null);
  const [confirmAlert, setConfirmAlert] = React.useState(false);
  const [confirmData, setConfirmData] = React.useState({});
  const { getscreensforuser } = securityApis();

  const userData = JSON.parse(localStorage.getItem("ClaymoreUserData"))[0];

  

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await getscreensforuser();
    
    if (response?.status === "Success") {
      const myObject = JSON.parse(response.result);
   
      setMenu(myObject);
  
    }
     else {
      setMenu([]);
    
    }
  };

  const handleMenuList = () => {
    setAnchorEl(null);
    setAnchorElNav(null); // This line will close the menu
    setActiveSubMenuId(null);
  };

  const handleSubMenu = (event, Id) => {
    const parentArray = menu?.some((list) => list?.Parent === Id?.ScreenId)
    if(!parentArray)
    {
      
     if(Id?.ScreenId === 31)
      {
        navigate("/approve", { state : Id });
      }
    }
    else{
      setAnchorEl(event.currentTarget);
      setMenuId(Id?.ScreenId);
    }
  };
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
    setActiveSubMenuId(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    setActiveSubMenuId(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // console.log('menu',menu);
  
  
  const handleClickEvent = async (menu) => {

    if (menu?.Parent === 6) {
      if (menu?.ScreenId === 24) {
        navigate("/user", { state: menu});
      } else if (menu?.ScreenId === 7) {
        navigate("/role", { state: menu});
      } 
    }
    else if(menu?.Parent === 26){
      if(menu?.ScreenId === 27)
      {
        navigate("/risk", { state:menu });
      }
      else if(menu?.ScreenId === 28)
      {
        navigate("/timesheet", { state:menu });
      }
      else if(menu?.ScreenId === 29)
      {
        navigate("/inspection", { state:menu });
      }
      else if(menu?.ScreenId === 30)
      {
        navigate("/acknowledgement", { state:menu });
      }
    } 
     else if (menu?.Parent === 1) {
      if ((menu?.ScreenId === 2)) {
        navigate("/product", { state: menu });
      } else if (menu?.ScreenId === 3) {
        navigate("/categories", { state: menu });
      } else if (menu?.ScreenId === 4) {
        navigate("/form", { state: menu });
      } else if (menu?.ScreenId === 5) {
        navigate("/sub", { state: menu });
      }
    }  else if (menu?.Parent === 25) {
      if (menu?.ScreenId === 32) {
        navigate("/pending", { state: menu });
      }else if (menu?.ScreenId === 33) {
        navigate("/allocated", { state: menu });
      }
    }
    else if(menu?.Parent === 34){
      if (menu?.ScreenId === 35) {
        navigate("/joborderreport", { state: menu});
      }else if (menu?.ScreenId === 36) {
        navigate("/allocatedjoborder", { state: menu });
      }else if (menu?.ScreenId === 37) {
        navigate("/inspectionreport", { state: menu });
      }else if (menu?.ScreenId === 38) {
        navigate("/unallocated", { state: menu });
      }else if (menu?.ScreenId === 39) {
        navigate("/timesheetreport", { state: menu });
      }else if (menu?.ScreenId === 40) {
        navigate("/riskreport", { state: menu });
      }else if (menu?.ScreenId === 41) {
        navigate("/acknowledgmentreport", { state: menu });
      }else if (menu?.ScreenId === 42) {
        navigate("/authorizereport", { state: menu });
      }
    }
    else {
      navigate("/home");
    }
    handleMenuList();
  };

  const handleMobMenu = (id,menu) => {
    if (id === 5) {
      navigate("/home");
    }
    else if(id === 31)
      {
        navigate("/approve", { state:menu });
        setAnchorElNav(null);
      }
      
    else {
      setActiveSubMenuId(id);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  let menuItems;
  if (activeSubMenuId == null) {
    // Main menu items
    menuItems = menu
      .filter((menuList) => menuList.Parent === null)
      .map((menuList) => (
        <MenuItem
          key={menuList.ScreenId}
          onClick={() => handleMobMenu(menuList.ScreenId,menuList)}
          sx={{
            fontSize: "0.875rem", // Reduce text size for individual MenuItem
            padding: "4px 8px", // Reduce padding (gap) for individual MenuItem
            justifyContent: "flex-start", // Center the content horizontally for individual MenuItem
          }}
        >
          <Typography textAlign="center">{menuList.ScreenName}</Typography>
        </MenuItem>
      ));
  } else {
    // Sub-menu items
    menuItems = [
      <MenuItem key="back" onClick={() => setActiveSubMenuId(null)}>
        <ArrowBackIcon sx={{ color: "black" }} />
      </MenuItem>,
      ...menu
        .filter((menuList) => menuList.Parent === activeSubMenuId)
        .map((menuList) => (
          <MenuItem
            key={menuList.ScreenId}
            onClick={() => handleClickEvent(menuList)}
            sx={{
              fontSize: "0.875rem", // Reduce text size for individual MenuItem
              padding: "4px 8px", // Reduce padding (gap) for individual MenuItem
              justifyContent: "flex-start", // Center the content horizontally for individual MenuItem
            }}
          >
            <Typography textAlign="left">{menuList.ScreenName}</Typography>
          </MenuItem>
        )),
    ];
  }

  const handleLogoutClick = (event) => {
    setAnchorElLogout(event.currentTarget);
  };

  const handleLogoutClose = () => {
    setAnchorElLogout(null);
  };

  const handleConfirmAlert = () => {
    handleLogoutClose();
    setConfirmData({ message: "Logout", type: "danger" });
    setConfirmAlert(true);
  };

  const handleConfirmLogout = () => {
    // Perform the logout action, such as clearing localStorage and navigating to the login page
    setConfirmAlert(false);
    localStorage.removeItem("SangClaymoreAccessToken");
    localStorage.removeItem("SangClaymoreRefreshToken");
    localStorage.removeItem("ClaymoreUserData");
    navigate("/");
  };

  return (
    <>
      <AppBar
        // position="static"
        style={{
          backgroundColor: primaryColor,
          position: "sticky",
          zIndex: 100, // Adjust the z-index as needed
          top: 0,
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
          height:"50px",
          justifyContent:"center"
          
        }}
      >
        <Container maxWidth={false}>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: 5,
            }}
          >
            <img alt="Logo" src={logoImage} style={{ width: 30, height: 30 }} />

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },

                  fontSize: "0.875rem", // Reduce text size for individual MenuItem
                  padding: "4px 8px", // Reduce padding (gap) for individual MenuItem
                  justifyContent: "flex-start", // Center the content horizontally for individual MenuItem
                }}
                slotProps={{
                paper: {
                  sx: {
                    maxHeight: 400,
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#888",
                      borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f0f0f0",
                    },
                    scrollbarWidth: "thin",
                    scrollbarColor: "#888 #f0f0f0",
                  },
                },
              }}
              >
                {menuItems}
              </Menu>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              {menu &&
                menu
                  .filter((menuList) => menuList.Parent === null)
                  .map((menuList, index) => (
                    <Button
                      key={menuList.ScreenId}
                      aria-controls="master-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleSubMenu(e, menuList)}
                      variant="#00498E" // Note: This is not a valid variant, you might want to use 'contained', 'outlined', or 'text'
                      sx={{
                        mr: 0,
                        bgcolor: primaryColor, // Use template literal here
                        color: "white",
                        textTransform: "none",
                      }}
                    >
                      {menuList.ScreenName}
                    </Button>
                  ))}

              <Menu
                id="master-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuList}
                sx={{
                  "& .MuiMenuItem-root": {
                    fontSize: "0.875rem", // Reduce text size
                    padding: "4px 8px", // Reduce the gap between items
                    minWidth: "100px", // Minimum width for each menu item
                    justifyContent: "flex-start", // Center the content horizontally
                  },
                }}
                slotProps={{
                  paper: {
                    sx: {
                      maxHeight: 400,
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "6px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#888",
                        borderRadius: "3px",
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "#f0f0f0",
                      },
                      scrollbarWidth: "thin",
                      scrollbarColor: "#888 #f0f0f0",
                    },
                  },
                }}
              >
                {menu &&
                  menu
                    .filter((menuList) => menuList.Parent === menuId)
                    .map((menuList, index) => (
                      <MenuItem
                        key={menuList.ScreenId}
                        onClick={() => handleClickEvent(menuList)}
                        sx={{
                          fontSize: "0.875rem", // Reduce text size for individual MenuItem
                          padding: "4px 8px", // Reduce padding (gap) for individual MenuItem
                          justifyContent: "center", // Center the content horizontally for individual MenuItem
                        }}
                      >
                        {menuList.ScreenName}
                      </MenuItem>
                    ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Log out">
                <IconButton
                  onClick={handleConfirmAlert}
                  sx={{
                    p: 0,
                    "&:hover": { backgroundColor: "transparent !important" },
                  }}
                >
                  <PowerSettingsNewIcon
                    sx={{ marginRight: "20px", color: "#FFF" }}
                  />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={userData?.LoginName} >
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Stack direction="row" spacing={2}>
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        background: "#fff",
                        color: "gray",
                      }}
                    >
                      {userData?.LoginName?.substring(0, 2)?.toUpperCase()}
                    </Avatar>
                  </Stack>
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          {/* <Popover
            open={Boolean(anchorElLogout)}
            anchorEl={anchorElLogout}
            onClose={handleLogoutClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <DialogContent>
              <DialogContentText>
                Are you sure you want to log out?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleConfirmAlert}
                style={{
                  textTransform: "none",
                  backgroundColor: primaryColor,
                  color: "white",
                }}
              >
                Logout
              </Button>
              <Button
                onClick={handleLogoutClose}
                style={{
                  textTransform: "none",
                  backgroundColor: primaryColor,
                  color: "white",
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Popover> */}
        </Container>
      </AppBar>
      <Loader loader={open} loaderClose={handleClose} />
      <ConfirmationAlert
        handleClose={() => setConfirmAlert(false)}
        open={confirmAlert}
        data={confirmData}
        submite={handleConfirmLogout}
      />
    </>
  );
}
export default Header;
