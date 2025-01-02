import { baseUrlMob } from "../../config/config";
import { baseApis } from "../ApiInterceptors/interceptorApi"

const  reportApis = ()=>{
    const {makeAuthorizedRequestBase} = baseApis()

    const getstockcountreport = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "reports/getstockcountreport",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getstockclosereport = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "reports/getstockclosereport",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getexcessshortagereport = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "reports/getexcessshortagereport",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      return {
        getstockcountreport,
        getstockclosereport,
        getexcessshortagereport
      }
}

export {reportApis}