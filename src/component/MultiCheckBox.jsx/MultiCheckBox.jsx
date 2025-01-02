import React, { useCallback, useEffect, useMemo, useState } from 'react'
import "./checkbox.css"
import SearchBox from './SearchBox';
import { Typography } from '@mui/material';
// import { tagsApis } from '../../../../services/tags/tagsApi';
import Loader from '../../component/Loader/Loader';
import { multiData } from '../../config';

function MultiCheckBox({formData,setFormData,tagId,sFieldName,label,isMandatory,disabled,objectName,tag_getbusinessentitysummary}) {

     //Tag page Apis
    //  const { gettaglist } = tagsApis();


   
    const [companyList, setcompanyList] = useState([]);
    const [companyListExist, setCompanyListExist] = useState(formData[objectName] || []);
    const [changesTriggered, setchangesTriggered] = useState(false);
    const [searchTerm, setsearchTerm] = useState("")
    const [loading, setLoading] = useState(false)

    console.log('serch',searchTerm);
    

    useEffect(() => {
      const fetchMultidataEntity = async () => {
        setLoading(true)
        try {
          // let  response ;
          // if(tagId && !tag_getbusinessentitysummary){
          //   response= await gettaglist({
          //     tagId: tagId,
          //     businessEntityId: 1,
          //     search: searchTerm,
          //   });
          // }
          // else if(tag_getbusinessentitysummary){
          //   response= await tag_getbusinessentitysummary({
             
          //   });
          // }
          
          // const results = JSON.parse(response?.result);
          
          // Preserve selected items (formData[objectName]) and merge with new results
          const selectedItems = formData[objectName]?.map((item) => item[sFieldName]) || [];
          
          // Merge the new items from the API with already selected items
          let mergedItems
          if(searchTerm)
          {
             mergedItems = (multiData || [])
            .filter((item) => item.Name.toLowerCase().includes(searchTerm.toLowerCase())) // Partial match, case-insensitive
            .map((item) => ({
              ...item,
              selected: selectedItems.includes(item.Id), // Mark as selected if already in formData
            }));
          }
          else{
             mergedItems = multiData?.map((item) => ({
              ...item,
              selected: selectedItems.includes(item.Id),  // Mark as selected if already in formData
            }));
          }
          
          console.log('merg',mergedItems);
          
          
          // setcompanyList(mergedItems || []);
          setcompanyList((prevList) => (JSON.stringify(prevList) !== JSON.stringify(mergedItems) ? mergedItems : prevList));
        } catch (error) {
          
        }finally{
          setLoading(false)
        }
      };
    
      fetchMultidataEntity();
    }, [searchTerm,formData[objectName]]);
    



   

     // Handling selected IDs and mapping them under the TagEntity key
  const handleSelectedIds = useCallback(
    (selectedIds) => {
   
      setFormData((prevFormData) => ({
        ...prevFormData,
        [objectName]: selectedIds, // Store under TagEntity
      }));
    },
    [setFormData, objectName]
  );
     
      
   
     
      const resetChangesTrigger = () => {
        setchangesTriggered(false);
      };
      const SearchContainer = useMemo(
        () => (
          <SearchBox
            initialItems={companyList}
            search={true}
            handleSelectedIds={handleSelectedIds}
            params={sFieldName}
            changeTriggered={changesTriggered}
            setchangesTriggered={resetChangesTrigger}
            initialCheckedIds={formData[objectName] || []}
            disabled={disabled}
            searchTerm={searchTerm}
            setsearchTerm={setsearchTerm}
            formData_obj = {formData[objectName]}
            sFieldName={sFieldName}
          />
        ),
        [companyList, handleSelectedIds, changesTriggered, companyListExist]
      );



     
  return (
    <div>
      <Loader loader={loading} loaderClose={()=>setLoading(false)} />
        {companyList &&  (
                <div className="checkboxmainD1">
                  <div className="checkboxmainD1C">
                    
                    <div className="CCNPCompanySearchBoxM">
                      <div
                        //  style={
                        //   isMandatory
                        //     ? { borderLeft: "3px solid red" }
                        //     : null
                        // }
                        className="CCNPCompanySearchBoxMS"
                      >
                        <Typography id="checkboxmainD1CI1">{label}{isMandatory ?"*":null}</Typography>
                       {SearchContainer}
                      </div>
                    </div>
                  </div>
                </div>
              )}
    </div>
  )
}

export default MultiCheckBox