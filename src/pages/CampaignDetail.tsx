import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Campaign,
  CampaignAnalytics,
  OpenedEmail,
  LinkClickDocument,
} from "../types/campaign";
import api from "../services/api";

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"opened" | "clicked">("opened");

  useEffect(() => {
    if (id) {
      fetchCampaignDetails(id);
      fetchCampaignAnalytics(id);
    }
  }, [id]);

  const fetchCampaignDetails = async (campaignId: string) => {
    try {
      const response = await api.get(`/admin/campaigns-by-id/${campaignId}`);
      setCampaign(response.data[0]);
    } catch (err) {
      console.error("Error fetching campaign details:", err);

      // Mock data for demonstration
      const mockCampaign: Campaign = {
        _id: campaignId,
        id: "",
        subject: "Welcome to MyDowntown Dubai - Exclusive Offers Inside!",
        fromName: "MyDowntown Dubai Team",
        htmlTemplate: "<html><body><h1>Welcome!</h1></body></html>",
        createdAt: "2024-01-15T10:00:00Z",
        sentAt: "2024-01-15T14:00:00Z",
        status: "sent",
        emailsSent: 15420,
        emailsOpened: 4326,
        emailsClicked: 1250,
        testEmails: ["test@example.com"],
      };
      setCampaign(mockCampaign);
    }
  };
  console.log("Analytics state:", analytics);
  const fetchCampaignAnalytics = async (campaignId: string) => {
    try {
      const response = await api.get(
        `/admin/campaign-analytics-by-id/${campaignId}`
      );
      // console.log("Fetched analytics:", response.data);
      setAnalytics(response.data[0]);
    } catch (err) {
      console.error("Error fetching campaign analytics:", err);

      // Mock analytics data
      const mockAnalytics: CampaignAnalytics = {
        campaignId,
        totalOpens: 4326,
        totalClicks: 1250,
        uniqueOpens: 3890,
        uniqueClicks: 1180,
        openedEmails: Array.from({ length: 50 }, (_, i) => ({
          Email: `user${i + 1}@example.com`,
          createdAt: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        })),
        clickedEmails: Array.from({ length: 30 }, (_, i) => ({
          originalUrl: `https://mydowntown.com/offer-${i + 1}`,
          _id: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          campaignId,
          email: `user${i + 1}@example.com`,
          createdAt: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        })),
      };
      setAnalytics(mockAnalytics);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        <span className="ml-3 text-white">Loading campaign details...</span>
      </div>
    );
  }

  if (!campaign || !analytics) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          Campaign Not Found
        </h2>
        <button
          onClick={() => navigate("/campaigns")}
          className="bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-500"
        >
          Back to Campaigns
        </button>
      </div>
    );
  }

  const openRate =
    campaign.emailsSent > 0
      ? (analytics.uniqueOpens / campaign.emailsSent) * 100
      : 0;
  const clickRate =
    campaign.emailsSent > 0
      ? (analytics.uniqueClicks / campaign.emailsSent) * 100
      : 0;

  const pieData = [
    { name: "Opened", value: analytics.uniqueOpens, color: "#10B981" },
    { name: "Clicked", value: analytics.uniqueClicks, color: "#F59E0B" },
    {
      name: "Not Opened",
      value: campaign.emailsSent - analytics.uniqueOpens,
      color: "#6B7280",
    },
  ];

  const COLORS = ["#10B981", "#F59E0B", "#6B7280"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => navigate("/campaigns")}
            className="text-yellow-400 hover:text-yellow-300 mb-2 flex items-center"
          >
            ← Back to Campaigns
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">
            {campaign.subject}
          </h1>
          <p className="text-gray-400">From: {campaign.fromName}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Status</div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              campaign?.status === "sent"
                ? "bg-green-100 text-green-800"
                : campaign?.status === "testing"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {campaign?.status?.charAt(0).toUpperCase() +
              campaign?.status?.slice(1)}
          </span>
        </div>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-white">
              {campaign?.emailsSent?.toLocaleString()}
            </div>
            <div className="text-gray-400">Emails Sent</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-green-400">
              {analytics?.uniqueOpens?.toLocaleString()}
            </div>
            <div className="text-gray-400">Unique Opens</div>
            <div className="text-sm text-green-400">
              {openRate.toFixed(1)}% open rate
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-400">
              {analytics?.uniqueClicks?.toLocaleString()}
            </div>
            <div className="text-gray-400">Unique Clicks</div>
            <div className="text-sm text-yellow-400">
              {clickRate.toFixed(1)}% click rate
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-2xl font-bold text-blue-400">
              {analytics?.totalOpens?.toLocaleString()}
            </div>
            <div className="text-gray-400">Total Opens</div>
            <div className="text-sm text-blue-400">
              {analytics?.totalClicks?.toLocaleString()} total clicks
            </div>
          </div>
        </div>
      )}

      {/* Pie Chart */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          Engagement Overview
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${(Number(percent) * 100).toFixed(1)}%)`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-lg">
        <div className="border-b border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab("opened")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "opened"
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Opened Emails ({analytics?.openedEmails?.length})
            </button>
            <button
              onClick={() => setActiveTab("clicked")}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "clicked"
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Clicked Emails ({analytics?.clickedEmails?.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "opened" ? (
            <OpenedEmailsList emails={analytics.openedEmails} />
          ) : (
            <ClickedEmailsList clicks={analytics.clickedEmails} />
          )}
        </div>
      </div>
    </div>
  );
};

const OpenedEmailsList: React.FC<{ emails: OpenedEmail[] }> = ({ emails }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white">Opened Emails</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-300">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4">Email</th>
              {/* <th className="text-left py-3 px-4">Opened At</th> */}
              {/* <th className="text-left py-3 px-4">IP Address</th> */}
            </tr>
          </thead>
          <tbody>
            {emails.map((email, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                <td className="py-3 px-4">{email.Email}</td>
                {/* <td className="py-3 px-4">
                  {new Date(email.createdAt).toLocaleString()}
                </td> */}
                {/* <td className="py-3 px-4">{email.ipAddress || "N/A"}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ClickedEmailsList: React.FC<{ clicks: LinkClickDocument[] }> = ({
  clicks,
}) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white">Clicked Links</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-300">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">URL</th>
              <th className="text-left py-3 px-4">Clicked At</th>
              <th className="text-left py-3 px-4">IP Address</th>
              <th className="text-left py-3 px-4">User Agent</th>
            </tr>
          </thead>
          <tbody>
            {clicks.map((click, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                <td className="py-3 px-4">{click.email || "N/A"}</td>
                <td className="py-3 px-4">
                  <a
                    href={click.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 hover:text-yellow-300 truncate block max-w-xs"
                  >
                    {click.originalUrl}
                  </a>
                </td>
                <td className="py-3 px-4">
                  {new Date(click.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-4">{click._id}</td>
                <td className="py-3 px-4">
                  <span
                    className="truncate block max-w-xs"
                    title={click.userAgent}
                  >
                    {click.userAgent}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignDetail;
