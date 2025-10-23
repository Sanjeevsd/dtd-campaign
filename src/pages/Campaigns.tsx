import React, { useState, useEffect } from "react";
import axios from "axios";
import CampaignTracker from "../components/CampaignTracker";
import { Campaign } from "../types/campaign";
import api from "../services/api";

// Mock data for demonstration
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    subject: "Welcome to MyDowntown Dubai - Exclusive Offers Inside!",
    fromName: "MyDowntown Dubai Team",
    htmlTemplate: "<html><body><h1>Welcome!</h1></body></html>",
    createdAt: "2024-01-15T10:00:00Z",
    sentAt: "2024-01-15T14:00:00Z",
    status: "sent",
    emailsSent: 15420,
    emailsOpened: 4326,
    testEmails: ["test@example.com"],
  },
  {
    id: "2",
    subject: "New Year Special - Up to 50% Off Premium Properties",
    fromName: "MyDowntown Dubai Sales",
    htmlTemplate: "<html><body><h1>New Year Special</h1></body></html>",
    createdAt: "2024-01-10T09:30:00Z",
    sentAt: "2024-01-10T12:00:00Z",
    status: "sent",
    emailsSent: 12850,
    emailsOpened: 3855,
    testEmails: ["sales@example.com"],
  },
  {
    id: "3",
    subject: "Your Investment Portfolio Update - Q1 2024",
    fromName: "MyDowntown Dubai Investment",
    htmlTemplate: "<html><body><h1>Portfolio Update</h1></body></html>",
    createdAt: "2024-01-08T11:15:00Z",
    sentAt: "2024-01-08T16:30:00Z",
    status: "sent",
    emailsSent: 8750,
    emailsOpened: 2625,
    testEmails: ["investment@example.com"],
  },
  {
    id: "4",
    subject: "Luxury Living Redefined - New Tower Launch",
    fromName: "MyDowntown Dubai Development",
    htmlTemplate: "<html><body><h1>New Tower Launch</h1></body></html>",
    createdAt: "2024-01-05T08:45:00Z",
    status: "testing",
    emailsSent: 0,
    emailsOpened: 0,
    testEmails: ["dev@example.com", "marketing@example.com"],
  },
  {
    id: "5",
    subject: "Monthly Market Insights - Dubai Real Estate",
    fromName: "MyDowntown Dubai Research",
    htmlTemplate: "<html><body><h1>Market Insights</h1></body></html>",
    createdAt: "2024-01-03T13:20:00Z",
    status: "draft",
    emailsSent: 0,
    emailsOpened: 0,
    testEmails: [],
  },
];

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch campaigns from API
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);

      // Replace with your actual API endpoint
      const response = await api.get("/admin/dtd-list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth token if needed
          "Content-Type": "application/json",
        },
      });

      // Assuming the API returns campaigns in response.data.data or response.data
      const campaignsData = response.data.data || response.data;
      setCampaigns(campaignsData);
    } catch (err) {
      console.error("Error fetching campaigns:", err);

      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(
            `Failed to fetch campaigns: ${
              err.response.data?.message || err.response.statusText
            }`
          );
        } else if (err.request) {
          setError(
            "Network error: Please check your connection and try again."
          );
        } else {
          setError("An unexpected error occurred while fetching campaigns.");
        }
      } else {
        setError("An unexpected error occurred while fetching campaigns.");
      }

      // Fallback to mock data in case of error (optional)
      setCampaigns(mockCampaigns);
    } finally {
      setLoading(false);
    }
  };

  // Fetch campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        <span className="ml-3 text-white">Loading campaigns...</span>
      </div>
    );
  }

  // Error state with retry option
  if (error && campaigns.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] text-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error Loading Campaigns
              </h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <div className="mt-4">
                <button
                  onClick={fetchCampaigns}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && campaigns.length > 0 && (
        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Failed to load latest data. Showing cached campaigns.
                <button
                  onClick={fetchCampaigns}
                  className="underline ml-1 hover:no-underline"
                >
                  Retry
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
      <CampaignTracker campaigns={campaigns} />
    </div>
  );
};

export default Campaigns;
