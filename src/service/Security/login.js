import axios from "axios";
import { baseUrl } from "../../config/config";
import { useAlert } from "../../component/Alerts/AlertContext";

const loginApi = () => {
    const { showAlert,setLoader } = useAlert();
    const handleError = (error) => {
  
        if (!navigator.onLine) {//Not mandatory
          // Handle offline error
          const errorMessage = "No internet connection";
          showAlert('error', errorMessage);
          return
        }
        const url =error?.response?.request?.responseURL;
        if (error.response && error.response.status) {
          switch (error.response.status) {
            case 400: // Bad request
              
              const result = error.response.data.result ? JSON.parse(error.response.data.result) : null;
              if (result && Array.isArray(result) && result[0]?.ErrorMessage) {//4000 with result array with multiple error

                showAlert('info', result[0]?.ErrorMessage);
              } 
              else if(error?.response?.data?.statusCode == 4000){
                showAlert('info', error?.response?.data?.message);
              }
              else if(error?.response?.data?.statusCode == 1000 || error?.response?.data?.statusCode == 1001){
                 // Database error//Display message on UI
                  const dbErrorMessage = "Database Error"
                  showAlert('error', dbErrorMessage);  
              }
              else {
                showAlert('error', error?.response?.data?.message); 
              }
             
              break;
            case 401: // Unauthorized
              break;
            case 403: // Forbidden
            const authorizationErrors = "Access denied, you do not have permission"
            showAlert('warning', authorizationErrors);
              break;
            case 404: // Not Found// display only empty data
    
              if(error.response.statusText == "Not Found")//no records && invalid url
              {
                // const url =error?.response?.request?.responseURL
                const dbNoData = error?.response?.data?.message
                // if(dbNoData)//only show no records
                // showAlert('error', error.response.data.message);
              }
              
              break;
            case 409: // Conflict
              showAlert('error', error?.response?.data?.message);
              break;
            case 500: // Internal Server Error//Need to verufy whether show or not
            
            const errorMessage = "Server error, please try again later"
            if(error?.response?.data?.statusCode == 5000){
              showAlert('info', errorMessage);
              return
            }
           
            showAlert('warning', errorMessage);

              break;
            default:
  
              break;
          }
        } else {
          //console.error('An error occurred:', error.message);
        }
      };
    




  const loginLogin = async (payload) => {
    try {
      const response = await axios.post(`${baseUrl}login/login`, payload);   
 
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };

  const gettagdetails = async (payload) => {
    try {
      const response = await axios.get(`${baseUrl}tag/gettagdetails?tagId=${payload?.tagId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  };

  return {

    loginLogin,
    gettagdetails
  };
};

export {
    loginApi
}
