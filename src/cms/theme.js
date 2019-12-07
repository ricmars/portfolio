/**
 * Since this file is shared with NetlifyCMS it must be .jsx
 */

import React, { Fragment } from "react";
import { Avatar, Button } from "../components/cosmos/cosmos";

export const LayoutComponents = {
  h1: `<h1 class='foo'></h1>`
};

export const UIComponents = {
  Button: props => <Button {...props}>{props.children}</Button>,
  Avatar: props => <Avatar {...props}>{props.children}</Avatar>
};

export const Theme = ({ children }) => <Fragment>{children}</Fragment>;
