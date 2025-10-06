import React, { useState } from 'react';
import { Send, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface SendCampaignProps {
  campaignData: {
    fromName: string;
    subject: string;
    htmlTemplate: string;
  };
  onBack: () => void;
  onSend: () => void;
  onComplete: () => void;
}

const SendCampaign: React.FC<SendCampaignProps> = ({
  campaignData,
  onBack,
  onSend,
  onComplete
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSend = async () => {
    if (!isConfirmed) return;
    
    setIsSending(true);
    try {
      await onSend();
      setIsSent(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    } catch (error) {
      console.error('Error sending campaign:', error);
      setIsSending(false);
    }
  };

  if (isSent) {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-700 text-center">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Campaign Sent Successfully!</h2>
          <p className="text-zinc-400 mb-6">
            Your email campaign "{campaignData.subject}" has been sent to your subscriber list.
          </p>
          <button
            onClick={onComplete}
            className="px-6 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition-colors font-medium"
          >
            View Campaign Analytics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Send Campaign</h2>
          <button
            onClick={onBack}
            disabled={isSending}
            className="flex items-center space-x-2 px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Test</span>
          </button>
        </div>

        {/* Final Review */}
        <div className="bg-zinc-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Final Review</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">From Name:</span>
              <span className="text-white">{campaignData.fromName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Subject:</span>
              <span className="text-white">{campaignData.subject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Template:</span>
              <span className="text-white">HTML template ready</span>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="text-yellow-400 font-medium">Important Notice</h4>
              <p className="text-yellow-200 text-sm mt-1">
                Once you send this campaign, it cannot be stopped or recalled. Make sure you have:
              </p>
              <ul className="text-yellow-200 text-sm mt-2 list-disc list-inside space-y-1">
                <li>Tested your email template thoroughly</li>
                <li>Verified all links and content</li>
                <li>Confirmed your subscriber list is accurate</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Confirmation */}
        <div className="space-y-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 text-yellow-400 bg-zinc-800 border-zinc-600 rounded focus:ring-yellow-400 focus:ring-2"
            />
            <span className="text-white text-sm">
              I have reviewed the campaign content and am ready to send this email to my subscriber list.
            </span>
          </label>
        </div>

        {/* Send Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-zinc-700">
          <button
            onClick={handleSend}
            disabled={!isConfirmed || isSending}
            className="flex items-center space-x-2 px-8 py-3 bg-red-600 text-white rounded-md hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Send className="h-5 w-5" />
            <span>{isSending ? 'Sending Campaign...' : 'Send Campaign Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendCampaign;