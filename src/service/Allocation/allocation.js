import { baseUrlMob } from "../../config/config";
import { baseApis } from "../ApiInterceptors/interceptorApi";

const allocationApis = () => {
  const { makeAuthorizedRequestBase } = baseApis()

  //#region Technician
  const GetTechnicianList = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "Allocation/GetTechnician",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  //#region pending Job Orders

  const GetJobOrderSummary = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "Allocation/GetPendingJobOrderSummary",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const UpsertJobOrderAllocation = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "post",
        "Allocation/UpsertJobOrderAllocation",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  

  const GetPendingJobOrderdetails = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "Allocation/GetPendingJobOrder",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  //#region Allocated Job Orders

  const GetAllocatedJobOrderSummary = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "Allocation/GetAllocatedJobOrderSummary",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };
  const GetAllocatedJobOrderDetails = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "Allocation/GetJobOrderAllocation",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteAllocatedJobOrder = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "delete",
        `Allocation/DeleteJobOrderAllocation`,
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  //#region Client list

  const getclientlist = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "allocation/getclientlist",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  //#region prev-next

  const getrecordprevnext = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "allocation/getrecordnoprevnext",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };
  
   //# Suspend

   const updateproductsuspend = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "post",
        "allocation/updateproductsuspend",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };



  
  

  return {
    GetTechnicianList,
    GetJobOrderSummary,
    deleteAllocatedJobOrder,
    GetPendingJobOrderdetails,
    UpsertJobOrderAllocation,
    GetAllocatedJobOrderSummary,
    GetAllocatedJobOrderDetails,
    getclientlist,
    getrecordprevnext,
    updateproductsuspend
  }
}

export { allocationApis }