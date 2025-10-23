import React, { useState } from "react";
import { Send } from "lucide-react";
import { CampaignFormData, CampaignImage } from "../types/campaign";
import ImageUpload from "./ImageUpload";

interface CampaignFormProps {
  onSave: (data: CampaignFormData) => void;
  onNext: (data: CampaignFormData) => void;
  initialData?: Partial<CampaignFormData>;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  onNext,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    fromName: initialData.fromName || "",
    subject: initialData.subject || "",
    htmlTemplate: initialData.htmlTemplate || "",
    images: initialData.images || [],
  });
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

    // Images are optional, so no validation required
    // But you could add validation here if needed:
    // if (formData.images.length === 0) {
    //   newErrors.images = "At least one image is required";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleInputChange = (
    field: keyof CampaignFormData,
    value: string | CampaignImage[]
  ) => {
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

            {/* Image Upload Section */}
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => handleInputChange("images", images)}
              maxFiles={10}
              maxFileSize={5}
            />

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
                  handleInputChange(
                    "htmlTemplate",
                    e.target.value
                      .replace(
                        "</title>",
                        `</title>
	 <meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">`
                      )
                      .replace(
                        "</body>",
                        ` <table
        align="center"
        width="100%"
        data-id="react-email-row"
        style="margin-top: 8px"
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >
        <tbody style="width: 100%">
          <tr style="width: 100%">
            <td data-id="__react-email-column" style="text-align: center">
              <span
                style="
                  font-family: Helvetica;
                  font-size: 12px;
                  font-weight: 400;
                  line-height: 18px;
                  color: #000;
                "
                >If you no longer wish to receive<br />
                Newsletter please
                <a
                  href="https://unsub.mydowntown-dubai.com/unsubscribe?email={{email}}"
                  style="
                    font-family: Helvetica;
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 18px;
                    color: #000;
                  "
                  >click here.</a
                ></span
              >
            </td>
          </tr>
        </tbody>
      </table>
      <img data-id="react-email-img"  src="https://admin.aajproperty.com/api/v1/newsletter/tracking-email?email=em&domain=${formData.subject}&region=${formData.subject}" width="1" height="1" style="display:block;outline:none;border:none;text-decoration:none" />
      </body>`
                      )
                  )
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

          {/* Note: Preview functionality can be re-added later if needed */}
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
