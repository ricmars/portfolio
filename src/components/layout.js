import React from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";

import Header from "./header";
import SideBar from "./sidebar";
import "./layout.css";
import "../../static/cosmos.css";

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "150px auto",
          gridTemplateRows: "50px calc(100vh - 50px)"
        }}
      >
        <Header siteTitle={data.site.siteMetadata.title} />
        <SideBar />
        <main
          style={{
            padding: "16px"
          }}
        >
          {children}
        </main>
      </div>
    )}
  />
);

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
