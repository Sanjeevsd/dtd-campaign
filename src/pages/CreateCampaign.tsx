import React, { useState } from "react";
import CampaignForm from "../components/CampaignForm";
import TestEmail from "../components/TestEmail";
import SendCampaign from "../components/SendCampaign";
import { CampaignFormData } from "../types/campaign";
import axios from "axios";

type Step = "create" | "test" | "send";

const CreateCampaign: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>("create");
  const [campaignData, setCampaignData] = useState<CampaignFormData>({
    fromName: "",
    subject: "",
    htmlTemplate: "",
  });

  const handleSave = (data: CampaignFormData) => {
    setCampaignData(data);
    // Here you would typically save to backend
    console.log("Saving campaign draft:", data);
  };

  const handleNext = (data: CampaignFormData) => {
    setCampaignData(data);
    setCurrentStep("test");
  };

  const handleSendTest = async (emails: string[]) => {
    // Here you would call your backend API to send test emails
    console.log("Sending test emails to:", emails);
    console.log("Campaign data:", campaignData);

    await axios.post("https://admin.aajproperty.com/api/v3/admin/send-test", {
      emails,
      subject: campaignData.subject,
      fromName: campaignData.fromName,
      htmlTemplate: campaignData.htmlTemplate,
    });

    return { success: true };
  };

  const handleProceedToSend = () => {
    setCurrentStep("send");
  };

  const handleSendCampaign = async () => {
    // Here you would call your backend API to send the campaign
    console.log("Sending campaign:", campaignData);
    //  subject: { type: String, required: true },
    // fromName: { type: String, required: true },
    // htmlTemplate: { type: String, required: true },
    // sentAt: { type: String },
    // status: {
    //   type: String,
    //   enum: ["draft", "testing", "sent"],
    //   default: "draft",
    //   required: true,
    // },
    await axios.post("https://admin.aajproperty.com/api/v3/admin/dtd-create", {
      subject: campaignData.subject,
      fromName: campaignData.fromName,
      htmlTemplate: campaignData.htmlTemplate,
      sentAt: new Date().toISOString(),
      status: "sent",
    });

    return { success: true };
  };

  const handleComplete = () => {
    // Reset form and go back to create step, or redirect to campaigns page
    setCurrentStep("create");
    setCampaignData({
      fromName: "",
      subject: "",
      htmlTemplate: "",
    });
  };

  const handleBackToCreate = () => {
    setCurrentStep("create");
  };

  const handleBackToTest = () => {
    setCurrentStep("test");
  };

  switch (currentStep) {
    case "create":
      return (
        <CampaignForm
          onSave={handleSave}
          onNext={handleNext}
          initialData={campaignData}
        />
      );

    case "test":
      return (
        <TestEmail
          campaignData={campaignData}
          onBack={handleBackToCreate}
          onSendTest={handleSendTest}
          onProceedToSend={handleProceedToSend}
        />
      );

    case "send":
      return (
        <SendCampaign
          campaignData={campaignData}
          onBack={handleBackToTest}
          onSend={handleSendCampaign}
          onComplete={handleComplete}
        />
      );

    default:
      return null;
  }
};

export default CreateCampaign;
