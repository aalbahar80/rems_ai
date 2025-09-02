'use client';

import { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  Globe,
  Hash,
  Users,
} from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient, handleApiError } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface CreateFirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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
  logo?: File;
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

// FormField component moved outside to prevent re-creation on each render
const FormField = ({
  label,
  required = false,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

export function CreateFirmModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateFirmModalProps) {
  const [loading, setLoading] = useState(false);
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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

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

    setLoading(true);
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

      const response = await apiClient.post('/firms', payload);

      if (response.success) {
        // Reset form
        setFormData({
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
        setLogoFile(null);
        setLogoPreview(null);
        setErrors({});
        onSuccess();
        onClose();
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
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
      setLogoFile(null);
      setLogoPreview(null);
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Firm"
      size="xl"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Essential Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      disabled={loading}
                    />
                  </div>
                </FormField>
              </div>

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
                      handleInputChange('registration_number', e.target.value)
                    }
                    placeholder="e.g. 123456"
                    className={cn(
                      'pl-9',
                      errors.registration_number && 'border-red-300'
                    )}
                    disabled={loading}
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
                    disabled={loading}
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
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    disabled={loading}
                  />
                </div>
              </FormField>

              <FormField label="Email Address" required error={errors.email}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@yourcompany.com"
                    className={cn('pl-9', errors.email && 'border-red-300')}
                    disabled={loading}
                  />
                </div>
              </FormField>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Business Address</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 pl-6">
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
                    disabled={loading}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="City" required error={errors.address_city}>
                    <Input
                      type="text"
                      placeholder="e.g. Kuwait City"
                      value={formData.address.city}
                      onChange={(e) =>
                        handleInputChange('address.city', e.target.value)
                      }
                      className={cn(errors.address_city && 'border-red-300')}
                      disabled={loading}
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
                      disabled={loading}
                    />
                  </FormField>

                  <FormField label="Country">
                    <Input
                      type="text"
                      value={formData.address.country}
                      onChange={(e) =>
                        handleInputChange('address.country', e.target.value)
                      }
                      disabled={loading}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Description */}
            <FormField label="Business Description (Optional)">
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  value={formData.business_description}
                  onChange={(e) =>
                    handleInputChange('business_description', e.target.value)
                  }
                  placeholder="Brief description of the firm"
                  rows={2}
                  className={cn(
                    'w-full pl-9 pr-3 py-2 border border-input bg-background text-sm',
                    'placeholder:text-muted-foreground focus:outline-none focus:ring-2',
                    'focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed',
                    'disabled:opacity-50 rounded-md resize-none'
                  )}
                  disabled={loading}
                />
              </div>
            </FormField>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start space-x-2">
              <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">
                  Quick Firm Creation
                </h4>
                <p className="text-xs text-blue-700 mt-1">
                  Create your firm with essential details. Additional
                  information like logo, legal business name, tax ID, website,
                  and secondary contacts can be added later via the edit
                  function.
                </p>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="min-w-[120px]">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Creating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Create Firm</span>
              </div>
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
