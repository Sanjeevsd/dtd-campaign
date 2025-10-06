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
    images: [],
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
    try {
      // Here you would call your backend API to send test emails
      console.log("Sending test emails to:", emails);
      console.log("Campaign data:", campaignData);

      // Create FormData to handle file uploads
      const formData = new FormData();
      // formData.append("emails", JSON.stringify(emails));
      // formData.append("subject", campaignData.subject);
      // formData.append("fromName", campaignData.fromName);
      // formData.append("htmlTemplate", campaignData.htmlTemplate);

      // Append images if any
      campaignData.images.forEach((image) => {
        formData.append(`emailpics`, image.file);
      });
      formData.append("data", JSON.stringify({ ...campaignData, emails }));

      await axios.post(
        "https://admin.aajproperty.com/api/v3/admin/send-test",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return { success: true };
    } catch (error) {
      console.error("Error sending test emails:", error);
      return { success: false, error: "Failed to send test emails" };
    }
  };

  const handleProceedToSend = () => {
    setCurrentStep("send");
  };

  const handleSendCampaign = async () => {
    try {
      // Here you would call your backend API to send the campaign
      console.log("Sending campaign:", campaignData);

      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append("subject", campaignData.subject);
      formData.append("fromName", campaignData.fromName);
      formData.append("htmlTemplate", campaignData.htmlTemplate);
      formData.append("sentAt", new Date().toISOString());
      formData.append("status", "sent");

      // Append images if any
      campaignData.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image.file);
      });

      await axios.post(
        "https://admin.aajproperty.com/api/v3/admin/dtd-create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return { success: true };
    } catch (error) {
      console.error("Error sending campaign:", error);
      return { success: false, error: "Failed to send campaign" };
    }
  };

  const handleComplete = () => {
    // Reset form and go back to create step, or redirect to campaigns page
    setCurrentStep("create");
    setCampaignData({
      fromName: "",
      subject: "",
      htmlTemplate: "",
      images: [],
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
