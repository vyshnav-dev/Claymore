import { baseUrlMob } from "../../config/config";
import { baseApis } from "../ApiInterceptors/interceptorApi";

const  masterApis = ()=>{
    const {makeAuthorizedRequestBase} = baseApis()

    const gettagsummary = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "tag/gettagsummary",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const deletetag = async (payload,tagId) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "delete",
            `tag/deletetag?tagId=${tagId}`,
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const gettagdetails = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "tag/gettagdetails",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const checkexistenceintag = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "tag/checkexistenceintag",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const gettagparentlist = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "tag/gettagparentlist",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const getstatebycountry = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "tag/getstatebycountry",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      
      const upsertentitymaster = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            "tag/upsertentitymaster",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const uploadentitylogofile = async (id,payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            `tag/uploadentitylogofile?id=${id}`,
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const deleteentitylogofile= async (id,payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "delete",
            `tag/deleteentitylogofile?id=${id}&fileName=${payload}`,
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const upsertwarehousemaster = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            "tag/upsertwarehousemaster",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const upsertbinmaster = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            "tag/upsertbinmaster",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const upsertunitmaster = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            "tag/upsertunitmaster",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const upsertproductmaster = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            "tag/upsertproductmaster",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const updatetagproperties = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            "tagproperties/updatetagproperties",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      
      const updateproductproperties = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            "tagproperties/updateproductproperties",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const gettagpropertiesdetails= async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "tagproperties/gettagpropertiesdetails",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const updatetagparent = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            "tag/updatetagparent",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const gettagurl = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "tag/gettagurl",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };
   
      return {
        gettagsummary,
        deletetag,
        gettagdetails,
        checkexistenceintag,
        getstatebycountry,
        upsertentitymaster,
        uploadentitylogofile,
        deleteentitylogofile,
        upsertwarehousemaster,
        upsertbinmaster,
        upsertunitmaster,
        gettagparentlist,
        upsertproductmaster,
        updatetagproperties,
        updateproductproperties,
        gettagpropertiesdetails,
        updatetagparent,
        gettagurl
      }
}

export {masterApis}