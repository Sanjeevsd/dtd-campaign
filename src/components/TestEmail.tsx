import React, { useState } from 'react';
import { Mail, Plus, X, Send, ArrowLeft } from 'lucide-react';

interface TestEmailProps {
  campaignData: {
    fromName: string;
    subject: string;
    htmlTemplate: string;
  };
  onBack: () => void;
  onSendTest: (emails: string[]) => void;
  onProceedToSend: () => void;
}

const TestEmail: React.FC<TestEmailProps> = ({ 
  campaignData, 
  onBack, 
  onSendTest, 
  onProceedToSend 
}) => {
  const [testEmails, setTestEmails] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const addEmailField = () => {
    setTestEmails([...testEmails, '']);
  };

  const removeEmailField = (index: number) => {
    const newEmails = testEmails.filter((_, i) => i !== index);
    setTestEmails(newEmails.length ? newEmails : ['']);
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...testEmails];
    newEmails[index] = value;
    setTestEmails(newEmails);
    
    // Clear errors for this field
    if (errors[index]) {
      const newErrors = [...errors];
      newErrors[index] = '';
      setErrors(newErrors);
    }
  };

  const validateEmails = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors: string[] = [];
    let isValid = true;

    testEmails.forEach((email, index) => {
      if (email.trim() && !emailRegex.test(email.trim())) {
        newErrors[index] = 'Please enter a valid email address';
        isValid = false;
      } else {
        newErrors[index] = '';
      }
    });

    const validEmails = testEmails.filter(email => email.trim());
    if (validEmails.length === 0) {
      newErrors[0] = 'Please enter at least one email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSendTest = async () => {
    if (!validateEmails()) return;

    setIsLoading(true);
    const validEmails = testEmails.filter(email => email.trim());
    
    try {
      await onSendTest(validEmails);
      setTestSent(true);
    } catch (error) {
      console.error('Error sending test email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Test Your Campaign</h2>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Edit</span>
          </button>
        </div>

        {/* Campaign Summary */}
        <div className="bg-zinc-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Campaign Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-zinc-400">From:</span>
              <span className="ml-2 text-white">{campaignData.fromName}</span>
            </div>
            <div>
              <span className="text-zinc-400">Subject:</span>
              <span className="ml-2 text-white">{campaignData.subject}</span>
            </div>
          </div>
        </div>

        {/* Test Email Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Test Recipients</h3>
          <p className="text-zinc-400 text-sm">
            Add email addresses to receive a test version of your campaign before sending to your full list.
          </p>

          {testEmails.map((email, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
                {errors[index] && (
                  <p className="mt-1 text-sm text-red-400">{errors[index]}</p>
                )}
              </div>
              
              {testEmails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmailField(index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-zinc-800 rounded-md"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addEmailField}
            className="flex items-center space-x-2 px-4 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-zinc-800 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Another Email</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-zinc-700">
          <button
            type="button"
            onClick={handleSendTest}
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>{isLoading ? 'Sending...' : 'Send Test'}</span>
          </button>

          {testSent && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Test emails sent successfully!</span>
              </div>
              
              <button
                type="button"
                onClick={onProceedToSend}
                className="flex items-center space-x-2 px-6 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-300 transition-colors font-medium"
              >
                <Send className="h-4 w-4" />
                <span>Send Campaign</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestEmail;