import { baseUrlMob } from "../../config/config";
import { baseApis } from "../ApiInterceptors/interceptorApi"

const stockCountApis = ()=>{
    const {makeAuthorizedRequestBase} = baseApis()

    const getstockcountsummary = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "stockcount/getstockcountsummary",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const deletestockcount = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "delete",
            "stockcount/deletestockcount",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getstockcountdetail = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "stockcount/getstockcountdetails",
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
            "tag/getdocno",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getwarehousebyentity = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "tag/getwarehousebyentity",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getproductbyentity = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "tag/getproductbyentity",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const gettaglist = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "tag/gettaglist",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getentitysettings= async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "tag/getentitysettings",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getbinbywarehouse= async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "tag/getbinbywarehouse",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getproductbybin= async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "tag/getproductbybin",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getunitbyproduct = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "tag/getunitbyproduct",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const upsertstockcount = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            "stockcount/upsertstockcount",
            payload,
            false
          );
          return response;
        } catch (error) {
          return error
        }
      };

      const getproductproperties = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "tag/getproductproperties",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      return {
        getstockcountsummary,
        deletestockcount,
        getstockcountdetail,
        getdocno,
        getwarehousebyentity,
        getproductbyentity,
        gettaglist,
        getentitysettings,
        getbinbywarehouse,
        getproductbybin,
        getunitbyproduct,
        upsertstockcount,
        getproductproperties
      }
}

export {stockCountApis}