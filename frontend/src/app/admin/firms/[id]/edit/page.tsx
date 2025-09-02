'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Hash,
  Users,
  Save,
  X,
} from 'lucide-react';
import { AdminLayout } from '@/components/shared/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, FormField } from '@/components/ui/input';
import { apiClient, handleApiError } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface FirmData {
  firm_id: number;
  firm_name: string;
  legal_business_name?: string;
  registration_number?: string;
  tax_number?: string;
  primary_phone?: string;
  secondary_phone?: string;
  email: string;
  website_url?: string;
  business_address?: string;
  business_description?: string;
  industry_type?: string;
  number_of_employees?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

interface FormData {
  firm_name: string;
  legal_business_name: string;
  registration_number: string;
  tax_number: string;
  primary_phone: string;
  secondary_phone: string;
  email: string;
  website_url: string;
  address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  business_description: string;
  industry_type: string;
  number_of_employees: string;
}

interface FormErrors {
  firm_name?: string;
  email?: string;
  registration_number?: string;
  primary_phone?: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  general?: string;
}

export default function EditFirmPage() {
  const router = useRouter();
  const params = useParams();
  const firmId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firm, setFirm] = useState<FirmData | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    firm_name: '',
    legal_business_name: '',
    registration_number: '',
    tax_number: '',
    primary_phone: '',
    secondary_phone: '',
    email: '',
    website_url: '',
    address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Kuwait',
    },
    business_description: '',
    industry_type: 'real_estate',
    number_of_employees: '',
  });

  useEffect(() => {
    if (firmId) {
      loadFirm();
    }
  }, [firmId]);

  const loadFirm = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{
        success: boolean;
        data: FirmData;
      }>(`/firms/${firmId}`);

      if (response.success) {
        const firmData = response.data;
        setFirm(firmData);

        // Parse address if it exists
        const addressParts = firmData.business_address?.split(', ') || [];
        const address = {
          street: addressParts[0] || '',
          city: addressParts[1] || '',
          state: addressParts[2] || '',
          postal_code: addressParts[3] || '',
          country: addressParts[4] || 'Kuwait',
        };

        setFormData({
          firm_name: firmData.firm_name || '',
          legal_business_name: firmData.legal_business_name || '',
          registration_number: firmData.registration_number || '',
          tax_number: firmData.tax_number || '',
          primary_phone: firmData.primary_phone || '',
          secondary_phone: firmData.secondary_phone || '',
          email: firmData.email || '',
          website_url: firmData.website_url || '',
          address,
          business_description: firmData.business_description || '',
          industry_type: firmData.industry_type || 'real_estate',
          number_of_employees: firmData.number_of_employees || '',
        });

        if (firmData.logo_url) {
          setLogoPreview(firmData.logo_url);
        }
      }
    } catch (error) {
      console.error('Failed to load firm:', error);
      router.push('/admin/firms');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    // Clear error when user starts typing
    const errorField = field.replace('.', '_') as keyof FormErrors;
    if (errors[errorField]) {
      setErrors((prev) => ({ ...prev, [errorField]: undefined }));
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firm_name.trim()) {
      newErrors.firm_name = 'Firm name is required';
    } else if (formData.firm_name.length < 2) {
      newErrors.firm_name = 'Firm name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.registration_number.trim()) {
      newErrors.registration_number =
        'Business registration number is required';
    }

    if (!formData.primary_phone.trim()) {
      newErrors.primary_phone = 'Primary phone number is required';
    }

    if (!formData.address.street.trim()) {
      newErrors.address_street = 'Street address is required';
    }

    if (!formData.address.city.trim()) {
      newErrors.address_city = 'City is required';
    }

    if (!formData.address.state.trim()) {
      newErrors.address_state = 'State/Governorate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      // Combine address fields
      const fullAddress = [
        formData.address.street,
        formData.address.city,
        formData.address.state,
        formData.address.postal_code,
        formData.address.country,
      ]
        .filter(Boolean)
        .join(', ');

      // Create payload matching backend expectations
      const payload = {
        firm_name: formData.firm_name.trim(),
        description: formData.business_description.trim() || '',
        contact_email: formData.email.trim(),
        contact_phone: formData.primary_phone.trim(),
        address: fullAddress,
        settings: {
          legal_business_name:
            formData.legal_business_name.trim() || formData.firm_name.trim(),
          registration_number: formData.registration_number.trim(),
          tax_number: formData.tax_number.trim() || '',
          secondary_phone: formData.secondary_phone.trim() || '',
          website_url: formData.website_url.trim() || '',
          industry_type: formData.industry_type,
          number_of_employees: formData.number_of_employees || '0',
        },
      };

      const response = await apiClient.put(`/firms/${firmId}`, payload);

      if (response.success) {
        router.push('/admin/firms');
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      setErrors({ general: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/firms');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading firm details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!firm) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <Building2 className="h-16 w-16 text-muted-foreground/50 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            Firm not found
          </h3>
          <p className="mt-2 text-muted-foreground">
            The requested firm could not be found.
          </p>
          <Button className="mt-4" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Firms
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Firms
          </Button>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">Edit Firm</h1>
            <p className="text-muted-foreground">
              Update {firm.firm_name} details and settings
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-sm text-red-700">{errors.general}</p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {/* Company Logo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Company Logo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-20 h-20 object-contain border border-gray-200 rounded-lg p-2"
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
                        disabled={saving}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById('logo-upload')?.click()
                        }
                        disabled={saving}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {logoFile ? 'Change Logo' : 'Upload Logo'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPG up to 2MB. Optimal size: 400x400px
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormField
                      label="Company Name"
                      required
                      error={errors.firm_name}
                    >
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          value={formData.firm_name}
                          onChange={(e) =>
                            handleInputChange('firm_name', e.target.value)
                          }
                          placeholder="Enter company name"
                          className={cn(
                            'pl-9',
                            errors.firm_name && 'border-red-300'
                          )}
                          disabled={saving}
                        />
                      </div>
                    </FormField>
                  </div>

                  <FormField label="Legal Business Name">
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={formData.legal_business_name}
                        onChange={(e) =>
                          handleInputChange(
                            'legal_business_name',
                            e.target.value
                          )
                        }
                        placeholder="Legal business name (optional)"
                        className="pl-9"
                        disabled={saving}
                      />
                    </div>
                  </FormField>

                  <FormField
                    label="Registration Number"
                    required
                    error={errors.registration_number}
                  >
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={formData.registration_number}
                        onChange={(e) =>
                          handleInputChange(
                            'registration_number',
                            e.target.value
                          )
                        }
                        placeholder="e.g. 123456"
                        className={cn(
                          'pl-9',
                          errors.registration_number && 'border-red-300'
                        )}
                        disabled={saving}
                      />
                    </div>
                  </FormField>

                  <FormField label="Tax ID / VAT Number">
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={formData.tax_number}
                        onChange={(e) =>
                          handleInputChange('tax_number', e.target.value)
                        }
                        placeholder="e.g. 300123456701003"
                        className="pl-9"
                        disabled={saving}
                      />
                    </div>
                  </FormField>

                  <FormField label="Industry Type">
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select
                        value={formData.industry_type}
                        onChange={(e) =>
                          handleInputChange('industry_type', e.target.value)
                        }
                        className={cn(
                          'w-full pl-9 pr-3 py-2 border border-input bg-background text-sm',
                          'placeholder:text-muted-foreground focus:outline-none focus:ring-2',
                          'focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed',
                          'disabled:opacity-50 rounded-md'
                        )}
                        disabled={saving}
                      >
                        <option value="real_estate">Real Estate</option>
                        <option value="property_management">
                          Property Management
                        </option>
                        <option value="investment">Investment</option>
                        <option value="construction">Construction</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </FormField>

                  <FormField label="Number of Employees">
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={formData.number_of_employees}
                        onChange={(e) =>
                          handleInputChange(
                            'number_of_employees',
                            e.target.value
                          )
                        }
                        placeholder="Optional"
                        className="pl-9"
                        min="1"
                        disabled={saving}
                      />
                    </div>
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Primary Phone"
                    required
                    error={errors.primary_phone}
                  >
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        value={formData.primary_phone}
                        onChange={(e) =>
                          handleInputChange('primary_phone', e.target.value)
                        }
                        placeholder="+965 XXXX XXXX"
                        className={cn(
                          'pl-9',
                          errors.primary_phone && 'border-red-300'
                        )}
                        disabled={saving}
                      />
                    </div>
                  </FormField>

                  <FormField label="Secondary Phone">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        value={formData.secondary_phone}
                        onChange={(e) =>
                          handleInputChange('secondary_phone', e.target.value)
                        }
                        placeholder="+965 XXXX XXXX (optional)"
                        className="pl-9"
                        disabled={saving}
                      />
                    </div>
                  </FormField>

                  <FormField
                    label="Email Address"
                    required
                    error={errors.email}
                  >
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                        placeholder="contact@yourcompany.com"
                        className={cn('pl-9', errors.email && 'border-red-300')}
                        disabled={saving}
                      />
                    </div>
                  </FormField>

                  <FormField label="Website">
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="url"
                        value={formData.website_url}
                        onChange={(e) =>
                          handleInputChange('website_url', e.target.value)
                        }
                        placeholder="https://www.yourcompany.com"
                        className="pl-9"
                        disabled={saving}
                      />
                    </div>
                  </FormField>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Business Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    label="Street Address"
                    required
                    error={errors.address_street}
                  >
                    <Input
                      type="text"
                      placeholder="Building number, street name"
                      value={formData.address.street}
                      onChange={(e) =>
                        handleInputChange('address.street', e.target.value)
                      }
                      className={cn(errors.address_street && 'border-red-300')}
                      disabled={saving}
                    />
                  </FormField>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      label="City"
                      required
                      error={errors.address_city}
                    >
                      <Input
                        type="text"
                        placeholder="e.g. Kuwait City"
                        value={formData.address.city}
                        onChange={(e) =>
                          handleInputChange('address.city', e.target.value)
                        }
                        className={cn(errors.address_city && 'border-red-300')}
                        disabled={saving}
                      />
                    </FormField>

                    <FormField
                      label="State/Governorate"
                      required
                      error={errors.address_state}
                    >
                      <Input
                        type="text"
                        placeholder="e.g. Al Asimah"
                        value={formData.address.state}
                        onChange={(e) =>
                          handleInputChange('address.state', e.target.value)
                        }
                        className={cn(errors.address_state && 'border-red-300')}
                        disabled={saving}
                      />
                    </FormField>

                    <FormField label="Postal Code">
                      <Input
                        type="text"
                        placeholder="e.g. 13001"
                        value={formData.address.postal_code}
                        onChange={(e) =>
                          handleInputChange(
                            'address.postal_code',
                            e.target.value
                          )
                        }
                        disabled={saving}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Country">
                      <Input
                        type="text"
                        value={formData.address.country}
                        onChange={(e) =>
                          handleInputChange('address.country', e.target.value)
                        }
                        disabled={saving}
                      />
                    </FormField>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Business Description</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField label="Description (Optional)">
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <textarea
                      value={formData.business_description}
                      onChange={(e) =>
                        handleInputChange(
                          'business_description',
                          e.target.value
                        )
                      }
                      placeholder="Brief description of the firm and its activities"
                      rows={4}
                      className={cn(
                        'w-full pl-9 pr-3 py-2 border border-input bg-background text-sm',
                        'placeholder:text-muted-foreground focus:outline-none focus:ring-2',
                        'focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed',
                        'disabled:opacity-50 rounded-md resize-none'
                      )}
                      disabled={saving}
                    />
                  </div>
                </FormField>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="min-w-[140px]">
              {saving ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
