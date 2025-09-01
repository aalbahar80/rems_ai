'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
} from 'lucide-react';
import { AdminLayout } from '@/components/shared/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, FormField } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FirmProfile {
  companyName: string;
  businessRegistration: string;
  taxId: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  logo?: File;
}

export default function FirmCreationPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FirmProfile>({
    companyName: '',
    businessRegistration: '',
    taxId: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Kuwait',
    },
    contact: {
      phone: '',
      email: '',
      website: '',
    },
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FirmProfile] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Firm profile:', formData);
      console.log('Logo file:', logoFile);

      router.push('/admin/onboarding/expenses');
    } catch (error) {
      console.error('Failed to save firm profile:', error);
      alert('Failed to save firm profile. Please try again.');
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
            <div className="bg-admin-500 h-2 rounded-full w-[16.66%]"></div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Company Information</span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Logo */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Company Logo (Optional)</p>
                <div className="flex items-center space-x-4">
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-16 h-16 object-contain border border-gray-200 rounded-lg p-2"
                    />
                  )}
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById('logo-upload')?.click()
                        }
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {logoFile ? 'Change Logo' : 'Upload Logo'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-4">
                <FormField label="Company Name" required>
                  <Input
                    type="text"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange('companyName', e.target.value)
                    }
                    required
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Business Registration Number" required>
                    <Input
                      type="text"
                      placeholder="e.g. 123456"
                      value={formData.businessRegistration}
                      onChange={(e) =>
                        handleInputChange(
                          'businessRegistration',
                          e.target.value
                        )
                      }
                      required
                    />
                  </FormField>

                  <FormField label="Tax ID / VAT Number">
                    <Input
                      type="text"
                      placeholder="e.g. 300123456701003"
                      value={formData.taxId}
                      onChange={(e) =>
                        handleInputChange('taxId', e.target.value)
                      }
                    />
                  </FormField>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Business Address</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 pl-6">
                  <FormField label="Street Address" required>
                    <Input
                      type="text"
                      placeholder="Building number, street name"
                      value={formData.address.street}
                      onChange={(e) =>
                        handleInputChange('address.street', e.target.value)
                      }
                      required
                    />
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="City" required>
                      <Input
                        type="text"
                        placeholder="e.g. Kuwait City"
                        value={formData.address.city}
                        onChange={(e) =>
                          handleInputChange('address.city', e.target.value)
                        }
                        required
                      />
                    </FormField>

                    <FormField label="State/Governorate" required>
                      <Input
                        type="text"
                        placeholder="e.g. Al Asimah"
                        value={formData.address.state}
                        onChange={(e) =>
                          handleInputChange('address.state', e.target.value)
                        }
                        required
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Postal Code">
                      <Input
                        type="text"
                        placeholder="e.g. 13001"
                        value={formData.address.postalCode}
                        onChange={(e) =>
                          handleInputChange(
                            'address.postalCode',
                            e.target.value
                          )
                        }
                      />
                    </FormField>

                    <FormField label="Country" required>
                      <Input
                        type="text"
                        value={formData.address.country}
                        onChange={(e) =>
                          handleInputChange('address.country', e.target.value)
                        }
                        required
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Contact Information</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 pl-6">
                  <FormField label="Phone Number" required>
                    <Input
                      type="tel"
                      placeholder="+965 XXXX XXXX"
                      value={formData.contact.phone}
                      onChange={(e) =>
                        handleInputChange('contact.phone', e.target.value)
                      }
                      required
                    />
                  </FormField>

                  <FormField label="Email Address" required>
                    <Input
                      type="email"
                      placeholder="contact@yourcompany.com"
                      value={formData.contact.email}
                      onChange={(e) =>
                        handleInputChange('contact.email', e.target.value)
                      }
                      required
                    />
                  </FormField>

                  <FormField label="Website (Optional)">
                    <Input
                      type="url"
                      placeholder="https://www.yourcompany.com"
                      value={formData.contact.website}
                      onChange={(e) =>
                        handleInputChange('contact.website', e.target.value)
                      }
                    />
                  </FormField>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-6">
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={
                    isSubmitting ||
                    !formData.companyName ||
                    !formData.businessRegistration
                  }
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
