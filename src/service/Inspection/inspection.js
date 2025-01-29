import { baseUrlMob } from "../../config/config";
import { baseApis } from "../ApiInterceptors/interceptorApi";

const inspectionApis = () => {
  const { makeAuthorizedRequestBase } = baseApis()

 
  //#region risk Assesment

  const GetRisAssesmentSummary = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "inspection/getriskassessmentsummary",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const GetRiskAssesmentDetails = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "inspection/getriskassessment",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const UpsertRiskAssesment = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "post",
        "Inspection/UpsertRiskAssessment",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteRiskAssesment = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "delete",
        `Inspection/DeleteRiskAssessment`,
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };


  //#region time sheet

  const GetTimeSheetSummary = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "inspection/gettimesheetsummary",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const GetTimeSheetDetails = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "Inspection/GetTimeSheet",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const UpsertTimeSheet = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "post",
        "Inspection/UpsertTimeSheet",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteTimeSheet = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "delete",
        `Inspection/DeleteTimeSheet`,
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

   //#region Inspection form


  const GetInspectionFields = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "inspection/getinspectionfields",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getInspectionSummary = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "inspection/getinspectionsummary",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getInspectionDetails = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "inspection/getinspection",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const upsertInspection = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "post",
        "inspection/upsertinspection",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteInspection = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "delete",
        `inspection/deleteinspection`,
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };
  


   //#region acknowledgement
  
   const getAcknowledgementSummary = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "inspection/getacknowledgementsummary",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getAcknowledgemenDetails = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "inspection/getacknowledgement",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const upsertAcknowledgement = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "post",
        "inspection/upsertacknowledgement",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteAcknowledgement = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "delete",
        `inspection/deleteacknowledgement`,
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };
  

  

  

  return {
    GetRisAssesmentSummary,
    GetRiskAssesmentDetails,
    UpsertRiskAssesment,
    deleteRiskAssesment,
    GetTimeSheetSummary,
    GetTimeSheetDetails,
    UpsertTimeSheet,
    deleteTimeSheet,
    GetInspectionFields,
    getInspectionSummary,
    getInspectionDetails,
    upsertInspection,
    deleteInspection,
    getAcknowledgementSummary,
    getAcknowledgemenDetails,
    upsertAcknowledgement,
    deleteAcknowledgement
  }
}

export { inspectionApis }