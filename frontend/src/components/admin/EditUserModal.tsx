'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Phone,
  User,
  Building2,
  Globe,
  Clock,
  Shield,
  Crown,
  Home,
  Wrench,
  Briefcase,
  AlertTriangle,
  Save,
  X,
} from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiClient, handleApiError } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

interface User {
  user_id: number;
  username: string;
  email: string;
  user_type:
    | 'admin'
    | 'accountant'
    | 'owner'
    | 'tenant'
    | 'vendor'
    | 'maintenance_staff';
  phone?: string;
  is_active: boolean;
  email_verified: boolean;
  two_factor_enabled: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  preferred_language: 'en' | 'ar' | 'both';
  timezone: string;
  locked_until?: string;
  login_attempts: number;
  assigned_firms_count: number;
  entity_name?: string;
  related_entity_id?: number;
  related_entity_type?: string;
  firm_assignments?: FirmAssignment[];
  permissions?: Record<string, any>;
  settings?: {
    full_name?: string;
    first_name?: string;
    last_name?: string;
    notification_preferences?: {
      email_notifications: boolean;
      sms_notifications: boolean;
      push_notifications: boolean;
    };
  };
}

interface FirmAssignment {
  firm_id: number;
  firm_name: string;
  role_in_firm: string;
  access_level: string;
  assigned_at: string;
  is_primary_firm: boolean;
  assigned_by?: number;
  assigned_by_name?: string;
}

interface FormData {
  username: string;
  email: string;
  user_type: User['user_type'];
  phone: string;
  preferred_language: 'en' | 'ar' | 'both';
  timezone: string;
  is_active: boolean;
  email_verified: boolean;
  first_name: string;
  last_name: string;
  notification_preferences: {
    email_notifications: boolean;
    sms_notifications: boolean;
    push_notifications: boolean;
  };
}

interface FormErrors {
  username?: string;
  email?: string;
  phone?: string;
  user_type?: string;
  general?: string;
}

// FormField component
const FormField = ({
  label,
  required = false,
  children,
  error,
  description,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  description?: string;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground flex items-center space-x-1">
      <span>{label}</span>
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {description && (
      <p className="text-xs text-muted-foreground">{description}</p>
    )}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

export function EditUserModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: EditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    user_type: 'tenant',
    phone: '',
    preferred_language: 'en',
    timezone: 'Asia/Kuwait',
    is_active: true,
    email_verified: false,
    first_name: '',
    last_name: '',
    notification_preferences: {
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
    },
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        user_type: user.user_type || 'tenant',
        phone: user.phone || '',
        preferred_language: user.preferred_language || 'en',
        timezone: user.timezone || 'Asia/Kuwait',
        is_active: user.is_active ?? true,
        email_verified: user.email_verified ?? false,
        first_name: user.settings?.first_name || '',
        last_name: user.settings?.last_name || '',
        notification_preferences: {
          email_notifications:
            user.settings?.notification_preferences?.email_notifications ??
            true,
          sms_notifications:
            user.settings?.notification_preferences?.sms_notifications ?? false,
          push_notifications:
            user.settings?.notification_preferences?.push_notifications ?? true,
        },
      });
    }
  }, [user]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.user_type) {
      newErrors.user_type = 'User type is required';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // Prepare the update payload
      const updateData = {
        username: formData.username,
        email: formData.email,
        user_type: formData.user_type,
        phone: formData.phone || null,
        preferred_language: formData.preferred_language,
        timezone: formData.timezone,
        is_active: formData.is_active,
        email_verified: formData.email_verified,
        settings: {
          first_name: formData.first_name || null,
          last_name: formData.last_name || null,
          full_name:
            formData.first_name || formData.last_name
              ? `${formData.first_name} ${formData.last_name}`.trim()
              : null,
          notification_preferences: formData.notification_preferences,
        },
      };

      const response = await apiClient.put<{
        success: boolean;
        data: { user: User };
        message: string;
      }>(`/users/${user.user_id}`, updateData);

      if (response.success) {
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      const errorData = handleApiError(error);
      if (errorData.field) {
        setErrors({ [errorData.field]: errorData.message });
      } else {
        setErrors({ general: errorData.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeIcon = (userType: User['user_type']) => {
    switch (userType) {
      case 'admin':
        return Crown;
      case 'accountant':
        return Shield;
      case 'owner':
        return Building2;
      case 'tenant':
        return Home;
      case 'vendor':
        return Briefcase;
      case 'maintenance_staff':
        return Wrench;
      default:
        return Users;
    }
  };

  const getUserTypeColor = (userType: User['user_type']) => {
    switch (userType) {
      case 'admin':
        return 'text-purple-600 border-purple-200 bg-purple-50';
      case 'accountant':
        return 'text-blue-600 border-blue-200 bg-blue-50';
      case 'owner':
        return 'text-green-600 border-green-200 bg-green-50';
      case 'tenant':
        return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'vendor':
        return 'text-indigo-600 border-indigo-200 bg-indigo-50';
      case 'maintenance_staff':
        return 'text-amber-600 border-amber-200 bg-amber-50';
      default:
        return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  const getUserDisplayName = (user: User) => {
    if (user.settings?.full_name) {
      return user.settings.full_name;
    }
    if (user.settings?.first_name && user.settings?.last_name) {
      return `${user.settings.first_name} ${user.settings.last_name}`;
    }
    if (user.username && user.username !== user.email) {
      return user.username
        .replace(/\./g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return user.email
      .split('@')[0]
      .replace(/\./g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (!user) return null;

  const TypeIcon = getUserTypeIcon(formData.user_type);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit User - ${getUserDisplayName(user)}`}
      size="xl"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-6">
            {/* Current User Header */}
            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TypeIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      'capitalize',
                      getUserTypeColor(formData.user_type)
                    )}
                  >
                    <TypeIcon className="h-3 w-3 mr-1" />
                    {formData.user_type.replace('_', ' ')}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      formData.is_active
                        ? 'text-green-600 border-green-200'
                        : 'text-gray-600 border-gray-200'
                    }
                  >
                    {formData.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  {formData.email_verified && (
                    <Badge
                      variant="outline"
                      className="text-blue-600 border-blue-200"
                    >
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  User ID: {user.user_id} • Created:{' '}
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground border-b pb-2">
                  Basic Information
                </h3>

                <FormField label="Username" required error={errors.username}>
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Enter username"
                  />
                </FormField>

                <FormField label="Email Address" required error={errors.email}>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter email address"
                  />
                </FormField>

                <FormField label="Phone Number" error={errors.phone}>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                </FormField>

                <FormField
                  label="User Type"
                  required
                  error={errors.user_type}
                  description="Determines portal access and permissions"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'admin', label: 'Admin', icon: Crown },
                      {
                        value: 'accountant',
                        label: 'Accountant',
                        icon: Shield,
                      },
                      { value: 'owner', label: 'Owner', icon: Building2 },
                      { value: 'tenant', label: 'Tenant', icon: Home },
                      { value: 'vendor', label: 'Vendor', icon: Briefcase },
                      {
                        value: 'maintenance_staff',
                        label: 'Staff',
                        icon: Wrench,
                      },
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              user_type: type.value as User['user_type'],
                            })
                          }
                          className={cn(
                            'flex items-center space-x-2 p-2 border rounded-md text-sm transition-colors',
                            formData.user_type === type.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border hover:border-muted-foreground'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </FormField>
              </div>

              {/* Personal Details & Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground border-b pb-2">
                  Personal Details
                </h3>

                <FormField label="First Name">
                  <Input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    placeholder="Enter first name"
                  />
                </FormField>

                <FormField label="Last Name">
                  <Input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    placeholder="Enter last name"
                  />
                </FormField>

                <FormField
                  label="Preferred Language"
                  description="Language for system interface and communications"
                >
                  <div className="flex space-x-2">
                    {[
                      { value: 'en', label: 'English' },
                      { value: 'ar', label: 'Arabic' },
                      { value: 'both', label: 'Both' },
                    ].map((lang) => (
                      <button
                        key={lang.value}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            preferred_language: lang.value as
                              | 'en'
                              | 'ar'
                              | 'both',
                          })
                        }
                        className={cn(
                          'flex-1 px-3 py-2 border rounded-md text-sm transition-colors',
                          formData.preferred_language === lang.value
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-muted-foreground'
                        )}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </FormField>

                <FormField label="Timezone">
                  <select
                    value={formData.timezone}
                    onChange={(e) =>
                      setFormData({ ...formData, timezone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="Asia/Kuwait">Kuwait (GMT+3)</option>
                    <option value="Asia/Riyadh">Saudi Arabia (GMT+3)</option>
                    <option value="Asia/Dubai">UAE (GMT+4)</option>
                    <option value="Asia/Qatar">Qatar (GMT+3)</option>
                    <option value="Asia/Bahrain">Bahrain (GMT+3)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                  </select>
                </FormField>
              </div>
            </div>

            {/* Account Status & Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground border-b pb-2">
                Account Status & Notifications
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <FormField label="Account Status">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, is_active: true })
                        }
                        className={cn(
                          'flex-1 px-3 py-2 border rounded-md text-sm transition-colors',
                          formData.is_active
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-border hover:border-muted-foreground'
                        )}
                      >
                        Active
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, is_active: false })
                        }
                        className={cn(
                          'flex-1 px-3 py-2 border rounded-md text-sm transition-colors',
                          !formData.is_active
                            ? 'border-gray-500 bg-gray-50 text-gray-700'
                            : 'border-border hover:border-muted-foreground'
                        )}
                      >
                        Inactive
                      </button>
                    </div>
                  </FormField>

                  <FormField label="Email Verification">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, email_verified: true })
                        }
                        className={cn(
                          'flex-1 px-3 py-2 border rounded-md text-sm transition-colors',
                          formData.email_verified
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-border hover:border-muted-foreground'
                        )}
                      >
                        Verified
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, email_verified: false })
                        }
                        className={cn(
                          'flex-1 px-3 py-2 border rounded-md text-sm transition-colors',
                          !formData.email_verified
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-border hover:border-muted-foreground'
                        )}
                      >
                        Unverified
                      </button>
                    </div>
                  </FormField>
                </div>

                <div className="space-y-3">
                  <FormField label="Notification Preferences">
                    <div className="space-y-2">
                      {[
                        {
                          key: 'email_notifications',
                          label: 'Email Notifications',
                        },
                        {
                          key: 'sms_notifications',
                          label: 'SMS Notifications',
                        },
                        {
                          key: 'push_notifications',
                          label: 'Push Notifications',
                        },
                      ].map((pref) => (
                        <label
                          key={pref.key}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={
                              formData.notification_preferences[
                                pref.key as keyof typeof formData.notification_preferences
                              ]
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                notification_preferences: {
                                  ...formData.notification_preferences,
                                  [pref.key]: e.target.checked,
                                },
                              })
                            }
                            className="rounded border-border"
                          />
                          <span>{pref.label}</span>
                        </label>
                      ))}
                    </div>
                  </FormField>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update User
              </>
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
