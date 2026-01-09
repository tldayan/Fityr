import { toast } from "react-hot-toast";
import React from "react";

export const showToast = (
  message: string | number | React.ReactNode,
  type: "success" | "error" = "success"
) => {
  toast(
    <span>{message}</span>,
    {
      duration: 3000,
      position: "top-right",
      style: {
        borderRadius: "8px",
        padding: "10px 20px",
        fontWeight: "bold",
        color: "black",
        background: "white",
      }
    }
  );
};
