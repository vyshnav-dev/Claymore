import axios from "axios";
import { baseUrl } from "../../config/config";
import { baseApi } from "../../config/axios";
import { useAlert } from "../../component/Alerts/AlertContext";

let isRefreshing = false;
let failedQueue = [];
let navigateFunction = null;

export const setNavigate = (navigate) => {
  navigateFunction = navigate;
};

export const navigateTo = (path) => {
  if (navigateFunction) {
    navigateFunction(path);
  } else {
  }
};

//Alert Global
export let showAlertGlobal = null;

export const setShowAlert = (showAlert) => {
  if (typeof showAlert === "function") {
    showAlertGlobal = showAlert;
  } else {
    
  }
};


const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};
const addRequestToQueue = (originalRequest) => {
  return new Promise((resolve, reject) => {
    failedQueue.push({
      resolve: (token) => {
        originalRequest.headers["Authorization"] = "Bearer " + token;
        resolve(baseApi(originalRequest));
      },
      reject: (err) => {
        reject(err);
      },
    });
  });
};

// Function to refresh the access token
const refreshToken = async () => {
  const refreshTokenValue = localStorage.getItem("SangClaymoreRefreshToken");
  if (!refreshTokenValue) {
    throw new Error("Refresh token missing or invalid");
  }
  try {
    
    const response = await axios.get(`${baseUrl}login/regeneratetokens?refreshToken=${refreshTokenValue}`);
    const myObject = response?.data
    // Store tokens in localStorage
    localStorage.setItem("SangClaymoreAccessToken", myObject.accessToken);
    localStorage.setItem("SangClaymoreRefreshToken", myObject.refreshToken);

    return myObject.AccessToken;
  } catch (error) {
    console.error("refresh token error", error);
    navigateTo("/");
    localStorage.removeItem("SangClaymoreAccessToken");
    localStorage.removeItem("SangClaymoreRefreshToken");
    if (showAlertGlobal) {
      showAlertGlobal('info','Session expired. Please log in again.');
    }
    // Clear tokens from local storage in case of an error
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");

    throw error;
  }
};

// Interceptor for API requests
baseApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("SangClaymoreAccessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

baseApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
  
    const originalRequest = error.config;

    
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshToken();
          isRefreshing = false;
          // baseApi.defaults.headers.common["Authorization"] =
          //   "Bearer " + newToken;
          processQueue(null, newToken);
          originalRequest._retry = true;
          originalRequest.headers["Authorization"] = "Bearer " + newToken;
          return baseApi(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          // window.location.href = '/';
          localStorage.removeItem("SangClaymoreAccessToken");
          localStorage.removeItem("SangClaymoreRefreshToken");
          navigateTo("/");
          if (showAlertGlobal) {
            showAlertGlobal('info','Session expired. Please log in again.');
          }
          return Promise.reject(refreshError);
        }
      } else {
        return addRequestToQueue(originalRequest).catch((err) => {
          return Promise.reject(err);
        });
      }
      // If a refresh is already in progress, we'll return a promise that resolves with the new token
      return new Promise((resolve, reject) => {
        failedQueue.push((token) => {
          originalRequest._retry = true;
          originalRequest.headers["Authorization"] = "Bearer " + token;
          resolve(baseApi(originalRequest));
        });
      });
    }
    return Promise.reject(error);
  }
);

// Custom hook for API requests
const baseApis = () => {
  const { showAlert, setLoader } = useAlert();

  const accessToken = localStorage.getItem("SangClaymoreAccessToken");

  const handleError = (error) => {
    if (!navigator.onLine) {
      //Not mandatory
      // Handle offline error
      const errorMessage = "No internet connection";
      showAlert("warning", errorMessage);
      return;
    }
    const url = error?.response?.request?.responseURL;
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 400: // Bad request
          const result = error.response.data.result
            ? JSON.parse(error.response.data.result)
            : null;
          if (result && Array.isArray(result) && result[0]?.ErrorMessage) {
            //Just Logging
            showAlert("info", result[0]?.ErrorMessage);
          } else if (error?.response?.data?.statusCode == 4000) {
            showAlert("info", error?.response?.data?.message);
          } else if (
            error?.response?.data?.statusCode == 1000 ||
            error?.response?.data?.statusCode == 1001
          ) {
            // Database error//Display message on UI
            const dbErrorMessage = "Database Error";
            showAlert("error", dbErrorMessage);
          } else {
            showAlert("error", error?.response?.data?.message);
          }

          break;
        case 401: // Unauthorized
          break;
        case 403: // Forbidden
          const authorizationErrors =
            "Access denied, you do not have permission";
          showAlert("warning", authorizationErrors);
          break;
        case 404: // Not Found// display only empty data
          if (error.response.statusText == "Not Found") {
            //no records && invalid url
            // const url =error?.response?.request?.responseURL
            const dbNoData = error?.response?.data?.message;
            return;
          }

          break;
        case 409: // Conflict
          showAlert("error", error?.response?.data?.message);
          break;
        case 500: 
          const errorMessage = "Server error, please try again later";
          if (error?.response?.data?.statusCode == 5000 && accessToken) {
            showAlert("info", errorMessage);
            return;
          }
       
          break;
        default:
          break;
      }
    } else {
     
    }
  };

  const makeAuthorizedRequestBase = async (method, url, params, isLoading) => {
    if (isLoading) {
      setLoader(true);
    }

    const token = localStorage.getItem("SangClaymoreAccessToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // When dealing with FormData, let Axios handle the Content-Type
    if (params instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data"; // This ensures Axios sets the correct type
    } else {
      headers["Content-Type"] = "application/json";
    }

    try {
      let response;
      if (method === "get") {
        response = await baseApi.get(url, { headers, params });
      } else {
        response = await baseApi({
          method: method,
          url: url,
          data: params,
          headers: headers,
        });
      }

      return response;
    } catch (error) {


      handleError(error);
      throw error?.response?.data;
    } finally {
      if (isLoading) {
        setLoader(false);
      }
    }
  };

  return {
    makeAuthorizedRequestBase,
  };
};

export { baseApis };