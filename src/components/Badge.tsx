import React, { ReactNode } from "react";

export type Color = "green" | "gray" | "red" | "yellow" | 'blue';

const COLORS: { [key in Color]: string } = {
  green: "bg-green-50 text-green-700 ring-green-600/20",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
  gray: "bg-gray-50 text-gray-dark ring-gray-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  yellow: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
};

const Badge = ({ text, color }: { text: ReactNode; color: Color }) => {
  return (
    <span
      className={`${COLORS[color]} inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset`}
    >
      {text}
    </span>
  );
};

export default Badge;
