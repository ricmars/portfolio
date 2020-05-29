import { setupPreview } from "netlify-cms-widget-mdx";
import React, { Component } from "react";
import CMS, { init } from "netlify-cms-app";
import FileSystemBackend from "netlify-cms-backend-fs";
import { mapping } from "../components/layoutmdx";
import "./cms.css";
const isClient = typeof window !== "undefined";
const isDevelopment = process.env.NODE_ENV === "development";

if (isClient) {
  window.CMS_MANUAL_INIT = true;
}

if (isDevelopment) {
  // Allows for local development overrides in cms.yaml
  window.CMS_ENV = "localhost_development";

  // Attach to the file system
  CMS.registerBackend("file-system", FileSystemBackend);
}

class myMdxControl extends Component {
  handleChange = e => {
    this.props.onChange(e.target.value);
  };

  render() {
    var value = this.props.value;
    return <textarea style={{ minHeight: "50rem" }} value={value} onChange={this.handleChange} />;
  }
}

CMS.registerWidget(
  "mdx",
  myMdxControl,
  setupPreview({
    scope: mapping
  })
);

class CategoriesControl extends Component {
  handleChange = e => {
    this.props.onChange(e.target.value.split(",").map(e => e.trim()));
  };

  render() {
    var value = this.props.value;
    return <textarea style={{ minHeight: "10rem" }} value={value ? value.join(", ") : ""} onChange={this.handleChange} />;
  }
}

class CategoriesPreview extends Component {
  render() {
    return (
      <ul>
        {this.props.value.map(function(val, index) {
          return <li key={index}>{val}</li>;
        })}
      </ul>
    );
  }
}
CMS.registerWidget("category", CategoriesControl, CategoriesPreview);

CMS.registerPreviewStyle("../cosmos.css");

CMS.registerEditorComponent({
  // Internal id of the component
  id: "youtube",
  // Visible label
  label: "Youtube",
  // Fields the user need to fill out when adding an instance of the component
  fields: [{ name: "id", label: "Youtube Video ID", widget: "string" }],
  // Pattern to identify a block as being an instance of this component
  pattern: /^youtube (\S+)$/,
  // Function to extract data elements from the regexp match
  fromBlock: function(match) {
    return {
      id: match[1]
    };
  },
  // Function to create a text block from an instance of this component
  toBlock: function(obj) {
    return "youtube " + obj.id;
  },
  // Preview output for this component. Can either be a string or a React component
  // (component gives better render performance)
  toPreview: function(obj) {
    return '<img src="http://img.youtube.com/vi/' + obj.id + '/maxresdefault.jpg" alt="Youtube Video"/>';
  }
});

// Start the CMS
init();
