import { baseUrlMob } from "../../config/config";
import { baseApis } from "../ApiInterceptors/interceptorApi"

const closeStockCountApis = ()=>{
    const {makeAuthorizedRequestBase} = baseApis()

    const getstockclosesummary = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "stockclose/getstockclosesummary",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const deletestockclose = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "delete",
            "/stockclose/deletestockclose",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getstockclosedetails = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "stockclose/getstockclosedetails",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const upsertstockclose = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            "stockclose/upsertstockclose",
            payload,
            true
          );
          return response;
        } catch (error) {
          return error;
        }
      };

      return {
        getstockclosesummary,
        deletestockclose,
        getstockclosedetails,
        upsertstockclose
     
      }
}

export {closeStockCountApis}