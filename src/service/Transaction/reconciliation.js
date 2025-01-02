import { baseUrlMob } from "../../config/config";
import { baseApis } from "../ApiInterceptors/interceptorApi"

const reconciliationApis = ()=>{
    const {makeAuthorizedRequestBase} = baseApis()

    const getreconciliationdata = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "stockreconciliation/getreconciliationdata",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const checkreconciliationpostexistence = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "stockreconciliation/checkreconciliationpostexistence",
            payload,
            false
          );
          return response;
        } catch (error) {
          return error;
        }
      };

      const postexcessshortage = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            "stockreconciliation/postexcessshortage",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      return {
        getreconciliationdata,
        checkreconciliationpostexistence,
        postexcessshortage
      }
}

export {reconciliationApis}