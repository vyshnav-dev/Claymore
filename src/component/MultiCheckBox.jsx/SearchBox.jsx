import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import InputTag_noLabel from "../InputFields/InputTag_noLabel";

const Root = styled("div")`
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
`;

// const InputWrapper = styled("div")``;
const InputWrapper = styled("div")(({ theme, colors }) => ({
  // backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
  padding: "0px", // Add some padding for better UI
  borderRadius: "4px", // For smoother corners
}));

const Item = styled("div")`
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  & svg {
    font-size: 20px;
    cursor: pointer;
  }
`;

const SearchBox = ({ initialItems, search, handleSelectedIds,setchangesTriggered, initialCheckedIds, disabled, searchTerm, setsearchTerm, formData_obj, sFieldName }) => {


  const [items, setItems] = useState(
    initialItems?.length > 0
      ? initialItems.reduce((acc, item) => ({ ...acc, [item.Id]: false }), {})
      : {}
  );

    const[loading,setLoading] = useState(initialItems)
    const[loading1,setLoading1] = useState(false)

  const handleItemToggle = (ID,items) => {
    if (!disabled) {
      setItems((prevItems) => {
        const updatedItems = { ...prevItems };
        
        
        updatedItems[ID] = !prevItems[ID]; // Toggle the checked state of the item
  
        // Get the selected items (including the ones from formData_obj that might not be in the current list)
        const previousSelectedItems = formData_obj?.map((item) => item[sFieldName]) || [];
        
        // Build the updated list of selected IDs based on the current state of items
        let allSelectedIds = Object.keys(updatedItems)
          .filter((key) => updatedItems[key]) // Filter only the checked items from the current list
          .map((key) => Number(key));
  
        // If items were previously selected (from formData_obj), merge them as well
        if (updatedItems[ID]) {
          // Add previously selected items that are not part of the current list to the merged selection
          allSelectedIds = [...new Set([...previousSelectedItems, ...allSelectedIds])];
        } else {
          // If the item is unchecked, remove it from the previously selected items as well
          allSelectedIds = previousSelectedItems.filter((selectedId) => selectedId !== ID);
        }
  
  
        // Format the selected items with the required structure
        const selectedFormatted = allSelectedIds.map((id) => ({ [sFieldName]: id }));
  
        // Update formData with the merged selected items
        handleSelectedIds(selectedFormatted);
        setLoading1(true)
  
        setItems(updatedItems);
        setchangesTriggered(true); // This ensures the UI updates properly
        setsearchTerm(""); // Reset search if needed
  
        return updatedItems;
      });
    }
  };
  


  useEffect(() => {
    if (!loading1 && initialItems && initialItems.length > 0) {
      
      const checkedIdsArray = initialCheckedIds.map((item) => item[sFieldName]);
      
      // Sort initialItems: Checked items first
      const sortedItems = [...initialItems].sort((a, b) => {
        return checkedIdsArray.includes(b.Id) - checkedIdsArray.includes(a.Id);
      });

      setItems((prevItems) => {
        const newItems = sortedItems.reduce(
          (acc, item) => ({
            ...acc,
            [item.Id]: checkedIdsArray.includes(item.Id),
          }),
          {}
        );
        
        return JSON.stringify(prevItems) !== JSON.stringify(newItems) ? newItems : prevItems;
      });
  
      // Update the initialItems order
      initialItems.length = 0;
      initialItems.push(...sortedItems);
      setLoading(initialItems)
    }
    else if(!initialItems){
      setLoading([])
    }
    if(initialItems?.length !== loading?.length || !initialItems)
    {
       setLoading1(false)
    }
    
    
  }, [initialItems,initialCheckedIds,sFieldName,loading1]);
  
  


  // Handler for both click and Enter key press
  const handleKeyDown = (event, ID) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleItemToggle(ID); // Toggle checkbox state when Enter is pressed
    }
  };


  return (
    <Box className='new1' sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <InputWrapper colors={'black'} id="inputwrapperSB">
        {search && (
          <div className="IpWD1">
            
            <InputTag_noLabel
              value={searchTerm}
              name="searchTerm"
              setValue={(data) => {
                setsearchTerm(data.value);
              }}
              maxLength={50}
              disabled={disabled}
            />
            <IconButton disabled={disabled}>
              <SearchIcon id="searchIconSB" />
            </IconButton>
          </div>
        )}
      </InputWrapper>

      <Box
        sx={{
          maxHeight: "195px", // Set the maximum height for the container
          scrollbarWidth: "thin",
          padding: 0,
          overflowY: "auto", // Enable vertical scrolling if content overflows
          paddingLeft: "10px", // Optional padding to make the scrollable area look better
          zIndex: 5,
        }}
      >

        {loading  && loading.length > 0 ? (
          loading?.map((item, index) => (
            <Item key={item.Id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!items[item.Id]} // Ensure boolean value
                    onChange={() => handleItemToggle(item.Id,item)}
                    onKeyDown={(e) => handleKeyDown(e, item.Id)}
                    tabIndex={0}
                    disabled={disabled}
                    sx={{
                      padding: 0,
                      color: "currentColor",
                      "&.Mui-checked": {
                        color: "currentColor",
                      },
                    }}
                  />
                }
                label={
                  <span style={{ padding: "0px" }}>
                    <Typography sx={{ fontSize: "12px" }}>
                      {item.Name}
                    </Typography>
                  </span>
                }
              />
            </Item>
          ))
        ) : (
          <Box sx={{ width: "100%", textAlign: "center", my: 4 }}>
            <Typography>No Data</Typography>
          </Box>
        )
        }
      </Box>
    </Box>
  );
};

export default SearchBox;