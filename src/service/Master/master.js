
import { baseApis } from "../ApiInterceptors/interceptorApi";

const masterApis = () => {
  const { makeAuthorizedRequestBase } = baseApis()

  //#region Product

  const GetProductSummary = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "Master/GetProductSummary",
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
        "Master/UpsertProduct",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteProduct = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "delete",
        `master/deleteproduct`,
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getProductdetails = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "master/getproductdetails",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getproductlist = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "allocation/getproduct",
        payload,
        false
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  //#region Category

  const GetCategorySummary = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "Master/GetInspectionCategorySummary",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const upsertcategorytmaster = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "post",
        "Master/UpsertCategory",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteCategory = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "delete",
        `Master/DeleteCategory`,
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getCategorydetails = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "Master/GetInspectionCategoryWithId",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getcategorylist = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "master/getproductcategorylist",
        payload,
        false
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  //#region Sub Category

  const GetSubCategorySummary = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "Master/GetInspectionSubCategorySummary",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const upsertSubcategorytmaster = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "post",
        "Master/UpsertSubCategory",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteSubCategory = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "delete",
        `Master/DeleteSubCategory`,
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getSubCategorydetails = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "Master/GetInspectionSubCategoryWithId",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

   //#region Product Fieldmaster

   const GetDatatype = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "Master/GetDatatype",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

   const upsertProductFieldmaster = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "post",
        "Master/UpsertProductField",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const GetProductFieldList = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "Master/GetProductFieldList",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };
  const GetProductFieldDetails = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "Master/GetProductFieldWithId",
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const ProductFieldCheck = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "get",
        "Master/ProductFieldCheck",
        payload,
        false
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const DeleteProductField = async (payload) => {
    try {
      const response = await makeAuthorizedRequestBase(
        "delete",
        `Master/DeleteProductField?Id=${payload.Id}`,
        payload,
        true
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  

  return {
    GetProductSummary,
    deleteProduct,
    getProductdetails,
    upsertproductmaster,
    getproductlist,
    GetCategorySummary,
    deleteCategory,
    getCategorydetails,
    upsertcategorytmaster,
    getcategorylist,
    GetSubCategorySummary,
    upsertSubcategorytmaster,
    getSubCategorydetails,
    deleteSubCategory,
    upsertProductFieldmaster,
    GetDatatype,
    GetProductFieldList,
    GetProductFieldDetails,
    ProductFieldCheck,
    DeleteProductField,
  }
}

export { masterApis }