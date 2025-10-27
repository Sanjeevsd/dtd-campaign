import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  ComposedChart,
} from "recharts";
import {
  MapPin,
  Home,
  DollarSign,
  Bed,
  TrendingUp,
  Filter,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { AdvancedAnalyticsData, AdvancedFilters } from "../types/campaign";
import api from "../services/api";
import axios from "axios";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const AdvancedAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "location" | "project" | "price" | "bedrooms" | "trends"
  >("location");
  const [filters, setFilters] = useState<AdvancedFilters>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      end: new Date().toISOString().split("T")[0],
    },
    locations: [],
    projects: [],
    priceRange: { min: 0, max: 10000000 },
    bedrooms: [],
    deviceTypes: [],
  });

  // API state management
  const [analyticsData, setAnalyticsData] =
    useState<AdvancedAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for advanced analytics (fallback)
  const mockAdvancedData: AdvancedAnalyticsData = useMemo(
    () => ({
      locationPerformance: [
        {
          location: "Downtown",
          sent: 1200,
          opened: 480,
          clicked: 96,
          openRate: 40,
          clickRate: 8,
        },
        {
          location: "Suburbs",
          sent: 850,
          opened: 297,
          clicked: 51,
          openRate: 35,
          clickRate: 6,
        },
        {
          location: "Waterfront",
          sent: 650,
          opened: 325,
          clicked: 78,
          openRate: 50,
          clickRate: 12,
        },
        {
          location: "Business District",
          sent: 980,
          opened: 392,
          clicked: 59,
          openRate: 40,
          clickRate: 6,
        },
        {
          location: "Historic District",
          sent: 420,
          opened: 189,
          clicked: 33,
          openRate: 45,
          clickRate: 8,
        },
      ],
      projectPerformance: [
        {
          project: "Luxury Condos",
          campaigns: 15,
          totalSent: 2100,
          totalOpened: 903,
          totalClicked: 189,
          averageOpenRate: 43,
          averageClickRate: 9,
        },
        {
          project: "Family Homes",
          campaigns: 12,
          totalSent: 1800,
          totalOpened: 630,
          totalClicked: 108,
          averageOpenRate: 35,
          averageClickRate: 6,
        },
        {
          project: "Starter Apartments",
          campaigns: 8,
          totalSent: 1200,
          totalOpened: 420,
          totalClicked: 60,
          averageOpenRate: 35,
          averageClickRate: 5,
        },
        {
          project: "Premium Villas",
          campaigns: 6,
          totalSent: 900,
          totalOpened: 450,
          totalClicked: 108,
          averageOpenRate: 50,
          averageClickRate: 12,
        },
      ],
      priceRangeAnalytics: [
        {
          priceRange: "$0-500K",
          campaigns: 8,
          totalSent: 1200,
          totalOpened: 420,
          totalClicked: 60,
          averageOpenRate: 35,
          averageClickRate: 5,
        },
        {
          priceRange: "$500K-1M",
          campaigns: 12,
          totalSent: 1800,
          totalOpened: 630,
          totalClicked: 108,
          averageOpenRate: 35,
          averageClickRate: 6,
        },
        {
          priceRange: "$1M-2M",
          campaigns: 15,
          totalSent: 2100,
          totalOpened: 903,
          totalClicked: 189,
          averageOpenRate: 43,
          averageClickRate: 9,
        },
        {
          priceRange: "$2M+",
          campaigns: 6,
          totalSent: 900,
          totalOpened: 450,
          totalClicked: 108,
          averageOpenRate: 50,
          averageClickRate: 12,
        },
      ],
      bedroomAnalytics: [
        {
          bedrooms: 1,
          campaigns: 10,
          totalSent: 1500,
          totalOpened: 525,
          totalClicked: 75,
          averageOpenRate: 35,
          averageClickRate: 5,
        },
        {
          bedrooms: 2,
          campaigns: 15,
          totalSent: 2250,
          totalOpened: 787,
          totalClicked: 135,
          averageOpenRate: 35,
          averageClickRate: 6,
        },
        {
          bedrooms: 3,
          campaigns: 12,
          totalSent: 1800,
          totalOpened: 774,
          totalClicked: 162,
          averageOpenRate: 43,
          averageClickRate: 9,
        },
        {
          bedrooms: 4,
          campaigns: 8,
          totalSent: 1200,
          totalOpened: 600,
          totalClicked: 144,
          averageOpenRate: 50,
          averageClickRate: 12,
        },
      ],
      timeSeriesData: [
        { date: "2024-01-01", opens: 45, clicks: 8, sent: 120 },
        { date: "2024-01-02", opens: 52, clicks: 12, sent: 130 },
        { date: "2024-01-03", opens: 38, clicks: 6, sent: 95 },
        { date: "2024-01-04", opens: 61, clicks: 15, sent: 140 },
        { date: "2024-01-05", opens: 48, clicks: 9, sent: 115 },
        { date: "2024-01-06", opens: 55, clicks: 11, sent: 125 },
        { date: "2024-01-07", opens: 42, clicks: 7, sent: 105 },
      ],
      devicePerformance: [
        {
          device: "desktop",
          opens: 1250,
          clicks: 187,
          openRate: 45,
          clickRate: 15,
        },
        {
          device: "mobile",
          opens: 980,
          clicks: 118,
          openRate: 38,
          clickRate: 12,
        },
        {
          device: "tablet",
          opens: 320,
          clicks: 32,
          openRate: 35,
          clickRate: 10,
        },
      ],
    }),
    []
  );
  //       priceRangeAnalytics: [
  //         {
  //           priceRange: "$0-500K",
  //           campaigns: 8,
  //           totalSent: 1200,
  //           totalOpened: 420,
  //           totalClicked: 60,
  //           averageOpenRate: 35,
  //           averageClickRate: 5,
  //         },
  //         {
  //           priceRange: "$500K-1M",
  //           campaigns: 12,
  //           totalSent: 1800,
  //           totalOpened: 630,
  //           totalClicked: 108,
  //           averageOpenRate: 35,
  //           averageClickRate: 6,
  //         },
  //         {
  //           priceRange: "$1M-2M",
  //           campaigns: 15,
  //           totalSent: 2100,
  //           totalOpened: 903,
  //           totalClicked: 189,
  //           averageOpenRate: 43,
  //           averageClickRate: 9,
  //         },
  //         {
  //           priceRange: "$2M+",
  //           campaigns: 6,
  //           totalSent: 900,
  //           totalOpened: 450,
  //           totalClicked: 108,
  //           averageOpenRate: 50,
  //           averageClickRate: 12,
  //         },
  //       ],
  //       bedroomAnalytics: [
  //         {
  //           bedrooms: 1,
  //           campaigns: 10,
  //           totalSent: 1500,
  //           totalOpened: 525,
  //           totalClicked: 75,
  //           averageOpenRate: 35,
  //           averageClickRate: 5,
  //         },
  //         {
  //           bedrooms: 2,
  //           campaigns: 15,
  //           totalSent: 2250,
  //           totalOpened: 787,
  //           totalClicked: 135,
  //           averageOpenRate: 35,
  //           averageClickRate: 6,
  //         },
  //         {
  //           bedrooms: 3,
  //           campaigns: 12,
  //           totalSent: 1800,
  //           totalOpened: 774,
  //           totalClicked: 162,
  //           averageOpenRate: 43,
  //           averageClickRate: 9,
  //         },
  //         {
  //           bedrooms: 4,
  //           campaigns: 8,
  //           totalSent: 1200,
  //           totalOpened: 600,
  //           totalClicked: 144,
  //           averageOpenRate: 50,
  //           averageClickRate: 12,
  //         },
  //       ],
  //       timeSeriesData: [
  //         { date: "2024-01-01", opens: 45, clicks: 8, sent: 120 },
  //         { date: "2024-01-02", opens: 52, clicks: 12, sent: 130 },
  //         { date: "2024-01-03", opens: 38, clicks: 6, sent: 95 },
  //         { date: "2024-01-04", opens: 61, clicks: 15, sent: 140 },
  //         { date: "2024-01-05", opens: 48, clicks: 9, sent: 115 },
  //         { date: "2024-01-06", opens: 55, clicks: 11, sent: 125 },
  //         { date: "2024-01-07", opens: 42, clicks: 7, sent: 105 },
  //       ],
  //       devicePerformance: [
  //         {
  //           device: "desktop",
  //           opens: 1250,
  //           clicks: 187,
  //           openRate: 45,
  //           clickRate: 15,
  //         },
  //         {
  //           device: "mobile",
  //           opens: 980,
  //           clicks: 118,
  //           openRate: 38,
  //           clickRate: 12,
  //         },
  //         {
  //           device: "tablet",
  //           opens: 320,
  //           clicks: 32,
  //           openRate: 35,
  //           clickRate: 10,
  //         },
  //       ],
  //     }),
  //     []
  //   );

  // API function to fetch analytics data
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert date filters to API format
      const params = {
        startDate: filters.dateRange.start,
        endDate: filters.dateRange.end,
        locations: filters.locations.length > 0 ? filters.locations : undefined,
        projects: filters.projects.length > 0 ? filters.projects : undefined,
        minPrice:
          filters.priceRange.min > 0 ? filters.priceRange.min : undefined,
        maxPrice:
          filters.priceRange.max < 10000000
            ? filters.priceRange.max
            : undefined,
        bedrooms: filters.bedrooms.length > 0 ? filters.bedrooms : undefined,
      };

      const response = await api.get("/admin/analytics/advanced", {
        params,
      });

      const apiData = response.data.data || response.data;
      setAnalyticsData(apiData);
    } catch (err: unknown) {
      console.error("Error fetching analytics data:", err);
      let errorMessage = "Failed to fetch analytics data";
      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message || err.message || errorMessage;
      }
      setError(errorMessage);
      // Fallback to mock data on API error
      setAnalyticsData(mockAdvancedData);
    } finally {
      setLoading(false);
    }
  }, [filters, mockAdvancedData]);

  // Fetch analytics data on component mount and filter changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const filteredData = useMemo(() => {
    if (!analyticsData) return null;

    // Sort all analytics arrays by click rate (highest to lowest)
    return {
      ...analyticsData,
      locationPerformance: [...analyticsData.locationPerformance].sort(
        (a, b) => b.clicked - a.clicked
      ),
      projectPerformance: [...analyticsData.projectPerformance].sort(
        (a, b) => b.totalClicked - a.totalClicked
      ),
      priceRangeAnalytics: [...analyticsData.priceRangeAnalytics].sort(
        (a, b) => b.totalClicked - a.totalClicked
      ),
      bedroomAnalytics: [...analyticsData.bedroomAnalytics].sort(
        (a, b) => b.totalClicked - a.totalClicked
      ),
      devicePerformance: [...analyticsData.devicePerformance].sort(
        //@ts-ignore
        (a, b) => b?.clicked - a?.clicked
      ),
      // Keep timeSeriesData in chronological order (don't sort by click rate)
      timeSeriesData: analyticsData.timeSeriesData,
    };
  }, [analyticsData]);

  const handleFilterChange = (newFilters: Partial<AdvancedFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    // fetchAnalyticsData will be called automatically via useEffect when filters change
  };

  // Loading state
  if (loading && !analyticsData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        <span className="ml-3 text-white">Loading analytics data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Advanced Analytics
          </h1>
          <p className="text-gray-400">
            Comprehensive insights into campaign performance across different
            dimensions
          </p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchAnalyticsData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-900 border-l-4 border-red-400 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <div>
              <p className="text-red-200 font-medium">
                Error loading analytics data
              </p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
              <p className="text-red-400 text-xs mt-1">
                Showing cached/demo data instead
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-white">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date Range
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) =>
                  handleFilterChange({
                    dateRange: {
                      ...filters.dateRange,
                      start: e.target.value,
                    },
                  })
                }
                className="flex-1 border border-zinc-600 bg-zinc-800 text-white rounded-md px-3 py-2 text-sm focus:border-yellow-400 focus:ring-yellow-400"
              />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) =>
                  handleFilterChange({
                    dateRange: { ...filters.dateRange, end: e.target.value },
                  })
                }
                className="flex-1 border border-zinc-600 bg-zinc-800 text-white rounded-md px-3 py-2 text-sm focus:border-yellow-400 focus:ring-yellow-400"
              />
            </div>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Locations
            </label>
            <select
              multiple
              value={filters.locations}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                handleFilterChange({ locations: selectedOptions });
              }}
              className="w-full border border-zinc-600 bg-zinc-800 text-white rounded-md px-3 py-2 text-sm focus:border-yellow-400 focus:ring-yellow-400"
            >
              <option value="Downtown">Downtown</option>
              <option value="Suburbs">Suburbs</option>
              <option value="Waterfront">Waterfront</option>
              <option value="Business District">Business District</option>
              <option value="Historic District">Historic District</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Projects
            </label>
            <select
              multiple
              value={filters.projects}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                handleFilterChange({ projects: selectedOptions });
              }}
              className="w-full border border-zinc-600 bg-zinc-800 text-white rounded-md px-3 py-2 text-sm focus:border-yellow-400 focus:ring-yellow-400"
            >
              <option value="Luxury Condos">Luxury Condos</option>
              <option value="Family Homes">Family Homes</option>
              <option value="Starter Apartments">Starter Apartments</option>
              <option value="Premium Villas">Premium Villas</option>
            </select>
          </div> */}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-700 mb-8">
        <div className="border-b border-zinc-700">
          <nav className="flex space-x-8 px-6">
            {[
              { key: "location", label: "Location", icon: MapPin },
              { key: "project", label: "Project", icon: Home },
              { key: "price", label: "Price Range", icon: DollarSign },
              { key: "bedrooms", label: "Bedrooms", icon: Bed },
              { key: "trends", label: "Trends", icon: TrendingUp },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() =>
                  setActiveTab(
                    key as
                      | "location"
                      | "project"
                      | "price"
                      | "bedrooms"
                      | "trends"
                  )
                }
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === key
                    ? "border-yellow-400 text-yellow-400"
                    : "border-transparent text-gray-400 hover:text-white hover:border-zinc-500"
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === "location" && (
          <div className="space-y-6">
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Performance by Location
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                  data={filteredData?.locationPerformance.map((item) => ({
                    ...item,
                    name: item.location,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis dataKey="location" tick={{ fill: "#d4d4d8" }} />
                  {/* Left Y-axis for rates (percentages) */}
                  <YAxis
                    yAxisId="rate"
                    tick={{ fill: "#d4d4d8" }}
                    label={{
                      value: "Rate (%)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fill: "#d4d4d8" },
                    }}
                  />
                  {/* Right Y-axis for actual numbers */}
                  <YAxis
                    yAxisId="count"
                    orientation="right"
                    tick={{ fill: "#d4d4d8" }}
                    label={{
                      value: "Count",
                      angle: 90,
                      position: "insideRight",
                      style: { textAnchor: "middle", fill: "#d4d4d8" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                    formatter={(value, name) => {
                      if (String(name).includes("Rate")) {
                        return [`${value}%`, name];
                      }
                      return [Number(value).toLocaleString(), name];
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#ffffff" }} />
                  {/* Rate bars */}
                  <Bar
                    yAxisId="rate"
                    dataKey="openRate"
                    fill="#0088FE"
                    name="Open Rate %"
                  />
                  <Bar
                    yAxisId="rate"
                    dataKey="clickRate"
                    fill="#00C49F"
                    name="Click Rate %"
                  />
                  {/* Count bars with semi-transparent colors */}
                  <Bar
                    yAxisId="count"
                    dataKey="opened"
                    fill="#0088FE80"
                    name="Opened Count"
                  />
                  <Bar
                    yAxisId="count"
                    dataKey="clicked"
                    fill="#00C49F80"
                    name="Clicked Count"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "project" && (
          <div className="space-y-6">
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Performance by Project
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                  data={filteredData?.projectPerformance.map((item) => ({
                    ...item,
                    name: item.project,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis dataKey="project" tick={{ fill: "#d4d4d8" }} />
                  {/* Left Y-axis for rates (percentages) */}
                  <YAxis
                    yAxisId="rate"
                    tick={{ fill: "#d4d4d8" }}
                    label={{
                      value: "Rate (%)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fill: "#d4d4d8" },
                    }}
                  />
                  {/* Right Y-axis for actual numbers */}
                  <YAxis
                    yAxisId="count"
                    orientation="right"
                    tick={{ fill: "#d4d4d8" }}
                    label={{
                      value: "Total Count",
                      angle: 90,
                      position: "insideRight",
                      style: { textAnchor: "middle", fill: "#d4d4d8" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                    formatter={(value, name) => {
                      if (String(name).includes("Rate")) {
                        return [`${value}%`, name];
                      }
                      return [Number(value).toLocaleString(), name];
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#ffffff" }} />
                  {/* Rate bars */}
                  <Bar
                    yAxisId="rate"
                    dataKey="averageOpenRate"
                    fill="#FFBB28"
                    name="Avg Open Rate %"
                  />
                  <Bar
                    yAxisId="rate"
                    dataKey="averageClickRate"
                    fill="#FF8042"
                    name="Avg Click Rate %"
                  />
                  {/* Count bars with semi-transparent colors */}
                  <Bar
                    yAxisId="count"
                    dataKey="totalOpened"
                    fill="#FFBB2880"
                    name="Total Opened"
                  />
                  <Bar
                    yAxisId="count"
                    dataKey="totalClicked"
                    fill="#FF804280"
                    name="Total Clicked"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "price" && (
          <div className="space-y-6">
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Performance by Price Range
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={filteredData?.priceRangeAnalytics.map((item) => ({
                    ...item,
                    name: item.priceRange,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis dataKey="priceRange" tick={{ fill: "#d4d4d8" }} />
                  <YAxis tick={{ fill: "#d4d4d8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#ffffff" }} />
                  <Bar
                    dataKey="averageOpenRate"
                    fill="#8884d8"
                    name="Avg Open Rate %"
                  />
                  <Bar
                    dataKey="averageClickRate"
                    fill="#82ca9d"
                    name="Avg Click Rate %"
                  />
                  <Bar dataKey="totalClicked" fill="#82ca9d" name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "bedrooms" && (
          <div className="space-y-6">
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Performance by Bedroom Count
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                  data={filteredData?.bedroomAnalytics.map((item) => ({
                    ...item,
                    name: item.bedrooms.toString(),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis dataKey="bedrooms" tick={{ fill: "#d4d4d8" }} />
                  {/* Left Y-axis for rates (percentages) */}
                  <YAxis
                    yAxisId="rate"
                    tick={{ fill: "#d4d4d8" }}
                    label={{
                      value: "Rate (%)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle", fill: "#d4d4d8" },
                    }}
                  />
                  {/* Right Y-axis for actual numbers */}
                  <YAxis
                    yAxisId="count"
                    orientation="right"
                    tick={{ fill: "#d4d4d8" }}
                    label={{
                      value: "Total Count",
                      angle: 90,
                      position: "insideRight",
                      style: { textAnchor: "middle", fill: "#d4d4d8" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                    formatter={(value, name) => {
                      if (String(name).includes("Rate")) {
                        return [`${value}%`, name];
                      }
                      return [Number(value).toLocaleString(), name];
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#ffffff" }} />
                  {/* Rate bars */}
                  <Bar
                    yAxisId="rate"
                    dataKey="averageOpenRate"
                    fill="#0088FE"
                    name="Avg Open Rate %"
                  />
                  <Bar
                    yAxisId="rate"
                    dataKey="averageClickRate"
                    fill="#00C49F"
                    name="Avg Click Rate %"
                  />
                  {/* Count bars with semi-transparent colors */}
                  <Bar
                    yAxisId="count"
                    dataKey="totalOpened"
                    fill="#0088FE80"
                    name="Total Opened"
                  />
                  <Bar
                    yAxisId="count"
                    dataKey="totalClicked"
                    fill="#00C49F80"
                    name="Total Clicked"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "trends" && (
          <div className="space-y-6">
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Performance Trends Over Time
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredData?.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                  <XAxis dataKey="date" tick={{ fill: "#d4d4d8" }} />
                  <YAxis tick={{ fill: "#d4d4d8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: "8px",
                      color: "#ffffff",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#ffffff" }} />
                  <Line
                    type="monotone"
                    dataKey="opens"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Opens"
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Clicks"
                  />
                  <Line
                    type="monotone"
                    dataKey="sent"
                    stroke="#ffc658"
                    strokeWidth={2}
                    name="Sent"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Performance by Device Type
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredData?.devicePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="device" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="openRate" fill="#0088FE" name="Open Rate %" />
                    <Bar
                      dataKey="clickRate"
                      fill="#00C49F"
                      name="Click Rate %"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Device Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={filteredData?.devicePerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ device, opens }) => `${device}: ${opens}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="opens"
                    >
                      {filteredData?.devicePerformance.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
