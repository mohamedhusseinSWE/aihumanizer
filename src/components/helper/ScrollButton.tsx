"use client";

import React from "react";

interface ScrollButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  targetId: string;
  children: React.ReactNode;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({
  targetId,
  children,
  ...props
}) => {
  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  );
};

export default ScrollButton;
