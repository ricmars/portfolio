/* eslint jsx-a11y/heading-has-content:0 */

import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { Button, Avatar } from "./cosmos/cosmos";
import { Link } from "gatsby";

export const mapping = {
  Button: props => <Button {...props} />,
  Avatar: props => <Avatar {...props} />,
  a: props => <Link {...props} />,
  h1: props => <h1 {...props} style={{ color: "#000" }} />,
  h2: props => <h1 {...props} style={{ color: "#000" }} />,
  h3: props => <h1 {...props} style={{ color: "#000" }} />,
  p: props => <p {...props} style={{ color: "#000" }} />
};

export default function Layout({ children }) {
  return <MDXProvider components={mapping}>{children}</MDXProvider>;
}
