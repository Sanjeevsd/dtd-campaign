import React, { useState } from "react";
import { Eye, EyeOff, Save, Send } from "lucide-react";
import { CampaignFormData } from "../types/campaign";

interface CampaignFormProps {
  onSave: (data: CampaignFormData) => void;
  onNext: (data: CampaignFormData) => void;
  initialData?: Partial<CampaignFormData>;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  onSave,
  onNext,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    fromName: initialData.fromName || "",
    subject: initialData.subject || "",
    htmlTemplate: initialData.htmlTemplate || "",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Partial<CampaignFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CampaignFormData> = {};

    if (!formData.fromName.trim()) {
      newErrors.fromName = "From Name is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.htmlTemplate.trim()) {
      newErrors.htmlTemplate = "HTML template is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleInputChange = (field: keyof CampaignFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <h2 className="text-2xl font-bold text-white mb-6">
          Create New Campaign
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="fromName"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                From Name *
              </label>
              <input
                type="text"
                id="fromName"
                value={formData.fromName}
                onChange={(e) => handleInputChange("fromName", e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="e.g., MyDowntown Dubai Team"
              />
              {errors.fromName && (
                <p className="mt-1 text-sm text-red-400">{errors.fromName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Email Subject *
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Enter your email subject"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-400">{errors.subject}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="htmlTemplate"
                  className="block text-sm font-medium text-zinc-300"
                >
                  HTML Email Template *
                </label>
                {/* <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-1 text-sm text-yellow-400 hover:text-yellow-300"
                >
                  {showPreview ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
                </button> */}
              </div>
              <textarea
                id="htmlTemplate"
                value={formData.htmlTemplate}
                onChange={(e) =>
                  handleInputChange("htmlTemplate", e.target.value)
                }
                rows={12}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent font-mono text-sm"
                placeholder="Paste your HTML email template here..."
              />
              {errors.htmlTemplate && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.htmlTemplate}
                </p>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Email Preview
              </h3>
              <div className="bg-white rounded-lg p-4 border border-zinc-600 max-h-96  w-[320px] overflow-y-auto">
                <div className="border-b border-zinc-200 pb-2 mb-4">
                  <p className="text-sm text-zinc-600">
                    From: {formData.fromName || "From Name"}
                  </p>
                  <p className="text-sm text-zinc-600">
                    Subject: {formData.subject || "Subject Line"}
                  </p>
                </div>
                <div className="w-[320px]">
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        formData.htmlTemplate ||
                        '<p class="text-zinc-500">HTML template preview will appear here...</p>',
                    }}
                    className="prose w-[320px]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          {/* <button
            type="button"
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </button> */}

          <button
            type="button"
            onClick={handleNext}
            className="w-full md:w-max flex items-center space-x-2 px-6 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition-colors font-medium"
          >
            <Send className="h-4 w-4" />
            <span>Test Campaign</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignForm;
