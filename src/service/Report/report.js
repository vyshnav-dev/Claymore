import { baseUrlMob } from "../../config/config";
import { baseApis } from "../ApiInterceptors/interceptorApi"

const  reportApis = ()=>{
    const {makeAuthorizedRequestBase} = baseApis()

    const getpendingjoborderreport = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "report/getpendingjoborderreport",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };
    const getallocatedjoborderreport = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "report/getjoborderreport",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getunallocatedtechnicianreport = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "report/getunallocatedtechnicianreport",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getriskassessmentreport = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "report/getriskassessmentreport",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const gettimesheetreport = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "report/gettimesheetreport",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getinspectionreport = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "report/getinspectionreport",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };
      
      const getacknowledgementreport = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "report/getacknowledgementreport",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };
      const getapprovereport = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "report/getproductlistreport",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      return {
        getpendingjoborderreport,
        getallocatedjoborderreport,
        getunallocatedtechnicianreport,
        getriskassessmentreport,
        gettimesheetreport,
        getinspectionreport,
        getacknowledgementreport,
        getapprovereport
      }
}

export {reportApis}