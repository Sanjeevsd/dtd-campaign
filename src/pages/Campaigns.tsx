import React, { useState, useEffect } from "react";
import axios from "axios";
import { Campaign } from "../types/campaign";
import CampaignTracker from "../components/CampaignTracker";
import DateRangeFilter, { DateFilter } from "../components/DateRangeFilter";
import api from "../services/api";

// Mock data for demonstration with varied dates
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    subject: "Welcome to MyDowntown Dubai - Exclusive Offers Inside!",
    fromName: "MyDowntown Dubai Team",
    htmlTemplate: "<html><body><h1>Welcome!</h1></body></html>",
    createdAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
    status: "sent",
    emailsSent: 15420,
    emailsOpened: 4326,
    emailsClicked: 1250,
    testEmails: ["test@example.com"],
  },
  {
    id: "2",
    subject: "New Year Special - Up to 50% Off Premium Properties",
    fromName: "MyDowntown Dubai Sales",
    htmlTemplate: "<html><body><h1>New Year Special</h1></body></html>",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "sent",
    emailsSent: 12850,
    emailsOpened: 3855,
    emailsClicked: 890,
    testEmails: ["sales@example.com"],
  },
  {
    id: "3",
    subject: "Your Investment Portfolio Update - Q1 2024",
    fromName: "MyDowntown Dubai Investment",
    htmlTemplate: "<html><body><h1>Portfolio Update</h1></body></html>",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "sent",
    emailsSent: 8750,
    emailsOpened: 2625,
    emailsClicked: 645,
    testEmails: ["investment@example.com"],
  },
  {
    id: "4",
    subject: "Luxury Living Redefined - New Tower Launch",
    fromName: "MyDowntown Dubai Development",
    htmlTemplate: "<html><body><h1>New Tower Launch</h1></body></html>",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    sentAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: "sent",
    emailsSent: 9200,
    emailsOpened: 2760,
    emailsClicked: 580,
    testEmails: ["dev@example.com", "marketing@example.com"],
  },
  {
    id: "5",
    subject: "Monthly Market Insights - Dubai Real Estate",
    fromName: "MyDowntown Dubai Research",
    htmlTemplate: "<html><body><h1>Market Insights</h1></body></html>",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 1 month ago
    sentAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "sent",
    emailsSent: 11500,
    emailsOpened: 3450,
    emailsClicked: 725,
    testEmails: ["research@example.com"],
  },
  {
    id: "6",
    subject: "Summer Special - Beach Front Properties",
    fromName: "MyDowntown Dubai Sales",
    htmlTemplate: "<html><body><h1>Summer Special</h1></body></html>",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 2 months ago
    sentAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: "sent",
    emailsSent: 14200,
    emailsOpened: 4120,
    emailsClicked: 980,
    testEmails: ["summer@example.com"],
  },
  {
    id: "7",
    subject: "Holiday Season Newsletter",
    fromName: "MyDowntown Dubai Team",
    htmlTemplate: "<html><body><h1>Holiday Newsletter</h1></body></html>",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: "testing",
    emailsSent: 0,
    emailsOpened: 0,
    emailsClicked: 0,
    testEmails: ["dev@example.com", "marketing@example.com"],
  },
  {
    id: "8",
    subject: "Weekly Property Roundup",
    fromName: "MyDowntown Dubai Research",
    htmlTemplate: "<html><body><h1>Weekly Roundup</h1></body></html>",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: "draft",
    emailsSent: 0,
    emailsOpened: 0,
    emailsClicked: 0,
    testEmails: [],
  },
];

const Campaigns: React.FC = () => {
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
    preset: "all",
  });

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
      setAllCampaigns(campaignsData);
      setFilteredCampaigns(campaignsData);
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
      setAllCampaigns(mockCampaigns);
      setFilteredCampaigns(mockCampaigns);
    } finally {
      setLoading(false);
    }
  };

  // Filter campaigns based on date range
  const filterCampaigns = (campaigns: Campaign[], filter: DateFilter) => {
    if (filter.preset === "all" || (!filter.startDate && !filter.endDate)) {
      return campaigns;
    }

    return campaigns.filter((campaign) => {
      const campaignDate = new Date(campaign.sentAt || campaign.createdAt);

      if (filter.startDate && campaignDate < filter.startDate) {
        return false;
      }

      if (filter.endDate && campaignDate > filter.endDate) {
        return false;
      }

      return true;
    });
  };

  // Handle filter change
  const handleFilterChange = (newFilter: DateFilter) => {
    setDateFilter(newFilter);
    const filtered = filterCampaigns(allCampaigns, newFilter);
    setFilteredCampaigns(filtered);
  };

  // Fetch campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Apply filter when campaigns data changes
  useEffect(() => {
    const filtered = filterCampaigns(allCampaigns, dateFilter);
    setFilteredCampaigns(filtered);
  }, [allCampaigns, dateFilter]);

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
  if (error && allCampaigns.length === 0) {
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
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm"
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
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Email Campaigns</h1>
          <p className="text-gray-400 text-sm">
            {filteredCampaigns.length} of {allCampaigns.length} campaigns
            {dateFilter.preset !== "all" &&
              ` (filtered by ${dateFilter.preset})`}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <DateRangeFilter
            currentFilter={dateFilter}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {error && allCampaigns.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
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
                  className="ml-2 text-yellow-800 underline hover:text-yellow-900"
                >
                  Retry
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Results State */}
      {filteredCampaigns.length === 0 && allCampaigns.length > 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            No campaigns found
          </h3>
          <p className="text-gray-400 mb-4">
            No campaigns match your current filter criteria.
          </p>
          <button
            onClick={() =>
              handleFilterChange({
                startDate: null,
                endDate: null,
                preset: "all",
              })
            }
            className="bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Campaign Tracker with Filtered Data */}
      {filteredCampaigns.length > 0 && (
        <CampaignTracker campaigns={filteredCampaigns} />
      )}
    </div>
  );
};

export default Campaigns;
