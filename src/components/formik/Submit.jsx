import { useFormikContext } from "formik";
import React from "react";

const Submit = ({ text, className }) => {
  const { handleSubmit } = useFormikContext();

  const handleClick = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <button
      onClick={handleClick}
      type="submit"
      className={`${className}`}
    >
      {text}
    </button>
  );
};

export default Submit;
