import React from "react";
import clsx from "clsx";

export default function BaseTag({
  children,
  large = false,
  hoverable = false,
  containerClass,
  title = "",
}: {
  children: React.ReactNode;
  large?: boolean;
  hoverable?: boolean;
  containerClass?: string;
  title?: string;
}) {
  return (
    <code
      title={title}
      className={clsx(
        "inline-block",
        large ? "px-4 py-2 text-4xl" : "px-2 py-1",
        hoverable ? "card-hoverable" : "card-static",
        containerClass
      )}
    >
      {children}
    </code>
  );
}
