import { MdxControl, MdxPreview } from "netlify-cms-widget-mdx";
import React, { Component } from "react";
import CMS, { init } from "netlify-cms";
import { Theme, LayoutComponents, UIComponents } from "./theme";

// Custom components need refs for validation and thus must be a class.
// Additionally, after <Theme>, only one child is allowed.
// See https://github.com/netlify/netlify-cms/issues/1346
class MDXWidget extends Component {
  render() {
    return (
      <Theme>
        <MdxControl {...this.props} />
      </Theme>
    );
  }
}

// The preview window which renders MDX content.
// Docs: https://www.netlifycms.org/docs/customization/
const PreviewWindow = props => {
  //const iframe = document.getElementsByTagName("iframe")[0];

  const mdxProps = {
    // This key represents html elements used in markdown; h1, p, etc
    components: LayoutComponents,
    // Pass components used in the editor (and shared throughout mdx) here:
    scope: UIComponents,

    mdPlugins: []
  };

  return (
    <Theme>
      <MdxPreview mdx={mdxProps} {...props} />
    </Theme>
  );
};

// Netlify collections that set `widget: mdx` will be able to use this custom
// widget. NOTE: The StyleSheet manager can *only* be injected into the Preview.
// Docs: https://www.netlifycms.org/docs/widgets/

CMS.registerWidget("mdx", MDXWidget, PreviewWindow);

// Start the CMS
init();
