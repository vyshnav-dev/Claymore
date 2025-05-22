import React, { useEffect, useRef, useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../service/Security/login";
import { Autocomplete, Box, Paper, TextField, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Loader from "../../component/Loader/Loader";
import ValidationAlert from "../../component/Alerts/ValidationAlert";
import claymore from "/Images/Claymore-.png";
import sangsolution from "/Images/CSSC logo.jpg";
import { encrypt } from "../../service/Security/encryptionUtils";


// Custom styles for TextField
const textFieldStyle = {
  width: "100%",
  color: "#332d2d",
  "& .MuiInputBase-root": {
    height: 40,
  },
  "& .MuiInputLabel-root": {
    transform: "translate(10px, 10px) scale(0.9)",
  },
  "& .MuiInputLabel-shrink": {
    transform: "translate(14px, -9px) scale(0.75)",
  },
  "& .MuiInputBase-input": {
    fontSize: "0.90rem",
  },
};

// Custom style for error text
const errorTextStyle = {
  color: "red",
  fontSize: "0.75rem",
  marginTop: "4px",
};

export default function LoginContainer() {
  const { loginLogin } = loginApi();
  const navigate = useNavigate();

  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(false);
  const [warning, setWarning] = useState(false);
  const [warningData, setWarningData] = useState({});

  const [tabPressed, setTabPressed] = useState(false);
  const companyInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Effect to handle closing dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        companyInputRef.current &&
        !companyInputRef.current.contains(event.target)
      ) {
        setFilteredCompanies([]);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const loaderOpen = () => setLoader(true);
  const loaderClose = () => setLoader(false);
  const warningOpen = () => setWarning(true);
  const warningClose = () => setWarning(false);

  // Function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate fields
    if (!formData.loginName) newErrors.loginName = "Login Name is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    handleLogin();
    // if (Array.isArray(filteredCompanies) && filteredCompanies.length !== 0) {
    //   handleLogin();
    // } else {
    //   await fetchCompanyAndLogin();
    // }
  };


  const handleLogin = async () => {
    try {
      loaderOpen();
      const encryptedPassword = await encrypt(formData.password); // Encrypt the password
      const submitData = {
        ...formData,
        entityId: 1,
        password: encryptedPassword,
        channelId: 1
      };

      const response = await loginLogin(submitData);
      loaderClose();

      if (response?.status === "Success") {

        localStorage.setItem("SangClaymoreAccessToken", JSON.parse(response?.result?.accessToken));
        localStorage.setItem("SangClaymoreRefreshToken", JSON.parse(response?.result?.refreshToken));
        localStorage.setItem("ClaymoreUserData", response?.result?.userData);

        showWarning(response?.message, "success");
        navigate("/home");
      } else {

        showWarning(response?.message, "error");
      }
    } catch (error) {
      loaderClose();
      showWarning("Something went wrong. Please try again.", "error");
    }
  };



  const showWarning = (message, type) => {
    warningOpen();
    setWarningData({ message, type });
  };

  // Input handlers
  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };



  const handleKeyDown = (event) => {
    if (event.key === "Tab") setTabPressed(true);
  };

  // const handleBlur = () => {
  //   if (tabPressed) {
  //     setTabPressed(false);
  //     fetchCompanyAndLogin();
  //   }
  // };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#141b2d",
        minHeight: "100vh",
        padding: "0",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          display: "flex",
          minWidth: "100%",
          height: "100vh",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",

        }}
      >

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            // borderRadius: "10px",
            maxWidth: "500px",
            width: "100%", // Ensure the width spans 90% of the screen
            color: "white",
            flexDirection: "column",
            backgroundColor: "#141b2d",
            height: "100%"

          }}
        >


          <Box
            sx={{
              width: "100%",
              maxWidth: "400px",
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 5, gap: 2 }}>
              <img alt="Logo" src={sangsolution} style={{ width: 180, height: 120 }} />
            </Box>
            <form onSubmit={handleFormSubmit}>
              <Box mb={errors.loginName ? 1 : 3}>
                <TextField
                  size="small"
                  id="loginName"
                  value={formData?.loginName || ""}
                  onChange={(e) =>
                    handleInputChange("loginName", e.target.value)
                  }
                  onKeyDown={handleKeyDown} // Detect if Tab is pressed
                  type="text"
                  label="ID"
                  autoComplete="off"
                  autoFocus
                  error={!!errors.loginName}
                  sx={textFieldStyle}
                />
                {errors.loginName && (
                  <Typography sx={errorTextStyle}>
                    {errors.loginName}
                  </Typography>
                )}
              </Box>
              <Box mb={errors.password ? 1 : 3} className="position-relative">
                <TextField
                  size="small"
                  id="password"
                  label="Password"
                  autoComplete="off"
                  type={showPassword ? "text" : "password"}
                  value={formData?.password || ""}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  error={!!errors.password}
                  sx={textFieldStyle}
                  InputProps={{
                    endAdornment: (
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "10px",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon color="primary" />
                        ) : (
                          <VisibilityIcon color="primary" />
                        )}
                      </div>
                    ),
                  }}
                />
                {errors.password && (
                  <Typography sx={errorTextStyle}>
                    {errors.password}
                  </Typography>
                )}
              </Box>

              <MDBBtn

                className="w-100 mt-4"
                size="md"
                type="submit"
              >
                Login
              </MDBBtn>
            </form>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flex: 0.6,
            alignItems: "center",
            justifyContent: "end",
            backgroundColor: "#141b2d",
            height: "95%",
            borderRadius: '3%'
          }}
        >
          <img
            src={claymore}
            alt="Company Logo"
            style={{
              width: "100%",
              height: "100%", // Maintain aspect ratio
              maxWidth: "100%", // Optional: Limit maximum width
              maxHeight: "95%", // Optional: Limit maximum width

            }}
          />

        </Box>
      </Box>

      <Loader loader={loader} loaderClose={loaderClose} />
      <ValidationAlert
        open={warning}
        handleClose={warningClose}
        data={warningData}
      />
    </Box>
  );
}
