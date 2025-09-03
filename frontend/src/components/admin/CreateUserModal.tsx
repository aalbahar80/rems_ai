'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Phone,
  Lock,
  User,
  Building2,
  Trash2,
  Globe,
  Clock,
  Shield,
  Crown,
  Home,
  Wrench,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient, handleApiError } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  user_type:
    | 'admin'
    | 'accountant'
    | 'owner'
    | 'tenant'
    | 'vendor'
    | 'maintenance_staff';
  preferred_language: 'en' | 'ar' | 'both';
  timezone: string;
  related_entity_id?: number;
  related_entity_type?: string;
  firm_assignments: FirmAssignment[];
  permissions: Record<string, any>;
  settings: {
    notification_preferences: {
      email_notifications: boolean;
      sms_notifications: boolean;
      push_notifications: boolean;
    };
    two_factor_enabled: boolean;
  };
}

interface FirmAssignment {
  firm_id: number;
  firm_name?: string;
  role_in_firm: string;
  access_level: string;
  is_primary_firm: boolean;
}

interface Firm {
  firm_id: number;
  firm_name: string;
  is_active: boolean;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  phone?: string;
  user_type?: string;
  general?: string;
}

interface CreationResult {
  user_id: number;
  username: string;
  email: string;
  user_type: string;
  generated_password: string;
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
    <label className="text-sm font-medium text-foreground">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {description && (
      <p className="text-xs text-muted-foreground">{description}</p>
    )}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

export function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [availableFirms, setAvailableFirms] = useState<Firm[]>([]);
  const [creationResult, setCreationResult] = useState<CreationResult | null>(
    null
  );
  const [showResult, setShowResult] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    user_type: 'accountant',
    preferred_language: 'en',
    timezone: 'Asia/Kuwait',
    firm_assignments: [],
    permissions: {},
    settings: {
      notification_preferences: {
        email_notifications: true,
        sms_notifications: false,
        push_notifications: true,
      },
      two_factor_enabled: false,
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Load available firms when modal opens
  useEffect(() => {
    if (isOpen) {
      loadFirms();
      generateSecurePassword();
      setDefaultPermissions();
    }
  }, [isOpen]);

  // Update default permissions when user type changes
  useEffect(() => {
    setDefaultPermissions();
  }, [formData.user_type]);

  const loadFirms = async () => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { firms: Firm[] };
      }>('/firms', { status: 'active', limit: '100' });

      if (response.success) {
        setAvailableFirms(response.data.firms);
      }
    } catch (error) {
      console.error('Failed to load firms:', error);
    }
  };

  const generateSecurePassword = () => {
    const length = 12;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData((prev) => ({ ...prev, password }));
  };

  const setDefaultPermissions = () => {
    let defaultPermissions: Record<string, any> = {};

    switch (formData.user_type) {
      case 'admin':
        defaultPermissions = {
          users: { read: true, write: true, delete: true },
          firms: { read: true, write: true, delete: true },
          properties: { read: true, write: true, delete: true },
          financial: { read: true, write: true, delete: true },
          reports: { read: true, write: true, delete: false },
          settings: { read: true, write: true, delete: false },
        };
        break;
      case 'accountant':
        defaultPermissions = {
          properties: { read: true, write: true, delete: false },
          tenants: { read: true, write: true, delete: false },
          financial: { read: true, write: true, delete: false },
          maintenance: { read: true, write: true, delete: false },
          reports: { read: true, write: false, delete: false },
          contracts: { read: true, write: true, delete: false },
        };
        break;
      case 'owner':
        defaultPermissions = {
          properties: { read: true, write: false, delete: false },
          financial: { read: true, write: false, delete: false },
          maintenance: { read: true, write: false, delete: false },
          reports: { read: true, write: false, delete: false },
          approval: { read: true, write: true, delete: false },
        };
        break;
      case 'tenant':
        defaultPermissions = {
          lease: { read: true, write: false, delete: false },
          payments: { read: true, write: true, delete: false },
          maintenance: { read: true, write: true, delete: false },
          messages: { read: true, write: true, delete: false },
        };
        break;
      case 'vendor':
        defaultPermissions = {
          maintenance: { read: true, write: true, delete: false },
          invoicing: { read: true, write: true, delete: false },
          schedule: { read: true, write: true, delete: false },
        };
        break;
      case 'maintenance_staff':
        defaultPermissions = {
          maintenance: { read: true, write: true, delete: false },
          schedule: { read: true, write: false, delete: false },
        };
        break;
    }

    setFormData((prev) => ({ ...prev, permissions: defaultPermissions }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddFirmAssignment = (firmId: number) => {
    const firm = availableFirms.find((f) => f.firm_id === firmId);
    if (firm && !formData.firm_assignments.find((a) => a.firm_id === firmId)) {
      const newAssignment: FirmAssignment = {
        firm_id: firmId,
        firm_name: firm.firm_name,
        role_in_firm: getRoleForUserType(formData.user_type),
        access_level: 'standard',
        is_primary_firm: formData.firm_assignments.length === 0,
      };
      setFormData((prev) => ({
        ...prev,
        firm_assignments: [...prev.firm_assignments, newAssignment],
      }));
    }
  };

  const handleRemoveFirmAssignment = (firmId: number) => {
    const updatedAssignments = formData.firm_assignments.filter(
      (a) => a.firm_id !== firmId
    );

    // If removing primary firm, make first remaining assignment primary
    if (updatedAssignments.length > 0) {
      const wasPrimary = formData.firm_assignments.find(
        (a) => a.firm_id === firmId
      )?.is_primary_firm;

      if (wasPrimary) {
        updatedAssignments[0].is_primary_firm = true;
      }
    }

    setFormData((prev) => ({
      ...prev,
      firm_assignments: updatedAssignments,
    }));
  };

  const handleUpdateAssignment = (
    firmId: number,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      firm_assignments: prev.firm_assignments.map((a) => {
        if (a.firm_id === firmId) {
          if (field === 'is_primary_firm' && value) {
            // Only one assignment can be primary
            return prev.firm_assignments.map((assignment) => ({
              ...assignment,
              is_primary_firm: assignment.firm_id === firmId,
            }));
          }
          return { ...a, [field]: value };
        }
        return a;
      }),
    }));
  };

  const getRoleForUserType = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'admin';
      case 'accountant':
        return 'accountant';
      case 'owner':
        return 'owner';
      case 'tenant':
        return 'tenant';
      case 'vendor':
        return 'vendor';
      case 'maintenance_staff':
        return 'staff';
      default:
        return 'viewer';
    }
  };

  const getUserTypeIcon = (userType: string) => {
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (formData.first_name.length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (formData.last_name.length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (
      formData.phone.trim() &&
      !/^[\+]?[1-9][\d]{6,14}$/.test(formData.phone.replace(/\s/g, ''))
    ) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.user_type) {
      newErrors.user_type = 'User type is required';
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
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        user_type: formData.user_type,
        preferred_language: formData.preferred_language,
        timezone: formData.timezone,
        related_entity_id: formData.related_entity_id,
        related_entity_type: formData.related_entity_type,
        firm_assignments:
          formData.firm_assignments.length > 0
            ? formData.firm_assignments
            : undefined,
        permissions: formData.permissions,
        settings: formData.settings,
      };

      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: CreationResult;
      }>('/users', payload);

      if (response.success) {
        setCreationResult(response.data);
        setShowResult(true);
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
      resetForm();
      setShowResult(false);
      setCreationResult(null);
      onClose();
    }
  };

  const handleFinish = () => {
    resetForm();
    setShowResult(false);
    setCreationResult(null);
    onSuccess();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone: '',
      user_type: 'accountant',
      preferred_language: 'en',
      timezone: 'Asia/Kuwait',
      firm_assignments: [],
      permissions: {},
      settings: {
        notification_preferences: {
          email_notifications: true,
          sms_notifications: false,
          push_notifications: true,
        },
        two_factor_enabled: false,
      },
    });
    setErrors({});
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (showResult && creationResult) {
    const TypeIcon = getUserTypeIcon(creationResult.user_type);

    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="User Created Successfully"
        size="lg"
      >
        <ModalBody>
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <TypeIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">
                {creationResult.user_type.charAt(0).toUpperCase() +
                  creationResult.user_type.slice(1).replace('_', ' ')}{' '}
                Account Created
              </h3>
              <p className="mt-2 text-muted-foreground">
                The new user account has been successfully created. Please share
                these credentials securely.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-3">
                Account Details
              </h4>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Username:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-blue-100 px-2 py-1 rounded text-blue-800 text-sm">
                      {creationResult.username}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(creationResult.username)}
                      className="h-6 w-6 p-0"
                    >
                      📋
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">Email:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-blue-100 px-2 py-1 rounded text-blue-800 text-sm">
                      {creationResult.email}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(creationResult.email)}
                      className="h-6 w-6 p-0"
                    >
                      📋
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">User Type:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-blue-100 px-2 py-1 rounded text-blue-800 text-sm capitalize">
                      {creationResult.user_type.replace('_', ' ')}
                    </code>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">
                    Temporary Password:
                  </span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-blue-100 px-2 py-1 rounded text-blue-800 text-sm">
                      {creationResult.generated_password}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(creationResult.generated_password)
                      }
                      className="h-6 w-6 p-0"
                    >
                      📋
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-start space-x-2">
                <Lock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">
                    Security Notice
                  </h4>
                  <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                    <li>• Share these credentials through a secure channel</li>
                    <li>
                      • The user should change their password on first login
                    </li>
                    <li>
                      • Consider enabling two-factor authentication for enhanced
                      security
                    </li>
                    <li>• This password will not be shown again</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            onClick={handleFinish}
            className="min-w-[120px]"
          >
            <Users className="h-4 w-4 mr-2" />
            Done
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New User"
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
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Personal Information</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  required
                  error={errors.first_name}
                >
                  <Input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      handleInputChange('first_name', e.target.value)
                    }
                    placeholder="Enter first name"
                    className={cn(errors.first_name && 'border-red-300')}
                    disabled={loading}
                  />
                </FormField>

                <FormField label="Last Name" required error={errors.last_name}>
                  <Input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      handleInputChange('last_name', e.target.value)
                    }
                    placeholder="Enter last name"
                    className={cn(errors.last_name && 'border-red-300')}
                    disabled={loading}
                  />
                </FormField>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Account Information</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Email Address" required error={errors.email}>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      placeholder="user@company.com"
                      className={cn('pl-9', errors.email && 'border-red-300')}
                      disabled={loading}
                    />
                  </div>
                </FormField>

                <FormField label="Phone Number" error={errors.phone}>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      placeholder="+965 XXXX XXXX"
                      className={cn('pl-9', errors.phone && 'border-red-300')}
                      disabled={loading}
                    />
                  </div>
                </FormField>
              </div>

              <FormField
                label="User Type"
                required
                error={errors.user_type}
                description="Determines the user's role and default permissions"
              >
                <select
                  value={formData.user_type}
                  onChange={(e) =>
                    handleInputChange(
                      'user_type',
                      e.target.value as FormData['user_type']
                    )
                  }
                  className={cn(
                    'w-full px-3 py-2 border border-input bg-background text-sm',
                    'placeholder:text-muted-foreground focus:outline-none focus:ring-2',
                    'focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed',
                    'disabled:opacity-50 rounded-md',
                    errors.user_type && 'border-red-300'
                  )}
                  disabled={loading}
                >
                  <option value="accountant">
                    Accountant - Property Operations
                  </option>
                  <option value="admin">Admin - System Administration</option>
                  <option value="owner">Owner - Property Portfolio</option>
                  <option value="tenant">Tenant - Rental Management</option>
                  <option value="vendor">Vendor - Service Provider</option>
                  <option value="maintenance_staff">
                    Maintenance Staff - Field Operations
                  </option>
                </select>
              </FormField>

              <FormField
                label="Temporary Password"
                required
                error={errors.password}
              >
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange('password', e.target.value)
                      }
                      placeholder="Auto-generated secure password"
                      className={cn(
                        'pl-9',
                        errors.password && 'border-red-300'
                      )}
                      disabled={loading}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSecurePassword}
                    disabled={loading}
                  >
                    Generate New
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  A secure temporary password that the user must change on first
                  login
                </p>
              </FormField>
            </div>

            {/* Localization Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Localization & Preferences</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Preferred Language">
                  <select
                    value={formData.preferred_language}
                    onChange={(e) =>
                      handleInputChange('preferred_language', e.target.value)
                    }
                    className={cn(
                      'w-full px-3 py-2 border border-input bg-background text-sm',
                      'placeholder:text-muted-foreground focus:outline-none focus:ring-2',
                      'focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed',
                      'disabled:opacity-50 rounded-md'
                    )}
                    disabled={loading}
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                    <option value="both">Both (English & Arabic)</option>
                  </select>
                </FormField>

                <FormField label="Timezone">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                      value={formData.timezone}
                      onChange={(e) =>
                        handleInputChange('timezone', e.target.value)
                      }
                      className={cn(
                        'w-full pl-9 pr-3 py-2 border border-input bg-background text-sm',
                        'placeholder:text-muted-foreground focus:outline-none focus:ring-2',
                        'focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed',
                        'disabled:opacity-50 rounded-md'
                      )}
                      disabled={loading}
                    >
                      <option value="Asia/Kuwait">Kuwait (GMT+3)</option>
                      <option value="Asia/Dubai">UAE (GMT+4)</option>
                      <option value="Asia/Riyadh">Saudi Arabia (GMT+3)</option>
                      <option value="Asia/Qatar">Qatar (GMT+3)</option>
                      <option value="Asia/Bahrain">Bahrain (GMT+3)</option>
                    </select>
                  </div>
                </FormField>
              </div>
            </div>

            {/* Security Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Security & Notifications</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Notification Preferences
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={
                          formData.settings.notification_preferences
                            .email_notifications
                        }
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              notification_preferences: {
                                ...prev.settings.notification_preferences,
                                email_notifications: e.target.checked,
                              },
                            },
                          }))
                        }
                        className="rounded border-gray-300"
                        disabled={loading}
                      />
                      <span>Email notifications</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={
                          formData.settings.notification_preferences
                            .sms_notifications
                        }
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              notification_preferences: {
                                ...prev.settings.notification_preferences,
                                sms_notifications: e.target.checked,
                              },
                            },
                          }))
                        }
                        className="rounded border-gray-300"
                        disabled={loading}
                      />
                      <span>SMS notifications</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={
                          formData.settings.notification_preferences
                            .push_notifications
                        }
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              notification_preferences: {
                                ...prev.settings.notification_preferences,
                                push_notifications: e.target.checked,
                              },
                            },
                          }))
                        }
                        className="rounded border-gray-300"
                        disabled={loading}
                      />
                      <span>Push notifications</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    Security Features
                  </label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.settings.two_factor_enabled}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          settings: {
                            ...prev.settings,
                            two_factor_enabled: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-gray-300"
                      disabled={loading}
                    />
                    <span>Enable two-factor authentication</span>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    User can set up 2FA after first login
                  </p>
                </div>
              </div>
            </div>

            {/* Firm Assignments - Only for certain user types */}
            {['admin', 'accountant', 'owner'].includes(formData.user_type) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>Firm Assignments (Optional)</span>
                  </h3>
                  {availableFirms.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddFirmAssignment(parseInt(e.target.value));
                          e.target.value = '';
                        }
                      }}
                      className="text-sm border border-input rounded-md px-2 py-1"
                      disabled={loading}
                    >
                      <option value="">Add firm assignment...</option>
                      {availableFirms
                        .filter(
                          (firm) =>
                            !formData.firm_assignments.find(
                              (a) => a.firm_id === firm.firm_id
                            )
                        )
                        .map((firm) => (
                          <option key={firm.firm_id} value={firm.firm_id}>
                            {firm.firm_name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>

                {formData.firm_assignments.length > 0 && (
                  <div className="space-y-2">
                    {formData.firm_assignments.map((assignment) => (
                      <div
                        key={assignment.firm_id}
                        className="border border-gray-200 rounded-md p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {assignment.firm_name}
                            </span>
                            {assignment.is_primary_firm && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                Primary
                              </span>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveFirmAssignment(assignment.firm_id)
                            }
                            className="h-6 w-6 p-0 text-red-600"
                            disabled={loading}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <select
                            value={assignment.role_in_firm}
                            onChange={(e) =>
                              handleUpdateAssignment(
                                assignment.firm_id,
                                'role_in_firm',
                                e.target.value
                              )
                            }
                            className="text-xs border border-input rounded px-2 py-1"
                            disabled={loading}
                          >
                            <option value="admin">Admin</option>
                            <option value="senior_admin">Senior Admin</option>
                            <option value="accountant">Accountant</option>
                            <option value="senior_accountant">
                              Senior Accountant
                            </option>
                            <option value="manager">Manager</option>
                            <option value="staff">Staff</option>
                            <option value="readonly">Read Only</option>
                          </select>

                          <select
                            value={assignment.access_level}
                            onChange={(e) =>
                              handleUpdateAssignment(
                                assignment.firm_id,
                                'access_level',
                                e.target.value
                              )
                            }
                            className="text-xs border border-input rounded px-2 py-1"
                            disabled={loading}
                          >
                            <option value="standard">Standard</option>
                            <option value="elevated">Elevated</option>
                            <option value="full">Full</option>
                          </select>

                          <label className="flex items-center space-x-1 text-xs">
                            <input
                              type="checkbox"
                              checked={assignment.is_primary_firm}
                              onChange={(e) =>
                                handleUpdateAssignment(
                                  assignment.firm_id,
                                  'is_primary_firm',
                                  e.target.checked
                                )
                              }
                              className="rounded border-gray-300"
                              disabled={loading}
                            />
                            <span>Primary</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Firm assignments can be added now or managed later through the
                  user details page.{' '}
                  {formData.user_type === 'owner' &&
                    'Owners typically have assignments to firms where they own properties.'}
                </p>
              </div>
            )}
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
                <Users className="h-4 w-4" />
                <span>Create User</span>
              </div>
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
