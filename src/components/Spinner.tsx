import React from "react";

const Spinner = ({size}: {size?: string}) => {
  return <span className={`loader${size? ` ${size}`: ""}`}></span>;
};

export default Spinner;
