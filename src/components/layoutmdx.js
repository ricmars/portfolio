import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { Button, Avatar } from "./cosmos/cosmos";
import { Link } from "gatsby";

const mapping = {
  Button: props => <Button {...props} />,
  Avatar: props => <Avatar {...props} />,
  a: props => <Link {...props} />,
  h1: props => <h1 {...props} style={{ color: "red" }} />,
  h2: props => <h1 {...props} style={{ color: "green" }} />,
  h3: props => <h1 {...props} style={{ color: "blue" }} />,
  p: props => <p {...props} style={{ color: "rebeccapurple" }} />
};

export default function Layout({ children }) {
  return <MDXProvider components={mapping}>{children}</MDXProvider>;
}
