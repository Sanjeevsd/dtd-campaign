import React, { useState } from "react";
import { Calendar, ChevronDown, Filter } from "lucide-react";

export interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
  preset: string;
}

interface DateRangeFilterProps {
  onFilterChange: (filter: DateFilter) => void;
  currentFilter: DateFilter;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onFilterChange,
  currentFilter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const presets = [
    { label: "All Time", value: "all", days: null },
    { label: "Today", value: "1day", days: 1 },
    { label: "Last 2 Days", value: "2days", days: 2 },
    { label: "Last Week", value: "1week", days: 7 },
    { label: "Last 10 Days", value: "10days", days: 10 },
    { label: "Last Month", value: "1month", days: 30 },
    { label: "Last 3 Months", value: "3months", days: 90 },
    { label: "Custom Range", value: "custom", days: null },
  ];

  const calculateDateRange = (days: number | null) => {
    if (days === null) {
      return { startDate: null, endDate: null };
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    return { startDate, endDate };
  };

  const handlePresetSelect = (preset: (typeof presets)[0]) => {
    const { startDate, endDate } = calculateDateRange(preset.days);

    onFilterChange({
      startDate,
      endDate,
      preset: preset.value,
    });

    if (preset.value !== "custom") {
      setIsOpen(false);
    }
  };

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      const startDate = new Date(customStartDate);
      const endDate = new Date(customEndDate);

      // Set end date to end of day
      endDate.setHours(23, 59, 59, 999);

      onFilterChange({
        startDate,
        endDate,
        preset: "custom",
      });
      setIsOpen(false);
    }
  };

  const formatDateRange = () => {
    const preset = presets.find((p) => p.value === currentFilter.preset);

    if (currentFilter.preset === "all") {
      return "All Time";
    }

    if (
      currentFilter.preset === "custom" &&
      currentFilter.startDate &&
      currentFilter.endDate
    ) {
      return `${currentFilter.startDate.toLocaleDateString()} - ${currentFilter.endDate.toLocaleDateString()}`;
    }

    return preset?.label || "Select Date Range";
  };

  const resetCustomDates = () => {
    setCustomStartDate("");
    setCustomEndDate("");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
      >
        <Calendar className="h-4 w-4" />
        <span className="text-sm">{formatDateRange()}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              resetCustomDates();
            }}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-20">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-white">
                  Filter by Date Range
                </span>
              </div>

              {/* Preset Options */}
              <div className="space-y-1 mb-4">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePresetSelect(preset)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      currentFilter.preset === preset.value
                        ? "bg-yellow-400 text-black font-medium"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom Date Range */}
              {currentFilter.preset === "custom" && (
                <div className="border-t border-gray-600 pt-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCustomDateChange}
                        disabled={!customStartDate || !customEndDate}
                        className="flex-1 px-3 py-2 bg-yellow-400 text-black rounded-md text-sm font-medium hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => {
                          resetCustomDates();
                          handlePresetSelect(presets[0]); // Reset to "All Time"
                        }}
                        className="px-3 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-500 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangeFilter;
