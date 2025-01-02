import axios from "axios";
import { baseUrlMob } from "../../config/config";
import { baseApis } from "../ApiInterceptors/interceptorApi"

const  salesApis = ()=>{
    const {makeAuthorizedRequestBase} = baseApis()

    const GetAllTransactionSummary = async ({DisplayLength,DisplayStart,iUserId,iMaster,iDocType,Search}) => {
       
        
        try {
          const response = await axios.get(`http://103.120.178.195/Sang.VanSales.Web.Api/VanSales/GetAllTransactionSummary?DisplayLength=${DisplayLength}&DisplayStart=${DisplayStart}&iUserId=${iUserId}&iMaster=${iMaster}&iDocType=${iDocType}&Search=${Search}`);
   
          return response;
        } catch (error) {
          throw error;
        }
      };



      const GetPrev_NextDocNo = async ({iTransId,iDoctype,iType}) => {
       
        
        try {
          const response = await axios.get(`http://103.120.178.195/Sang.VanSales.Web.Api/VanSales/GetPrev_NextDocNo?iTransId=${iTransId}&iDoctype=${iDoctype}&iType=${iType}`);
   
          return response;
        } catch (error) {
          throw error;
        }
      };
      const GetSalesDetails = async ({iTransId}) => {
       
        
        try {
          const response = await axios.get(`http://103.120.178.195/Sang.VanSales.Web.Api/VanSales/GetSalesDetails?iTransId=${iTransId}`);
   
          return response;
        } catch (error) {
          throw error;
        }
      };

      const GetDriver = async (payload) => {
       
  
        
        try {
          const response = await axios.get(`http://103.120.178.195/Sang.VanSales.Web.Api/VanSales/GetDriver?iType=${payload.iType}&sSearch=${payload.sSearch}`);
       
          return JSON.stringify(response.data.ResultData);
        } catch (error) {
          throw error;
        }
      };
      

      return {
        GetAllTransactionSummary,
        GetPrev_NextDocNo,
        GetSalesDetails,GetDriver
        
      }
}

export {salesApis}