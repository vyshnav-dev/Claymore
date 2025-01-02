
import React, { createContext, useContext, useState, useEffect } from 'react';
import ValidationAlert from './ValidationAlert';


const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loader, setLoader] = useState(false)


  const showAlert = (type, msg) => {
    setAlertType(type);
    setMessage(msg);
    setAlert(true);
  };

  const handleAlertClose = () => {
    setAlert(false);
  };


  return (
    <AlertContext.Provider value={{ showAlert, loader, setLoader }}>
      {children}
      <ValidationAlert
        open={alert}
        handleClose={handleAlertClose}
        data={{ message: message, type: alertType }}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  return useContext(AlertContext);
};
