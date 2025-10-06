export interface Campaign {
  id: string;
  subject: string;
  fromName: string;
  htmlTemplate: string;
  createdAt: string;
  sentAt?: string;
  status: 'draft' | 'testing' | 'sent';
  emailsSent: number;
  emailsOpened: number;
  testEmails: string[];
}

export interface CampaignFormData {
  fromName: string;
  subject: string;
  htmlTemplate: string;
}

export interface TestEmailData {
  emails: string[];
  campaignId: string;
}