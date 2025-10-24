import React from "react";
import { useNavigate } from "react-router-dom";
import { Campaign } from "../types/campaign";

interface CampaignTrackerProps {
  campaigns: Campaign[];
}

const CampaignTracker: React.FC<CampaignTrackerProps> = ({ campaigns }) => {
  const navigate = useNavigate();

  // Calculate totals including clicks
  const totalSent = campaigns.reduce(
    (sum, campaign) => sum + campaign.emailsSent,
    0
  );
  const totalOpened = campaigns.reduce(
    (sum, campaign) => sum + campaign.emailsOpened,
    0
  );
  const totalClicks = campaigns.reduce(
    (sum, campaign) => sum + (campaign.emailsClicked || 0),
    0
  );

  const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
  const clickRate = totalSent > 0 ? (totalClicks / totalSent) * 100 : 0;

  const handleCampaignClick = (campaignId: string) => {
    navigate(`/campaigns/${campaignId}`);
  };

  return (
    <div className="space-y-6">
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-2xl font-bold text-white">
            {campaigns.length}
          </div>
          <div className="text-gray-400">Total Campaigns</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-2xl font-bold text-blue-400">
            {totalSent.toLocaleString()}
          </div>
          <div className="text-gray-400">Emails Sent</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-2xl font-bold text-green-400">
            {totalOpened.toLocaleString()}
          </div>
          <div className="text-gray-400">Emails Opened</div>
          <div className="text-sm text-green-400">
            {openRate.toFixed(1)}% open rate
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="text-2xl font-bold text-yellow-400">
            {totalClicks.toLocaleString()}
          </div>
          <div className="text-gray-400">Total Clicks</div>
          <div className="text-sm text-yellow-400">
            {clickRate.toFixed(1)}% click rate
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            Campaign Performance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Opened
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Rates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {campaigns.map((campaign) => {
                const campaignOpenRate =
                  campaign.emailsSent > 0
                    ? (campaign.emailsOpened / campaign.emailsSent) * 100
                    : 0;
                const campaignClickRate =
                  campaign.emailsSent > 0
                    ? ((campaign.emailsClicked || 0) / campaign.emailsSent) *
                      100
                    : 0;

                return (
                  <tr
                    key={campaign._id}
                    onClick={() => handleCampaignClick(campaign?._id || "")}
                    className="hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white truncate max-w-xs">
                          {campaign.subject}
                        </div>
                        <div className="text-sm text-gray-400">
                          {campaign.fromName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.status === "sent"
                            ? "bg-green-100 text-green-800"
                            : campaign.status === "testing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {campaign.status.charAt(0).toUpperCase() +
                          campaign.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {campaign.emailsSent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-green-400">
                      {campaign.emailsOpened.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-yellow-400">
                      {(campaign.emailsClicked || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-green-400">
                        {campaignOpenRate.toFixed(1)}% open
                      </div>
                      <div className="text-yellow-400">
                        {campaignClickRate.toFixed(1)}% click
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {campaign.sentAt
                        ? new Date(campaign.sentAt).toLocaleDateString()
                        : new Date(campaign.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignTracker;
