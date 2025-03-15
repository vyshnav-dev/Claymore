import { baseApis } from "../ApiInterceptors/interceptorApi"

const securityApis = ()=>{
    const {makeAuthorizedRequestBase} = baseApis()

    const getscreensforuser = async () => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "user/getscreens",
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
            "user/getuseraction",
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
            "User/DeleteUser",
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
            "User/GetUserDetails",
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
            "User/GetTimeZone",
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
            "User/GetRole",
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
            "User/UpsertUser",
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
            "Role/GetRoleDetails",
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
            "Role/DeleteRole",
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
            "Role/GetActionList",
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
            `user/uploaduserfiles?id=${id}`,
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      //Delete image or signature
    const deleteuserfile = async (payload) => {
  
      try {
        const response = await makeAuthorizedRequestBase("delete","user/deleteuserfile",payload);
        return response;
      } catch (error) {
        // console.error(error);
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
      const updateuserpassword = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            `user/updateuserpassword?password=${payload?.newPassword}&userId=${payload?.UserId}`,
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
        updatepassword,
        updateuserpassword
      }
}

export {securityApis}