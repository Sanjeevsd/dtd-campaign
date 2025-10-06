import React, { useState, useEffect } from "react";
import { Calendar, Mail, Eye, TrendingUp, Search } from "lucide-react";
import { Campaign } from "../types/campaign";

interface CampaignTrackerProps {
  campaigns: Campaign[];
}

const CampaignTracker: React.FC<CampaignTrackerProps> = ({ campaigns }) => {
  const [filteredCampaigns, setFilteredCampaigns] =
    useState<Campaign[]>(campaigns);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "opened" | "sent">("date");

  useEffect(() => {
    let filtered = campaigns;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (campaign) =>
          campaign.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.fromName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (campaign) => campaign.status === statusFilter
      );
    }

    // Sort campaigns
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "opened":
          return b.emailsOpened - a.emailsOpened;
        case "sent":
          return b.emailsSent - a.emailsSent;
        default:
          return 0;
      }
    });

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, statusFilter, sortBy]);

  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "sent":
        return "bg-green-600";
      case "testing":
        return "bg-yellow-600";
      case "draft":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const getOpenRate = (sent: number, opened: number) => {
    if (sent === 0) return 0;
    return ((opened / sent) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">
            Campaign Analytics
          </h2>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="testing">Testing</option>
              <option value="draft">Draft</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "date" | "opened" | "sent")
              }
              className="px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="opened">Sort by Opens</option>
              <option value="sent">Sort by Sent</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Campaigns</p>
                <p className="text-2xl font-bold text-white">
                  {campaigns.length}
                </p>
              </div>
              <Mail className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Emails Sent</p>
                <p className="text-2xl font-bold text-white">
                  {campaigns
                    .reduce((sum, c) => sum + c.emailsSent, 0)
                    .toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Total Opens</p>
                <p className="text-2xl font-bold text-white">
                  {campaigns
                    .reduce((sum, c) => sum + c.emailsOpened, 0)
                    .toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Avg. Open Rate</p>
                <p className="text-2xl font-bold text-white">
                  {getOpenRate(
                    campaigns.reduce((sum, c) => sum + c.emailsSent, 0),
                    campaigns.reduce((sum, c) => sum + c.emailsOpened, 0)
                  )}
                  %
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                  Campaign
                </th>
                <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                  Date
                </th>
                <th className="text-right py-3 px-4 text-zinc-400 font-medium">
                  Sent
                </th>
                <th className="text-right py-3 px-4 text-zinc-400 font-medium">
                  Opened
                </th>
                <th className="text-right py-3 px-4 text-zinc-400 font-medium">
                  Open Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-zinc-400">
                    No campaigns found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-b border-zinc-700 hover:bg-zinc-800 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <h4 className="text-white font-medium">
                          {campaign.subject}
                        </h4>
                        <p className="text-zinc-400 text-sm">
                          From: {campaign.fromName}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        {campaign.status.charAt(0).toUpperCase() +
                          campaign.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right text-white">
                      {campaign.emailsSent.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right text-white">
                      {campaign.emailsOpened.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end">
                        <span className="text-white font-medium">
                          {getOpenRate(
                            campaign.emailsSent,
                            campaign.emailsOpened
                          )}
                          %
                        </span>
                        <div className="ml-2 w-16 h-2 bg-zinc-600 rounded-full">
                          <div
                            className="h-2 bg-yellow-400 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                parseFloat(
                                  String(
                                    getOpenRate(
                                      campaign.emailsSent,
                                      campaign.emailsOpened
                                    )
                                  )
                                )
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignTracker;
