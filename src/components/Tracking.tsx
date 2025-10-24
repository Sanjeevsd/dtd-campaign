import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function TrackRedirect() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Redirecting...");
  const encodedUrl = searchParams.get("url");
  const campaignId = searchParams.get("id");
  const email = searchParams.get("email");
  console.log("Encoded URL:", encodedUrl, "Campaign ID:", campaignId);
  useEffect(() => {
    async function trackAndRedirect() {
      if (!encodedUrl) {
        setMessage("Invalid tracking link");
        return;
      }

      const response = await api.get(
        `/admin/click-tracking?id=${campaignId}&url=${encodedUrl}&email=${email}`
      );
      const data = await response.data;
      console.log("Tracking response:", data);
      window.location.href = encodedUrl;
    }

    trackAndRedirect();
  }, [encodedUrl]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="text-lg font-semibold text-gray-700">{message}</div>
      <div className="mt-4 text-sm text-gray-500">Please wait...</div>
    </div>
  );
}
