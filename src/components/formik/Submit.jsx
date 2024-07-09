import { useFormikContext } from "formik";
import React from "react";

export default function Submit({ text, className }) {
  const { handleSubmit } = useFormikContext();
  return (
    <button
      // style={{ fontFamily: "Quicksand" }}
      onClick={handleSubmit}
      type="submit"
      className={`${className}`}
    >
      {text}
    </button>
  );
}
