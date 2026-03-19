import React from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="bg-background w-full min-h-screen flex flex-col items-center justify-center gap-10 overflow-y-auto px-20 lg:px-[200px] xl:px-[300px]">
      <div className="text-2xl font-bold text-foreground text-center">
        Which loan application form would you like to fill?
      </div>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Button
          variant="default"
          size="lg"
          className="w-full"
          text="German"
          onClick={() => navigate('/german')}
        />
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          text="Adehyeman"
          onClick={() => navigate('/adehyeman')}
        />
      </div>
    </div>
  );
}
