import React, { useState, useEffect } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { securityApis } from "../../../service/Security/security";

export default function RoleTree({ menuAction, id, handleChild }) {
  const [menu, setMenu] = useState([]);
  const [action, setAction] = useState([]);
  const [list, setList] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { getscreens, getactions } = securityApis();

  // Fetch screens on component load
  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await getscreens();
        if (response?.status === "Success") {
          setMenu(JSON.parse(response?.result));
        }
      } catch (error) {
        console.error("Error fetching screens:", error);
      }
    };
    fetchScreens();
  }, []);

  // Sync menuAction prop to local state
  useEffect(() => {
    setList(menuAction);
  }, [menuAction]);

  // Pass list data to parent via handleChild
  useEffect(() => {
    handleChild(list);
  }, [list, handleChild]);

  // Fetch actions based on selected screen
  const handleAction = async (screenId, isGroup) => {
    console.log('scrnid', screenId, isGroup);

    setAction([])
    if (isGroup) {
      try {
        const response = await getactions({ screenId });
        if (response?.status === "Success") {
          setAction(JSON.parse(response?.result));
        }
      } catch (error) {
        console.error("Error fetching actions:", error);
      }
    } else {
      setAction([]);
    }
  };

  // Render tree structure recursively
  const renderTree = (items) => {
    return items.map((item) => (
      <TreeItem
        key={`${item.ScreenId}-${item.Parent}`}
        onClick={() => handleAction(item?.ScreenId, item?.Group)}
        itemId={`${item.ScreenId}-${item.Parent}`}
        label={item.ScreenName}
      >
        {!item.Group && renderTree(getChildren(item.ScreenId))}
      </TreeItem>
    ));
  };

  const getChildren = (parentId) => {
    return menu.filter((item) => item.Parent === parentId);
  };

  // Check if all actions are selected
  const isAllActionsChecked = () => {
    return action.every((actionItem) =>
      list.some(
        (item) =>
          item?.ScreenId === actionItem?.ScreenId &&
          item?.ActionId === actionItem?.ActionId
      )
    );
  };

  // Handle "Select All" checkbox
  const handleCheckboxChangeAll = (event) => {
    const checked = event.target.checked;
    if (checked) {
      const newData = action.map(({ sAction, ...rest }) => rest); // Exclude sAction
      setList((prevList) => [...prevList, ...newData]);
    } else {
      setList((prevList) =>
        prevList.filter(
          (item) =>
            !action.some(
              (actionItem) =>
                item.ScreenId === actionItem.ScreenId &&
                item.ActionId === actionItem.ActionId
            )
        )
      );
    }
  };

  // Handle individual action checkbox
  const handleCheckboxChange = (event, actionData) => {
    const checked = event.target.checked;
    setList((prevList) => {
      if (checked) {
        const { sAction, ...rest } = actionData;
        return [...prevList, rest];
      }
      return prevList.filter(
        (item) =>
          !(item.ActionId === actionData.ActionId && item.ScreenId === actionData.ScreenId)
      );
    });
  };

  return (
    <Grid
      container
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
      sx={{ flexDirection: isSmallScreen ? "column" : "row", padding: 3 }}
    >
      <Box
        sx={{
          flexGrow: 1,
          background: "white",
          padding: 2,
          borderRadius: 2,
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
          height: isSmallScreen ? "auto" : 460,
          overflow: "auto",
          scrollbarWidth: "thin",
          maxWidth: isSmallScreen ? "100%" : "49%",
          mb: isSmallScreen ? 2 : 0,
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Menu
        </Typography>
        <SimpleTreeView>{renderTree(getChildren(null))}</SimpleTreeView>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          background: "white",
          padding: 2,
          borderRadius: 2,
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
          minHeight: isSmallScreen ? 200 : 460,
          overflow: "auto",
          maxWidth: isSmallScreen ? "100%" : "49%",
        }}
      >

        {action.length > 0 && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 1,
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Action
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    id="check-all"
                    size="small"
                    color="primary"
                    checked={isAllActionsChecked()}
                    onChange={handleCheckboxChangeAll}
                  />
                }
                label="Select All"
              />
            </Box>
            <FormControl component="fieldset">
              {action.map((actionItem) => {
                const isSelected = list.some(
                  (item) =>
                    item?.ScreenId === actionItem?.ScreenId &&
                    item?.ActionId === actionItem?.ActionId
                );
                return (
                  <FormControlLabel
                    key={actionItem.ActionId}
                    control={
                      <Checkbox
                        onChange={(event) => handleCheckboxChange(event, actionItem)}
                        checked={isSelected}
                        id={`action-${actionItem.ActionId}`}
                        size="small"
                        color="primary"
                      />
                    }
                    label={actionItem.Action}
                  />
                );
              })}
            </FormControl>

          </>
        )}
      </Box>
    </Grid>
  );
}
