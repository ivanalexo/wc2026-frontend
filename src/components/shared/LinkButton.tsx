// src/components/common/LinkButton.tsx
"use client";

import NextLink from "next/link";
import Button, { ButtonProps } from "@mui/material/Button";

type LinkButtonProps = ButtonProps & {
  href: string;
};

export default function LinkButton({ href, ...props }: LinkButtonProps) {
  return <Button component={NextLink} href={href} {...props} />;
}