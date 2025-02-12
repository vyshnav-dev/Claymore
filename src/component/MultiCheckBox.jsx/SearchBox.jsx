import React, { useEffect, useState } from "react";
import {
    Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
// import { tokens } from "../../../../theme";
import { useTheme } from "@mui/material";
// import InputTag_noLabel from "../Inputs/InputTag_noLabel";
import TableInputes from "../InputFields/TableInputes";
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

const SearchBox = React.memo(({ initialItems, search ,handleSelectedIds, params,changeTriggered,setchangesTriggered,initialCheckedIds,disabled,searchTerm,setsearchTerm,formData_obj,sFieldName}) => {


  
    // const theme = useTheme();
    // const colors = tokens(theme.palette.mode);


  const [items, setItems] = useState(initialItems.reduce((acc, item) => ({ ...acc, [item.Id]: false }), {}));




  
  // const handleItemToggle = (Id) => {
  //   if (!disabled) {
  //     setItems((prevItems) => {
  //       const updatedItems = { ...prevItems };
  //       updatedItems[Id] = !prevItems[Id];
  
  //       // Get the selected items (including the ones from formData that might not be in the current list)
  //       const previousSelectedItems = formData_obj?.map((item) => item[sFieldName]) || [];
  
  //       // Merge currently selected items with the new selection
  //       const allSelectedIds = [
  //         ...new Set([
  //           ...previousSelectedItems,
  //           ...Object.keys(updatedItems)
  //             .filter((key) => updatedItems[key])
  //             .map((key) => Number(key)),
  //         ]),
  //       ];
  
  //       // Format the selected items with the required structure
  //       const selectedFormatted = allSelectedIds.map((id) => ({ [sFieldName]: id }));
  
  //       // Update formData with the merged selected items
  //       handleSelectedIds(selectedFormatted);
        
  //       return updatedItems;
  //     });
  //   }
  // };
  
  const handleItemToggle = (ID) => {
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
  
        return updatedItems;
      });
    }
  };
  


  useEffect(() => {
    // Reset all items when changeTriggered changes
    if (changeTriggered) {
      const resetItems = initialItems.reduce(
        (acc, item) => ({ ...acc, [item.Id]: false }),
        {}
      );
      setItems(resetItems);
      setchangesTriggered(false);
    }
  }, [changeTriggered, initialItems]);

  useEffect(() => {
    const checkedIdsArray = initialCheckedIds.map((item) => item[sFieldName]);
  
    // Initialize items only if they differ
    setItems((prevItems) => {
      const newItems = initialItems.reduce(
        (acc, item) => ({
          ...acc,
          [item.Id]: checkedIdsArray.includes(item.Id),  // Compare with the number directly
        }),
        {}
      );
  
      const isDifferent = JSON.stringify(prevItems) !== JSON.stringify(newItems);
      return isDifferent ? newItems : prevItems;
    });
  }, [initialItems, initialCheckedIds]);
  

 // Handler for both click and Enter key press
 const handleKeyDown = (event, ID) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleItemToggle(ID); // Toggle checkbox state when Enter is pressed
  }
};
  
  return (
    <Box className='new1' sx={{ display: "flex", flexDirection: "column",gap:2 }}>
      <InputWrapper  colors={'black'} id="inputwrapperSB">
        {search && (
          <div  className="IpWD1">
            {/* <TextField
            variant="outlined"
          
            id="IpWSB"
            sx={{
             
                '& .MuiOutlinedInput-root': {
                  '& input': {
                    //backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "lightgray", // Change input area background color
                   color: theme.palette.mode === "dark" ? colors.primary[400] : "black", // Change text color based on theme
                  },
                  '& fieldset': {
                    borderColor: theme.palette.mode === "dark" ? colors.primary[200] : "#ddd", // Change the border color
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.mode === "dark" ? colors.primary[100] : "black", // Border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.mode === "dark" ? colors.primary[100] : "#ddd", // Border color when focused
                  },
                },
              }}
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value)}}
            disabled={disabled}
          /> */}
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
          maxHeight: "100px", // Set the maximum height for the container
          scrollbarWidth: "thin",
          padding: 0,
          overflowY: "auto", // Enable vertical scrolling if content overflows
          paddingLeft: "10px", // Optional padding to make the scrollable area look better
          zIndex:5,
        }}
      >
        
        {initialItems && initialItems.length > 0 ? (
            initialItems?.map((item, index) => (
              <Item key={item.Id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!items[item.Id]} // Ensure boolean value
                      onChange={() => handleItemToggle(item.Id)}
                      onKeyDown={(e) => handleKeyDown(e, item.Id)}
                      tabIndex={0}
                      disabled={disabled}
                      sx={{
                        padding: 0,
                        color:"currentColor",
                        "&.Mui-checked": {
                          color:"currentColor",
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
        ) :(
          <Box sx={{ width: "100%", textAlign: "center", my: 4 }}>
            <Typography>No Data</Typography>
          </Box>
        )
          }
      </Box>
    </Box>
  );
});

export default SearchBox;