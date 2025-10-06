export interface CampaignImage {
  file: File;
  id: string;
  url?: string; // For preview or uploaded URL
  name: string;
  size: number;
  type: string;
}

export interface Campaign {
  id: string;
  subject: string;
  fromName: string;
  htmlTemplate: string;
  images?: CampaignImage[];
  createdAt: string;
  sentAt?: string;
  status: "draft" | "testing" | "sent";
  emailsSent: number;
  emailsOpened: number;
  testEmails: string[];
}

export interface CampaignFormData {
  fromName: string;
  subject: string;
  htmlTemplate: string;
  images: CampaignImage[];
}

export interface TestEmailData {
  emails: string[];
  campaignId: string;
}
