export interface CampaignImage {
  file: File;
  id: string;
  url?: string; // For preview or uploaded URL
  name: string;
  size: number;
  type: string;
}

export interface Campaign {
  _id?: string;
  id: string;
  subject: string;
  fromName: string;
  htmlTemplate: string;
  createdAt: string;
  sentAt?: string;
  status: "draft" | "testing" | "sent";
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number; // New field
  testEmails: string[];
  images?: CampaignImage[];
  // Advanced analytics fields
  project?: string;
  location?: string;
  price?: number;
  bedrooms?: number;
  propertyType?: string;
}

export interface CampaignFormData {
  subject: string;
  fromName: string;
  htmlTemplate: string;
  testEmails: string[];
  images: CampaignImage[];
}

// New interfaces for analytics
export interface OpenedEmail {
  Email: string;
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LinkClickDocument {
  originalUrl: string;
  _id: string;
  userAgent: string;
  campaignId: string;
  email: string;
  createdAt: string;
}

export interface CampaignAnalytics {
  campaignId: string;
  openedEmails: OpenedEmail[];
  clickedEmails: LinkClickDocument[];
  totalOpens: number;
  totalClicks: number;
  uniqueOpens: number;
  uniqueClicks: number;
}

export interface TestEmailData {
  emails: string[];
  campaignId: string;
}

// Advanced Analytics Types
export interface DemographicData {
  location?: string;
  age?: number;
  interests?: string[];
  deviceType?: "desktop" | "mobile" | "tablet";
  source?: string;
}

export interface EnhancedOpenedEmail extends OpenedEmail {
  location?: string;
  deviceType?: "desktop" | "mobile" | "tablet";
  demographics?: DemographicData;
}

export interface EnhancedLinkClick extends LinkClickDocument {
  location?: string;
  deviceType?: "desktop" | "mobile" | "tablet";
  demographics?: DemographicData;
}

export interface LocationPerformance {
  location: string;
  sent: number;
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;
}

export interface ProjectPerformance {
  project: string;
  campaigns: number;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  averageOpenRate: number;
  averageClickRate: number;
}

export interface PriceRangeAnalytics {
  priceRange: string;
  campaigns: number;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  averageOpenRate: number;
  averageClickRate: number;
}

export interface BedroomAnalytics {
  bedrooms: number;
  campaigns: number;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  averageOpenRate: number;
  averageClickRate: number;
}

export interface AdvancedAnalyticsData {
  locationPerformance: LocationPerformance[];
  projectPerformance: ProjectPerformance[];
  priceRangeAnalytics: PriceRangeAnalytics[];
  bedroomAnalytics: BedroomAnalytics[];
  timeSeriesData: {
    date: string;
    opens: number;
    clicks: number;
    sent: number;
  }[];
  devicePerformance: {
    device: "desktop" | "mobile" | "tablet";
    opens: number;
    clicks: number;
    openRate: number;
    clickRate: number;
  }[];
}

export interface AdvancedFilters {
  dateRange: {
    start: string;
    end: string;
  };
  locations: string[];
  projects: string[];
  priceRange: {
    min: number;
    max: number;
  };
  bedrooms: number[];
  deviceTypes: ("desktop" | "mobile" | "tablet")[];
}
