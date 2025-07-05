import React from "react";
import "./Button.css";

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  as = "button",
  href = "#",
}) => {
  const baseClass = `custom-btn ${variant} ${className}`.trim();

  if (as === "a") {
    return (
      <a href={href} className={baseClass} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button  type={type} className={baseClass} onClick={onClick}>
      {children}
    </button>
  );
};
