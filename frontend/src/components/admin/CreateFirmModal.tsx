'use client';

import { useState } from 'react';
import { Building2, Mail, Phone, MapPin, FileText } from 'lucide-react';
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
  description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
}

interface FormErrors {
  firm_name?: string;
  contact_email?: string;
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
    description: '',
    contact_email: '',
    contact_phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firm_name.trim()) {
      newErrors.firm_name = 'Firm name is required';
    } else if (formData.firm_name.length < 2) {
      newErrors.firm_name = 'Firm name must be at least 2 characters';
    }

    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Please enter a valid email address';
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
      const response = await apiClient.post('/firms', {
        firm_name: formData.firm_name.trim(),
        description: formData.description.trim() || undefined,
        contact_email: formData.contact_email.trim(),
        contact_phone: formData.contact_phone.trim() || undefined,
        address: formData.address.trim() || undefined,
      });

      if (response.success) {
        // Reset form
        setFormData({
          firm_name: '',
          description: '',
          contact_email: '',
          contact_phone: '',
          address: '',
        });
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
        description: '',
        contact_email: '',
        contact_phone: '',
        address: '',
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Firm"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{errors.general}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Firm Name */}
            <div className="md:col-span-2">
              <FormField label="Firm Name" required error={errors.firm_name}>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={formData.firm_name}
                    onChange={(e) =>
                      handleInputChange('firm_name', e.target.value)
                    }
                    placeholder="Enter firm name"
                    className={cn('pl-9', errors.firm_name && 'border-red-300')}
                    disabled={loading}
                  />
                </div>
              </FormField>
            </div>

            {/* Contact Email */}
            <FormField
              label="Contact Email"
              required
              error={errors.contact_email}
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) =>
                    handleInputChange('contact_email', e.target.value)
                  }
                  placeholder="contact@firm.com"
                  className={cn(
                    'pl-9',
                    errors.contact_email && 'border-red-300'
                  )}
                  disabled={loading}
                />
              </div>
            </FormField>

            {/* Contact Phone */}
            <FormField label="Contact Phone">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) =>
                    handleInputChange('contact_phone', e.target.value)
                  }
                  placeholder="+965 XXXX XXXX"
                  className="pl-9"
                  disabled={loading}
                />
              </div>
            </FormField>

            {/* Address */}
            <div className="md:col-span-2">
              <FormField label="Address">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    placeholder="Enter firm address"
                    rows={3}
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

            {/* Description */}
            <div className="md:col-span-2">
              <FormField label="Description">
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    placeholder="Brief description of the firm (optional)"
                    rows={3}
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
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start space-x-2">
              <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">
                  Multi-Tenant Architecture
                </h4>
                <p className="text-xs text-blue-700 mt-1">
                  This firm will have complete data isolation. Users can be
                  assigned to this firm with specific roles and permissions. All
                  property, tenant, and financial data will be segmented by
                  firm.
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
