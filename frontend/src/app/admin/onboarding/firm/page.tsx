'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Upload,
  MapPin,
  Users2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { AdminLayout } from '@/components/shared/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, FormField, Label } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FirmFormData {
  firmName: string;
  legalBusinessName: string;
  registrationNumber: string;
  primaryPhone: string;
  businessAddress: string;
  numberOfEmployees: string;
  businessDescription: string;
  logo: File | null;
}

export default function FirmCreationPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FirmFormData>({
    firmName: '',
    legalBusinessName: '',
    registrationNumber: '',
    primaryPhone: '',
    businessAddress: '',
    numberOfEmployees: '1-10',
    businessDescription: '',
    logo: null,
  });

  const [errors, setErrors] = useState<Partial<FirmFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FirmFormData> = {};

    if (!formData.firmName.trim()) {
      newErrors.firmName = 'Firm name is required';
    }

    if (
      formData.primaryPhone &&
      !/^[\+]?[\d\s\-\(\)]+$/.test(formData.primaryPhone)
    ) {
      newErrors.primaryPhone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange =
    (field: keyof FirmFormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  const handleLogoUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setFormData((prev) => ({ ...prev, logo: file }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleLogoUpload(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Implement actual API call
      console.log('Firm data:', formData);

      // Navigate to next step
      router.push('/admin/onboarding/expenses');
    } catch (error) {
      console.error('Failed to create firm:', error);
      alert('Failed to create firm. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/onboarding');
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">Create Your Firm Profile</h1>
            <p className="text-muted-foreground">
              Step 1 of 6 - Set up your organization details
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progress</span>
            <span className="text-admin-600 font-medium">Step 1 of 6</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-admin-500 h-2 rounded-full w-[16.67%]"></div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Organization Information</span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Firm Name */}
              <FormField label="Firm Name" required error={errors.firmName}>
                <Input
                  type="text"
                  placeholder="e.g. Gulf Property Management"
                  value={formData.firmName}
                  onChange={handleInputChange('firmName')}
                  error={errors.firmName}
                />
              </FormField>

              {/* Legal Business Name */}
              <FormField
                label="Legal Business Name"
                className="text-sm text-muted-foreground"
              >
                <Input
                  type="text"
                  placeholder="Official registered business name"
                  value={formData.legalBusinessName}
                  onChange={handleInputChange('legalBusinessName')}
                />
              </FormField>

              {/* Registration Number */}
              <FormField label="Registration Number">
                <Input
                  type="text"
                  placeholder="Business registration number"
                  value={formData.registrationNumber}
                  onChange={handleInputChange('registrationNumber')}
                />
              </FormField>

              {/* Primary Phone */}
              <FormField label="Primary Phone" error={errors.primaryPhone}>
                <Input
                  type="tel"
                  placeholder="+965 9999 0001"
                  value={formData.primaryPhone}
                  onChange={handleInputChange('primaryPhone')}
                  error={errors.primaryPhone}
                />
              </FormField>

              {/* Business Address */}
              <FormField label="Business Address">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Street address, city, country"
                    value={formData.businessAddress}
                    onChange={handleInputChange('businessAddress')}
                    className="pr-10"
                  />
                  <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  We&apos;ll show a map preview in the next version
                </p>
              </FormField>

              {/* Number of Employees */}
              <FormField label="Number of Employees">
                <select
                  value={formData.numberOfEmployees}
                  onChange={handleInputChange('numberOfEmployees')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-100">51-100 employees</option>
                  <option value="100+">100+ employees</option>
                </select>
              </FormField>

              {/* Logo Upload */}
              <FormField label="Company Logo (Optional)">
                <div
                  className={cn(
                    'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                    dragActive
                      ? 'border-admin-400 bg-admin-50'
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />

                  {formData.logo ? (
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-2">
                        ✓ {formData.logo.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Drag a new file to replace, or click to browse
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Drag & drop your logo here
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                    className="hidden"
                    id="logo-upload"
                  />

                  <Label htmlFor="logo-upload">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() =>
                        document.getElementById('logo-upload')?.click()
                      }
                    >
                      Browse Files
                    </Button>
                  </Label>
                </div>
              </FormField>

              {/* Business Description */}
              <FormField label="Business Description (Optional)">
                <textarea
                  placeholder="Brief description of your property management services..."
                  value={formData.businessDescription}
                  onChange={handleInputChange('businessDescription')}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </FormField>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-6">
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? 'Saving...' : 'Save & Continue'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
