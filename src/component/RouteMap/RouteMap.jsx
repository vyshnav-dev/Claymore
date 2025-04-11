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



export default function RouteMap({ open, handleClose, mapId }) {

  
  

  // const { GetGeoLocation } = routeApis();
  const [locations, setLocations] = React.useState([]); // Default to empty array
  const [centerLocation, setCenterLocation] = useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [mapId]);

  const fetchData = async () => {
    setLoading(true);

    try {
        let filteredLocations = [];

        if (mapId && typeof mapId === "string") {
            // Extract numbers from the string
            const match = mapId.match(/[-+]?\d*\.\d+/g); // Find decimal numbers

            if (match && match.length === 2) {
                const [lat, lng] = match.map(Number);
                filteredLocations = [{ lat, lng }];
            }
        }

        if (filteredLocations.length === 0) {
            // If no valid locations, set a default (Dubai coordinates)
            setCenterLocation([25.276987, 55.296249]);
            setLocations([]);
        } else {
            setCenterLocation(findCenter(filteredLocations));
            setLocations(filteredLocations);
        }
    } catch (error) {
        console.error("Error processing mapId:", error);
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
              zoom={locations.length === 0 ? 4 : 14}
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
