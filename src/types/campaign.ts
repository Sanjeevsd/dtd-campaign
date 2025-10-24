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
