import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import LoginContainer from "./containers/LoginContainer/LoginContainer";
import Dashboard from "./containers/Home/Dashboard";
import Header from "./component/Header/Header";
import UserContainer from "./containers/Security/User/UserContainer";
import RoleContainer from "./containers/Security/Role/RoleContainer";
import Footer from "./component/Footer/Footer";
import LoginFooter from "./component/Footer/LoginFooter";
import MasterProductContainer from "./containers/Master/MasterProduct/MasterProductContainer";
import ProtectedRoute from "./component/ProtectedRoute/ProtectedRoute";
import PublicRoute from "./component/ProtectedRoute/PublicRoute";
import ResetPasswordContainer from "./containers/Security/ResetPassword/ResetPasswordContainer";
import { setNavigate, setShowAlert } from "./service/ApiInterceptors/interceptorApi";
import { Box } from "@mui/material";

import { useAlert } from "./component/Alerts/AlertContext";
import RiskAssesmentContainer from "./containers/RiskAssesment/RiskAssesmentContainer";
import TimeRecordContainer from "./containers/TimeRecord/TimeRecordContainer";
import MasterCategoriesContainer from "./containers/Master/MasterCategories/MasterCategoriesContainer";
import AllocationContainer from "./containers/Allocation/AllocationContainer";
import AckContainer from "./containers/Acknowedgement/AckContainer";
import PDContainer from "./containers/Master/ProductDescripton/PDContainer";
import FormBodyContainer from "./containers/Master/MasterBody/FormBodyContainer";
import InspContainer from "./containers/Inspection/InspContainer";
import AllocatedContainer from "./containers/Allocated/AllocatedContainer";
import JobOrderReportContainer from "./containers/Report/JobOrderReport/JobOrderReportContainer";
import TechncianReportContainer from "./containers/Report/TechnicianReport/TechncianReportContainer";
import TimeSheetReportContainer from "./containers/Report/TimeSheetReport/TimeSheetReportContainer";
import RiskAssessmentReportContainer from "./containers/Report/RiskAssessmentReport/RiskAssessmentReportContainer";
import AllocatedJobReportContainer from "./containers/Report/AllocatedJobOrderReport/AllocatedJobReportContainer";
import InspectionReportContainer from "./containers/Report/InspectionReport/InspectionReportContainer";
import AcknowledgmentReportContainer from "./containers/Report/AcknowledgmentReport/AcknowledgmentReportContainer";

export default function RoutePath() {
  const location = useLocation();
  const showHeader = location.pathname !== "/"; // Don't show Header on the login page (/)
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (navigate) setNavigate(navigate); // Set the navigate function globally
    if (showAlert)
      setShowAlert(showAlert);
  }, [navigate, showAlert]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Ensures full viewport height
        backgroundColor: !showHeader ? "#3b71ca" : null,
        scrollbarWidth: "thin"
      }}
    >
      {showHeader && <Header />}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "thin"
          // Adjust '120px' based on the combined height of your header and footer
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: "auto", // Adjust height dynamically (subtracting header/footer)
            overflowY: "auto", // Enable vertical scrolling
            scrollbarWidth: "thin", // Firefox-specific property for thin scrollbar


          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LoginContainer />
                </PublicRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/role"
              element={
                <ProtectedRoute>
                  <RoleContainer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/product"
              element={
                <ProtectedRoute>
                  <MasterProductContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <MasterCategoriesContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sub"
              element={
                <ProtectedRoute>
                  <PDContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/form"
              element={
                <ProtectedRoute>
                  <FormBodyContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pending"
              element={
                <ProtectedRoute>
                  <AllocationContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/allocated"
              element={
                <ProtectedRoute>
                  <AllocatedContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inspection"
              element={
                <ProtectedRoute>
                  <InspContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/acknowledgement"
              element={
                <ProtectedRoute>
                  <AckContainer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/risk"
              element={
                <ProtectedRoute>
                  <RiskAssesmentContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approve"
              element={
                <ProtectedRoute>
                  <InspContainer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/timesheet"
              element={
                <ProtectedRoute>
                  <TimeRecordContainer />
                </ProtectedRoute>
              }
            />


            <Route
              path="/reset-password"
              element={
                <ProtectedRoute>
                  <ResetPasswordContainer />
                </ProtectedRoute>
              }
            />

            {/* --------REPORT SECTION--------- */}

            <Route
              path="/joborderreport"
              element={
                <ProtectedRoute>
                  <JobOrderReportContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/allocatedjoborder"
              element={
                <ProtectedRoute>
                  <AllocatedJobReportContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/unallocated"
              element={
                <ProtectedRoute>
                  <TechncianReportContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/riskreport"
              element={
                <ProtectedRoute>
                  <RiskAssessmentReportContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/timesheetreport"
              element={
                <ProtectedRoute>
                  <TimeSheetReportContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inspectionreport"
              element={
                <ProtectedRoute>
                  <InspectionReportContainer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/acknowledgmentreport"
              element={
                <ProtectedRoute>
                  <AcknowledgmentReportContainer />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
      </div>

      {showHeader ? <Footer /> : null}
    </div>
  );
}
