import { baseApis } from "../ApiInterceptors/interceptorApi"

const  dashboardApis = ()=>{
    const {makeAuthorizedRequestBase} = baseApis()

    const getdashboarddetails = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "dashboard/getdashboarddetails",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };
   

      return {
        getdashboarddetails,
        
      }
}

export {dashboardApis}