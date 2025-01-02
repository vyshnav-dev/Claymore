import { baseApis } from "../ApiInterceptors/interceptorApi"

const securityApis = ()=>{
    const {makeAuthorizedRequestBase} = baseApis()

    const getscreensforuser = async () => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "Master/GetScreen",
            {},
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getuseractionsforscreen = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "Master/GetUserAction",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getSecuritysummary = async (payload, url) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            url,
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const deleteuser = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "delete",
            "user/deleteuser",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getuserdetails = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "user/getuserdetails",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const gettimezonelist = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "timezone/gettimezonelist",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getroleslist = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "role/getroleslist",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const upsertuser = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            "user/upsertuser",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getroledetails = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "role/getroledetails",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getscreens = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "user/getscreens",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const checkuserexistence = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "user/checkuserexistence",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const checkrolenameexistence = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "role/checkrolenameexistence",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const deleterole = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "delete",
            "role/deleterole",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getactions = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "role/getactions",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const upsertrole = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            "role/upsertrole",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const uploaduserfile = async (id,payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            `user/uploaduserfile?id=${id}`,
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const deleteuserfile= async (id,payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "delete",
            `user/deleteuserfile?id=${id}&fileName=${payload}`,
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const updatepassword = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            `user/updatepassword?oldPassword=${payload?.oldPassword}&newPassword=${payload?.newPassword}`,
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };


      return {
        getscreensforuser,
        getuseractionsforscreen,
        getSecuritysummary, 
        deleteuser,
        getuserdetails,
        gettimezonelist,
        getroleslist,
        upsertuser,
        getroledetails,
        getscreens,
        checkuserexistence,
        checkrolenameexistence,
        deleterole,
        getactions,
        upsertrole,
        uploaduserfile,
        deleteuserfile,
        updatepassword
      }
}

export {securityApis}