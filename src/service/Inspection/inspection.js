import { baseUrlMob } from "../../config/config";
import { baseApis } from "../ApiInterceptors/interceptorApi";

const inspectionApis = () => {
  const { makeAuthorizedRequestBase } = baseApis()

 
  //#region inspection common apis

  const getAssignjoborderlist = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "allocation/getjoborderlist",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };


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

  const getFormdata = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "inspection/getformdata",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };


  const getriskjoborderdetails = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "allocation/getjoborderdetails",
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


  const getjoborderproductlistsummary = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "allocation/getjoborderproductlistsummary",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };




  const getdocno = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "allocation/getdocno",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };
  const getjoborderheaddetails = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "allocation/getjoborderdetails",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };
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
  const getexaminationform = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "inspection/getexaminationform",
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

  const uploadAttachfiles = async (id,payload) => {

    try {
      const response = await makeAuthorizedRequestBase("post", `/inspection/uploadinspectionattachments?id=${id}`, payload, true);
      return response;
    } catch (error) {
      // console.error(error);
      throw error;
    }
  };
 //Delete file
 const deleteattachments = async (payload) => {
  
  try {
    const response = await makeAuthorizedRequestBase("delete","/inspection/deleteinspectionattachments",payload);
    return response;
  } catch (error) {
    // console.error(error);
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
  
  //#region aproove

  const upsertApprove = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "post",
        "approve/upsertapprove",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const upsertmultiapprove = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "post",
        "approve/upsertmultiapprove",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const generatecertificate = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "document/generatecertificate",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getpendingapproval = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "approve/getpendingapproval",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const generatepdfprint = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "document/generatepdfprint",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };




  

  

  return {
    getAssignjoborderlist,
    GetRisAssesmentSummary,
    GetRiskAssesmentDetails,
    UpsertRiskAssesment,
    deleteRiskAssesment,
    getFormdata,
    getriskjoborderdetails,
    GetTimeSheetSummary,
    GetTimeSheetDetails,
    UpsertTimeSheet,
    deleteTimeSheet,
    getjoborderproductlistsummary,
    getdocno,
    getjoborderheaddetails,
    GetInspectionFields,
    getexaminationform,
    getInspectionSummary,
    getInspectionDetails,
    upsertInspection,
    deleteInspection,
    uploadAttachfiles,
    deleteattachments,
    getAcknowledgementSummary,
    getAcknowledgemenDetails,
    upsertAcknowledgement,
    deleteAcknowledgement,
    upsertApprove,
    generatecertificate,
    getpendingapproval,
    generatepdfprint,
    upsertmultiapprove
  }
}

export { inspectionApis }