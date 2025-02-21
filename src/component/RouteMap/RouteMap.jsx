import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { Circle, MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Box } from "@mui/material";
import { useAlert } from "../Alerts/AlertContext";
import { primaryColor } from "../../config/config";

const createCustomIcon = (color) =>
  L.divIcon({
    className: "custom-icon", // Optional class for additional styling
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="${color}" viewBox="0 0 24 24" width="40px" height="40px">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
      </svg>
    `,
    iconSize: [35, 35], // Adjust size
    iconAnchor: [20, 35], // Anchor point at the bottom center of the icon
    popupAnchor: [0, -35], // Popup will open above the icon
  });

export default function RouteMap({ open, handleClose, mapId }) {
  console.log('mid', mapId);

  // const { GetGeoLocation } = routeApis();
  const [locations, setLocations] = React.useState([]); // Default to empty array
  const [centerLocation, setCenterLocation] = useState([]);
  const [loading, setLoading] = React.useState(true); // Loading state
  const [error, setError] = React.useState(""); // Error state
  const { showAlert } = useAlert();

  React.useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [mapId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      
        // Filter out items where Location is empty
        const [lat, lng] = mapId.split(",").map(Number); // Convert lat/lng to numbers

        const filteredLocations = [{ lat, lng }];
        console.log('filter', filteredLocations);

        if (filteredLocations.length === 0) {
          // If no valid locations are found, set a default location (e.g., a known place)
          setCenterLocation([25.276987, 55.296249]); // Default: Dubai coordinates (Change as needed)
          setLocations([]);
        } else {
          setCenterLocation(findCenter(filteredLocations));
          setLocations(filteredLocations);
        }

      } catch (error) {
        setLocations([]);
        setCenterLocation([25.276987, 55.296249]); // Default fallback location
      } finally {
        setLoading(false);
      }
    };

    const findCenter = (locations) => {
      const totalPoints = locations.length;
      const totalLat = locations.reduce((sum, loc) => sum + loc.lat, 0);
      const totalLng = locations.reduce((sum, loc) => sum + loc.lng, 0);

      return [totalLat / totalPoints, totalLng / totalPoints];
    };

    return (
      <React.Fragment>
        <Dialog fullScreen open={open} onClose={handleClose}>
          <AppBar sx={{ position: "relative", backgroundColor: primaryColor }}>
            <Toolbar>
              <Typography sx={{ flex: 1 }} variant="h6" component="div">
                Map
              </Typography>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          

          {loading ? (
            <Typography variant="h6" sx={{ padding: 2 }}>
              Loading...
            </Typography>
          ) : (
            <MapContainer
              center={centerLocation} // Default center
              zoom={locations.length === 0 ? 4 : 6}
              minZoom={2.3}
              style={{
                height: "90vh",
                width: "100%",
                borderRadius: 5,
                overflow: "hidden",
                zIndex: 0,
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
                noWrap={true}
              />
              {locations.map((location, index) => (
                <Marker
                  key={index}
                  position={[location.lat, location.lng]}
                  icon={
                    location?.Visited === "Visited"
                      ? createCustomIcon("#2dbe2c")
                      : location?.Visited === "Skipped"
                        ? createCustomIcon("red")
                        : createCustomIcon("#1976d2")
                  }
                  eventHandlers={{
                    mouseover: (e) => {
                      e.target.openPopup(); // Show popup on hover
                    },
                    mouseout: (e) => {
                      e.target.closePopup(); // Hide popup when mouse leaves
                    },
                  }}
                >
                  
                  <Circle
                    center={[location.lat, location.lng]}
                    pathOptions={{
                      fillColor:
                        location?.Visited === "Visited"
                          ? "#2dbe2c"
                          : location?.Visited === "Skipped"
                            ? "red"
                            : "#1976d2",
                      color:
                        location?.Visited === "Visited"
                          ? "#2dbe2c"
                          : location?.Visited === "Skipped"
                            ? "red"
                            : "#1976d2", // Border color
                    }}
                    radius={200}
                  />
                </Marker>
              ))}
            </MapContainer>
          )}
        </Dialog>
      </React.Fragment>
    );
  }
