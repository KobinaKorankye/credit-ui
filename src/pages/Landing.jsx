import React from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="bg-white w-full h-screen flex flex-col items-center justify-center gap-10 overflow-y-scroll px-20 lg:px-[200px] xl:px-[300px]">
      <div className="text-2xl font-bold">
        Which loan application form would you like to fill?
      </div>
      <Button
        className={
          "bg-gray-900 hover:shadow hover:shadow-amber-700 text-white rounded-lg"
        }
        text={"German"}
        onClick={()=>navigate('/german')}
      />
      <Button
        className={"shadow-lg hover:shadow hover:shadow-teal-500 rounded-lg"}
        text={"Adehyeman"}
        onClick={()=>navigate('/adehyeman')}
      />
    </div>
  );
}
