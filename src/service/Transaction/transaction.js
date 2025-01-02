import { baseApis } from "../ApiInterceptors/interceptorApi"

const transactionApis = ()=>{
    const {makeAuthorizedRequestBase} = baseApis()

    const getTransactionSummary = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "Transaction/GetTransactionSummary",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

      const GetDocNo = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "Transaction/GetDocNo",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };
      const GetMasters = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "Master/GetMasters",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };
      const GetProductUnit = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "Master/GetProductUnit",
            payload,
            false
          );
          return response;
        } catch (error) {
          throw error;
        }
      };
      const GetSettings = async () => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "Master/GetSettings",
            {},
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };
      const UpsertRequest = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            "Transaction/UpsertRequest",
            payload,
            false
          );
          return response;
        } catch (error) {
          return error
        }
      };
      const GetTransactionDetails = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "get",
            "Transaction/GetTransactionDetails",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };
      const UpsertOrder = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "post",
            "Transaction/UpsertOrder",
            payload,
            false
          );
          return response;
        } catch (error) {
          return error
        }
      };

      const DeleteTransactions = async (payload) => {
        try {
          const response = await makeAuthorizedRequestBase(
            "delete",
            "Transaction/DeleteTransactions",
            payload,
            true
          );
          return response;
        } catch (error) {
          throw error;
        }
      };

     

      return {
        getTransactionSummary,
        GetDocNo,
        GetMasters,
        GetProductUnit,
        GetSettings,
        UpsertRequest,
        GetTransactionDetails,
        UpsertOrder,
        DeleteTransactions,
        
      }
}

export {transactionApis}