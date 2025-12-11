/**
 * Settings View - Terms & Conditions Management
 * Allows admins to edit and preview Terms & Conditions for the pricing page
 */
import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { FileTextIcon, SaveIcon, EyeIcon } from '../ui/Icons';
import Modal from '../ui/Modal';

const Settings: React.FC = () => {
  const [termsContent, setTermsContent] = useState<string>(
    `# Terms & Conditions

## 1. Service Agreement
By subscribing to CMDI Credit Pricing services, you agree to the following terms and conditions.

## 2. Pricing & Billing
- Subscription fees are based on the number of records in your Crimson People database
- Monthly credits are included with your subscription tier
- Overage charges apply when monthly credits are exceeded
- All prices are in USD and billed monthly

## 3. Credit Usage
- Credits are consumed when using CMDI features and services
- Monthly credits refresh on the 1st of each month
- Credits do not roll over to the next billing period
- Overage credits are billed at the rate specified in your subscription tier

## 4. Payment Terms
- Payment is due upon receipt of invoice
- Late payments may result in service suspension
- All fees are non-refundable

## 5. Service Level
- We strive to maintain 99.9% uptime
- Scheduled maintenance will be communicated in advance
- Support is available during business hours (9 AM - 5 PM EST)

## 6. Data & Privacy
- Your data is stored securely and encrypted
- We comply with all applicable data protection regulations
- Data is backed up daily

## 7. Termination
- Either party may terminate with 30 days written notice
- Upon termination, all unused credits are forfeited
- Final invoice will be sent within 15 days of termination

## 8. Changes to Terms
- We reserve the right to modify these terms with 30 days notice
- Continued use of services constitutes acceptance of modified terms

Last Updated: December 10, 2025
Updated By: Admin User`
  );

  const [lastSaved, setLastSaved] = useState<string>('December 10, 2025 at 2:30 PM');
  const [lastSavedBy, setLastSavedBy] = useState<string>('Admin User');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    setLastSaved(formattedDate);
    setLastSavedBy('Admin User');
    setIsSaving(false);
    
    alert('Terms & Conditions saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage application settings and Terms & Conditions</p>
      </div>

      {/* Terms & Conditions Editor */}
      <Card 
        title="Terms & Conditions" 
        icon={<FileTextIcon />}
        actions={
          <div className="flex gap-2">
            <Button onClick={() => setIsPreviewOpen(true)} variant="secondary" size="sm">
              <EyeIcon /> Preview
            </Button>
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              <SaveIcon /> {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileTextIcon className="text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900">About Terms & Conditions</h3>
                <p className="text-sm text-blue-700 mt-1">
                  These terms will be displayed on the public pricing page. Use Markdown formatting for headings, lists, and emphasis.
                </p>
              </div>
            </div>
          </div>

          {/* Last Updated Info */}
          <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            <div>
              <span className="font-medium">Last Updated:</span> {lastSaved}
            </div>
            <div>
              <span className="font-medium">By:</span> {lastSavedBy}
            </div>
          </div>

          {/* Editor */}
          <div>
            <label htmlFor="terms-editor" className="block text-sm font-medium text-gray-700 mb-2">
              Terms & Conditions Content
            </label>
            <textarea
              id="terms-editor"
              value={termsContent}
              onChange={(e) => setTermsContent(e.target.value)}
              rows={20}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm font-mono"
              placeholder="Enter your Terms & Conditions here..."
            />
            <p className="mt-2 text-xs text-gray-500">
              Supports Markdown formatting: # for headings, ** for bold, * for italic, - for lists
            </p>
          </div>
        </div>
      </Card>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Terms & Conditions Preview"
        size="lg"
      >
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {termsContent}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;

