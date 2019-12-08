import React from "react";
import Header from "./src/components/header";
import SideBar from "./src/components/sidebar";
import "./src/components/layout.css";
import "./src/components/cosmos/cosmos.css";

// Wraps every page in a component
export const wrapPageElement = ({ element, props }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "150px auto",
        gridTemplateRows: "50px calc(100vh - 50px)"
      }}
    >
      <Header siteTitle="Test" />
      <SideBar />
      <main
        style={{
          padding: "16px"
        }}
      >
        {element}
      </main>
    </div>
  );
};
