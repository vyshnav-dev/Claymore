import { baseUrlMob } from "../../config/config";
import { baseApis } from "../ApiInterceptors/interceptorApi"

const  excessApis = ()=>{
    const {makeAuthorizedRequestBase} = baseApis()

    const getexcessshortagesummary = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "stockreconciliation/getexcessshortagesummary",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getexcessshortagedetails = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "/stockreconciliation/getexcessshortagedetails",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };


      return {
        getexcessshortagesummary,
        getexcessshortagedetails
      }
}

export {excessApis}