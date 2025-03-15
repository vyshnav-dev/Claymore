import React from 'react';
import { Box } from '@mui/material';
import Accordions from '../../component/Accordion/Accordion';
import SwitchTag from '../../component/Switch/SwitchTag';
import InputCommon from '../../component/InputFields/InputCommon';
import TagAutoSelect from '../../component/Select/TagAutoSelect';
import CheckBoxTag from '../../component/CheckBox/CheckBoxTag';

const TabFields = ({ formData,setFormData,fields, expanded, onChange,language,tagDetails,isAccordion=true ,handleTagSwitch,disabledDetailed,userAction,fetchDetailTagInfo,detailScreeniId}) => {

   //Tag page Apis
//    const { gettagparentlist ,gettaglist,checktagexistence,gettaglanguageexistence,tag_getbusinessentitysummary,getmasterdata} = tagsApis();

//    const { direction, fontFamily } = tagFieldLanguageDirection[language] || {};


  
    const handleChange = (field,data)=>{
      
      if(disabledDetailed){
        return
      }
       
        if (field.FieldDisplayType == "drop down") {
          // Handle special case for "Parent" field
          if ([field.FieldName] =="Parent") {
          
            setFormData({
              ...formData,
              Parent: data["Parent"], // Set Parent value from data
              Parent_Name: data["Parent_Name"], // Set Parent_Name value from data
            });
          } else {
            // For other dropdowns, dynamically set the field name and field name + "_Name"
            setFormData({
              ...formData,
              [field.FieldName]: data[field.FieldName], // Set the selected value
              [`${field.FieldName}_Name`]: data[`${field.FieldName}_Name`] // Set the name
            });
          }
        }
        else if(data) {
          if ([field.FieldName] =="Name") {            
              setFormData({
                ...formData,
                Name: data["Name"], // Set Parent value from data             
              });
            }
            else{
          const {name,value} = data
          setFormData({...formData,[name]:value})
        }
        }
        
        
    } 
    const handleCheckboxChange = (field) => (event) => {
    
      if(disabledDetailed){
        return
      }
      
      const isChecked = event.target.checked;
      
     
      setFormData({...formData,[field]:isChecked})
      
    }

    

    
   


    // const handleOnBlur = (fieldName,value)=>{
    //   if(disabledDetailed){
    //     return
    //   }
     
      
    //  if(!value){
    //   return
    //  }
      
    //  if(fieldName == "Name"){
    //   if(value == formData.detailName){
    //     return
    //   }
    //   checkNameExistance(value,1)
    //  }
    //  else if(fieldName == "Code"){
    //   if(value == formData.detailCode){
    //     return
    //   }
    //   checkNameExistance(value,2)
    //  }
     
    // }
    
    
    const sortedFields = [...fields].sort((a, b) => a.FieldOrder - b.FieldOrder);
    const Wrapper = isAccordion ? Accordions : Box;

    
  return (
    <Wrapper
    label={fields[0]?.TabName??""}
    type={isAccordion ? 1 : undefined} // Accordion specific props
    expanded={expanded}
    onChange={onChange}
    // direction={direction}
    //sx={!isAccordion ? { padding: 2, margin: 1, border: '1px solid lightgray', borderRadius: '4px' } : undefined} // Box specific styling
  >
      {/* {expanded && */}
        <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', // Allow the fields to wrap
          gap: 2, // Add space between fields
          scrollbarWidth:"thin",overflowX:"auto",
         
       
        }}
      >
          {sortedFields.map((field) => {
            // Render components based on FieldDisplayType
              switch ((field.FieldDisplayType)?.toLowerCase()) {
                case "textbox":
                    return (
                      <InputCommon
                        label={field.Caption}
                        value={formData[field.FieldName] || ''}
                        name={field.FieldName}
                        setValue={(data) => handleChange(field, data)}
                        languageName={"english"}
                        key={field?.FieldName}
                        mandatory={field?.Mandatory|| true}
                        disabled={disabledDetailed || field?.ReadOnly || false}
                        // type={field?.FieldType.toLowerCase()}
                        type={'text'}
                        maxLength={field?.MaxSize || 250}
                        AllowNegative={field?.Negative ?? false}
                        DefaultValue={field?.DefaultValue}
                        ErrorMessage={field?.ErrorMessage}
                        // onBlur={(data) => handleOnBlur(field?.FieldName, data)}
                        ColumnSpan={field?.ColumnSpan}
                        RowSpan={field?.RowSpan}
                        multiline={field?.RowSpan > 1 ? true : null}
                        CharacterCasing={field?.CharacterCasing ?? 0}
                        RegularExpression={field?.RegularExpression}
                        dateType={field?.AllowDate}
                        DonotAllowSpecialChar={field?.DonotAllowSpecialChar || true}

                        // Add other necessary props here like value, onChange, etc.
                      />
                    );
                  break;
                  case "number":
                    return (
                      <InputCommon
                      label={field.Caption}
                      value={formData[field.FieldName] || ''}
                      name={field.FieldName}
                      setValue={(data) => handleChange(field, data)}
                      languageName={"english"}
                      key={field?.FieldName}
                      mandatory={field?.Mandatory|| true}
                      disabled={disabledDetailed || field?.ReadOnly || false}
                      // type={field?.FieldType.toLowerCase()}
                      type={'numeric'}
                      maxLength={field?.MaxSize || 250}
                      AllowNegative={field?.Negative ?? false}
                      DefaultValue={field?.DefaultValue}
                      ErrorMessage={field?.ErrorMessage}
                      // onBlur={(data) => handleOnBlur(field?.FieldName, data)}
                      ColumnSpan={field?.ColumnSpan}
                      RowSpan={field?.RowSpan}
                      multiline={field?.RowSpan > 1 ? true : null}
                      CharacterCasing={field?.CharacterCasing ?? 0}
                      // RegularExpression={field?.RegularExpression}
                      dateType={field?.AllowDate}
                      DonotAllowSpecialChar={field?.DonotAllowSpecialChar || true}
                      RegularExpression={new RegExp(
                              `^-?[0-9]*\\.?[0-9]{0,${2}}$`
                            )
                          
                      }
                      RoundOff={null}
                      decimalPart={2}
                      DecimalPoints={2}
                      // Add other necessary props here like value, onChange, etc.
                    />
                    );
                  break;
                case "date":
                    return (
                      <InputCommon
                        label={field.Caption}
                        value={formData[field.FieldName]}
                        name={field.FieldName}
                        setValue={(data) => handleChange(field, data)}
                        languageName={language}
                        key={field?.FieldName}
                        mandatory={field?.Mandatory || true}
                        disabled={disabledDetailed || field?.ReadOnly || false}
                        // type={field?.FieldType.toLowerCase()}
                        type={'date'}
                        maxLength={field?.MaxSize}
                        AllowNegative={field?.Negative ?? true}
                        DefaultValue={field?.DefaultValue}
                        ErrorMessage={field?.ErrorMessage}
                        // onBlur={(data) => handleOnBlur(field?.FieldName, data)}
                        ColumnSpan={field?.ColumnSpan}
                        RowSpan={field?.RowSpan}
                        multiline={field?.RowSpan > 1 ? true : null}
                        CharacterCasing={field?.CharacterCasing ?? 0}
                        RegularExpression={field?.RegularExpression}
                        dateType={field?.AllowDate}
                        DonotAllowSpecialChar={field?.DonotAllowSpecialChar}

                        // Add other necessary props here like value, onChange, etc.
                      />
                    );
                  break;
                case "drop down":
                    return (
                      <TagAutoSelect
                      key={field?.FieldName}
                      formData={formData}
                      setFormData={(data) => handleChange(field, data)}
                      autoId={field.Caption}
                      formDataName={`${field.FieldName}_Name`}
                      formDataiId={field.FieldName}
                      required={field?.Mandatory || true}
                      label={field.Caption}
                      languageName={"english"}
                      ColumnSpan={field?.ColumnSpan}
                      disabled={disabledDetailed || field?.ReadOnly || false}
                      Menu={JSON.parse(field?.NumberList)}
                    />
                    );
                //   }
                  break;
                // case "checkbox":
                //   // Handle Checkbox rendering here
                //   return (
                //     <CheckBoxTag
                //       key={field?.FieldName}
                //       checked={formData[field.FieldName] ?? false}
                //       onChange={handleCheckboxChange(field.FieldName)}
                //       label={field?.Caption}
                //       disabled={disabledDetailed || field?.ReadOnly || false}
                //       columnSpan={field?.ColumnSpan}
                //     />
                //   );
                //   break;  
                case "switch":
                  // Handle Checkbox rendering here
                  return (
                    <SwitchTag
                      key={field?.FieldName}
                      checked={formData[field.FieldName] ?? false}
                      onChange={handleCheckboxChange(field.FieldName)}
                      label={field?.Caption}
                      disabled={disabledDetailed || field?.ReadOnly || false}
                      rowSpan={field?.RowSpan}
                    />
                  );
                
                break;
                
                default:
                  return null; // Skip if no recognized FieldDisplayType
              }
            // }
            return null;
          })}
        </Box>
     {/* } */}
    </Wrapper>
  );
};

export default TabFields;
