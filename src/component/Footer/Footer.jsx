import React from "react";
import { MDBFooter } from "mdb-react-ui-kit";

export default function Footer() {
  return (
    <MDBFooter bgColor="light" className="text-center text-lg-left">
      <div
        className="text-center "
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
         Copyright{" "}  &copy;
        <a className="text-dark"> Designed & Developed by Sang Solutions {`${new Date().getFullYear()}`}</a>
      </div>
    </MDBFooter>
  );
}
