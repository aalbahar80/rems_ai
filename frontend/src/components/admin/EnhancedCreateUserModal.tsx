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
  ChevronRight,
  ChevronLeft,
  Check,
  Star,
} from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiClient, handleApiError } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface EnhancedCreateUserModalProps {
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

type Step = 'basic' | 'usertype' | 'settings' | 'firms' | 'review';

const STEPS: { key: Step; title: string; description: string }[] = [
  {
    key: 'basic',
    title: 'Basic Information',
    description: 'Personal details and contact information',
  },
  {
    key: 'usertype',
    title: 'User Type & Permissions',
    description: 'Select role and access permissions',
  },
  {
    key: 'settings',
    title: 'Preferences & Security',
    description: 'Language, timezone, and notification settings',
  },
  {
    key: 'firms',
    title: 'Firm Assignments',
    description: 'Assign user to firms with specific roles',
  },
  {
    key: 'review',
    title: 'Review & Create',
    description: 'Review all details before creating user',
  },
];

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

export function EnhancedCreateUserModal({
  isOpen,
  onClose,
  onSuccess,
}: EnhancedCreateUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('basic');
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
    user_type: 'tenant',
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

  useEffect(() => {
    if (isOpen) {
      loadFirms();
      generateSecurePassword();
      setDefaultPermissions();
      setCurrentStep('basic');
      setShowResult(false);
      setCreationResult(null);
      setErrors({});
    }
  }, [isOpen]);

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

  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {};

    switch (currentStep) {
      case 'basic':
        if (!formData.first_name.trim()) {
          newErrors.first_name = 'First name is required';
        }
        if (!formData.last_name.trim()) {
          newErrors.last_name = 'Last name is required';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
          newErrors.phone = 'Please enter a valid phone number';
        }
        break;
      case 'usertype':
        if (!formData.user_type) {
          newErrors.user_type = 'User type is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    const currentIndex = STEPS.findIndex((step) => step.key === currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].key);
    }
  };

  const handlePrevious = () => {
    const currentIndex = STEPS.findIndex((step) => step.key === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].key);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddFirmAssignment = (firmId: number) => {
    const firm = availableFirms.find((f) => f.firm_id === firmId);
    if (!firm) return;

    const newAssignment: FirmAssignment = {
      firm_id: firmId,
      firm_name: firm.firm_name,
      role_in_firm: 'member',
      access_level: 'standard',
      is_primary_firm: formData.firm_assignments.length === 0,
    };

    setFormData((prev) => ({
      ...prev,
      firm_assignments: [...prev.firm_assignments, newAssignment],
    }));
  };

  const handleRemoveFirmAssignment = (firmId: number) => {
    setFormData((prev) => ({
      ...prev,
      firm_assignments: prev.firm_assignments.filter(
        (a) => a.firm_id !== firmId
      ),
    }));
  };

  const handleUpdateAssignment = (
    firmId: number,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      firm_assignments: prev.firm_assignments.map((a) =>
        a.firm_id === firmId
          ? {
              ...a,
              [field]: value,
              // Ensure only one primary firm
              ...(field === 'is_primary_firm' && value
                ? {}
                : field === 'is_primary_firm'
                  ? {}
                  : {}),
            }
          : field === 'is_primary_firm' && value
            ? { ...a, is_primary_firm: false }
            : a
      ),
    }));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);
    setErrors({});

    try {
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null,
        user_type: formData.user_type,
        preferred_language: formData.preferred_language,
        timezone: formData.timezone,
        permissions: formData.permissions,
        settings: formData.settings,
        firm_assignments: formData.firm_assignments,
      };

      const response = await apiClient.post<{
        success: boolean;
        data: { user: CreationResult };
        message: string;
      }>('/users', userData);

      if (response.success) {
        setCreationResult(response.data.user);
        setShowResult(true);
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

  const handleClose = () => {
    if (showResult && creationResult) {
      onSuccess();
    }

    // Reset form
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone: '',
      user_type: 'tenant',
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
    setCurrentStep('basic');
    setShowResult(false);
    setCreationResult(null);
    setErrors({});
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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

  const getUserTypeColor = (userType: string) => {
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

  const getUserTypeDescription = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'Full system access, user management, global settings';
      case 'accountant':
        return 'Property management, financial operations, reporting';
      case 'owner':
        return 'Property oversight, financial reports, approval workflows';
      case 'tenant':
        return 'Lease management, payments, maintenance requests';
      case 'vendor':
        return 'Service delivery, invoicing, work scheduling';
      case 'maintenance_staff':
        return 'Work order management, maintenance tracking';
      default:
        return 'Standard user access';
    }
  };

  const getCurrentStepIndex = () => {
    return STEPS.findIndex((step) => step.key === currentStep);
  };

  const getProgressPercentage = () => {
    const currentIndex = getCurrentStepIndex();
    return ((currentIndex + 1) / STEPS.length) * 100;
  };

  // Success Result Modal
  if (showResult && creationResult) {
    const TypeIcon = getUserTypeIcon(creationResult.user_type);

    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="User Account Created Successfully"
        size="md"
      >
        <ModalBody>
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Account Created Successfully!
              </h3>
              <p className="text-muted-foreground mt-2">
                Please share these credentials securely with the new user
              </p>
            </div>

            <div className="space-y-4 text-left">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Username
                    </label>
                    <div className="flex items-center justify-between mt-1">
                      <code className="bg-background px-2 py-1 rounded text-sm">
                        {creationResult.username}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(creationResult.username)}
                      >
                        📋
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Email
                    </label>
                    <div className="flex items-center justify-between mt-1">
                      <code className="bg-background px-2 py-1 rounded text-sm">
                        {creationResult.email}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(creationResult.email)}
                      >
                        📋
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      User Type
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className={getUserTypeColor(creationResult.user_type)}
                      >
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {creationResult.user_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Temporary Password
                    </label>
                    <div className="flex items-center justify-between mt-1">
                      <code className="bg-background px-2 py-1 rounded text-sm font-mono">
                        {creationResult.generated_password}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(creationResult.generated_password)
                        }
                      >
                        📋
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      User must change password on first login
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <p className="font-medium">Security Note</p>
                    <p>
                      Share these credentials through a secure channel and
                      ensure the user changes their password immediately after
                      first login.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleClose} className="w-full">
            <Check className="h-4 w-4 mr-2" />
            Complete
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  const currentStepData = STEPS[getCurrentStepIndex()];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New User Account"
      size="xl"
    >
      <ModalBody>
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {currentStepData.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentStepData.description}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Step {getCurrentStepIndex() + 1} of {STEPS.length}
              </div>
            </div>

            <div className="space-y-2">
              <Progress value={getProgressPercentage()} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {STEPS.map((step, index) => (
                  <span
                    key={step.key}
                    className={cn(
                      'flex items-center space-x-1',
                      index <= getCurrentStepIndex()
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    {index < getCurrentStepIndex() && (
                      <Check className="h-3 w-3" />
                    )}
                    <span>{step.title}</span>
                  </span>
                ))}
              </div>
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

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 'basic' && (
              <div className="space-y-6">
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
                    />
                  </FormField>

                  <FormField
                    label="Last Name"
                    required
                    error={errors.last_name}
                  >
                    <Input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) =>
                        handleInputChange('last_name', e.target.value)
                      }
                      placeholder="Enter last name"
                    />
                  </FormField>

                  <FormField
                    label="Email Address"
                    required
                    error={errors.email}
                    description="This will be used as the login username"
                  >
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      placeholder="Enter email address"
                    />
                  </FormField>

                  <FormField
                    label="Phone Number"
                    error={errors.phone}
                    description="Optional - for SMS notifications"
                  >
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      placeholder="Enter phone number"
                    />
                  </FormField>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Temporary Password
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="bg-background px-2 py-1 rounded text-sm font-mono">
                      {formData.password}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateSecurePassword}
                    >
                      Generate New
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    User will be required to change password on first login
                  </p>
                </div>
              </div>
            )}

            {currentStep === 'usertype' && (
              <div className="space-y-6">
                <FormField
                  label="Select User Type"
                  required
                  error={errors.user_type}
                  description="Choose the role that best describes this user's responsibilities"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'admin',
                      'accountant',
                      'owner',
                      'tenant',
                      'vendor',
                      'maintenance_staff',
                    ].map((type) => {
                      const Icon = getUserTypeIcon(type);
                      const isSelected = formData.user_type === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleInputChange('user_type', type)}
                          className={cn(
                            'text-left p-4 border rounded-lg transition-all hover:shadow-sm',
                            isSelected
                              ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                              : 'border-border hover:border-muted-foreground'
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={cn(
                                'p-2 rounded-lg',
                                isSelected
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-muted/50 text-muted-foreground'
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground capitalize">
                                {type.replace('_', ' ')}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {getUserTypeDescription(type)}
                              </p>
                            </div>
                            {isSelected && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </FormField>

                {/* Permissions Preview */}
                {formData.permissions &&
                  Object.keys(formData.permissions).length > 0 && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="text-sm font-medium text-foreground mb-3">
                        Default Permissions for{' '}
                        {formData.user_type.replace('_', ' ')}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(formData.permissions).map(
                          ([resource, perms]) => (
                            <div key={resource} className="text-xs">
                              <div className="font-medium text-foreground capitalize mb-1">
                                {resource}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(
                                  perms as Record<string, boolean>
                                ).map(
                                  ([action, allowed]) =>
                                    allowed && (
                                      <Badge
                                        key={action}
                                        variant="outline"
                                        className="text-xs px-1 py-0"
                                      >
                                        {action}
                                      </Badge>
                                    )
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {currentStep === 'settings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-foreground border-b pb-2">
                      Localization
                    </h4>

                    <FormField
                      label="Preferred Language"
                      description="Language for system interface and communications"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'en', label: 'English' },
                          { value: 'ar', label: 'Arabic' },
                          { value: 'both', label: 'Both' },
                        ].map((lang) => (
                          <button
                            key={lang.value}
                            type="button"
                            onClick={() =>
                              handleInputChange(
                                'preferred_language',
                                lang.value
                              )
                            }
                            className={cn(
                              'px-3 py-2 border rounded-md text-sm transition-colors',
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
                          handleInputChange('timezone', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="Asia/Kuwait">Kuwait (GMT+3)</option>
                        <option value="Asia/Riyadh">
                          Saudi Arabia (GMT+3)
                        </option>
                        <option value="Asia/Dubai">UAE (GMT+4)</option>
                        <option value="Asia/Qatar">Qatar (GMT+3)</option>
                        <option value="Asia/Bahrain">Bahrain (GMT+3)</option>
                        <option value="UTC">UTC (GMT+0)</option>
                      </select>
                    </FormField>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-foreground border-b pb-2">
                      Notifications & Security
                    </h4>

                    <FormField label="Notification Preferences">
                      <div className="space-y-2">
                        {[
                          {
                            key: 'email_notifications',
                            label: 'Email Notifications',
                            description: 'System alerts and updates',
                          },
                          {
                            key: 'sms_notifications',
                            label: 'SMS Notifications',
                            description: 'Urgent alerts only',
                          },
                          {
                            key: 'push_notifications',
                            label: 'Push Notifications',
                            description: 'Browser notifications',
                          },
                        ].map((pref) => (
                          <label
                            key={pref.key}
                            className="flex items-start space-x-3 p-2 rounded hover:bg-muted/50"
                          >
                            <input
                              type="checkbox"
                              checked={
                                formData.settings.notification_preferences[
                                  pref.key as keyof typeof formData.settings.notification_preferences
                                ]
                              }
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  settings: {
                                    ...prev.settings,
                                    notification_preferences: {
                                      ...prev.settings.notification_preferences,
                                      [pref.key]: e.target.checked,
                                    },
                                  },
                                }))
                              }
                              className="mt-1 rounded border-border"
                            />
                            <div>
                              <span className="text-sm text-foreground">
                                {pref.label}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                {pref.description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </FormField>

                    <FormField label="Security Options">
                      <label className="flex items-start space-x-3 p-2 rounded hover:bg-muted/50">
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
                          className="mt-1 rounded border-border"
                        />
                        <div>
                          <span className="text-sm text-foreground">
                            Enable Two-Factor Authentication
                          </span>
                          <p className="text-xs text-muted-foreground">
                            User can configure 2FA after first login
                          </p>
                        </div>
                      </label>
                    </FormField>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'firms' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">
                      Firm Assignments
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Optional - Assign user to specific firms with roles and
                      access levels
                    </p>
                  </div>
                  {availableFirms.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddFirmAssignment(parseInt(e.target.value));
                          e.target.value = '';
                        }
                      }}
                      className="text-sm border border-input rounded-md px-3 py-2"
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

                {formData.firm_assignments.length > 0 ? (
                  <div className="space-y-4">
                    {formData.firm_assignments.map((assignment) => (
                      <div
                        key={assignment.firm_id}
                        className="border border-border rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {assignment.firm_name}
                            </span>
                            {assignment.is_primary_firm && (
                              <Badge variant="outline" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Primary
                              </Badge>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveFirmAssignment(assignment.firm_id)
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <FormField label="Role in Firm">
                            <select
                              value={assignment.role_in_firm}
                              onChange={(e) =>
                                handleUpdateAssignment(
                                  assignment.firm_id,
                                  'role_in_firm',
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 text-sm border border-border rounded"
                            >
                              <option value="member">Member</option>
                              <option value="manager">Manager</option>
                              <option value="admin">Admin</option>
                              <option value="viewer">Viewer</option>
                            </select>
                          </FormField>

                          <FormField label="Access Level">
                            <select
                              value={assignment.access_level}
                              onChange={(e) =>
                                handleUpdateAssignment(
                                  assignment.firm_id,
                                  'access_level',
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 text-sm border border-border rounded"
                            >
                              <option value="standard">Standard</option>
                              <option value="elevated">Elevated</option>
                              <option value="full">Full Access</option>
                            </select>
                          </FormField>

                          <FormField label="Primary Firm">
                            <label className="flex items-center space-x-2">
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
                                className="rounded border-border"
                              />
                              <span className="text-sm">Set as primary</span>
                            </label>
                          </FormField>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-muted rounded-lg">
                    <Building2 className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                    <p className="text-sm text-muted-foreground mt-2">
                      No firm assignments added
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Firm assignments can be added later if needed
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 'review' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-foreground">
                    Review User Details
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Please review all information before creating the user
                    account
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-foreground border-b pb-2">
                      Personal Information
                    </h5>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Name:
                        </span>
                        <span className="text-sm font-medium">
                          {formData.first_name} {formData.last_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Email:
                        </span>
                        <span className="text-sm font-medium">
                          {formData.email}
                        </span>
                      </div>
                      {formData.phone && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Phone:
                          </span>
                          <span className="text-sm font-medium">
                            {formData.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Settings */}
                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-foreground border-b pb-2">
                      Account Settings
                    </h5>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          User Type:
                        </span>
                        <Badge
                          variant="outline"
                          className={getUserTypeColor(formData.user_type)}
                        >
                          {formData.user_type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Language:
                        </span>
                        <span className="text-sm font-medium capitalize">
                          {formData.preferred_language === 'both'
                            ? 'English & Arabic'
                            : formData.preferred_language === 'en'
                              ? 'English'
                              : 'Arabic'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Timezone:
                        </span>
                        <span className="text-sm font-medium">
                          {formData.timezone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Firm Assignments */}
                {formData.firm_assignments.length > 0 && (
                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-foreground border-b pb-2">
                      Firm Assignments ({formData.firm_assignments.length})
                    </h5>

                    <div className="grid grid-cols-1 gap-2">
                      {formData.firm_assignments.map((assignment) => (
                        <div
                          key={assignment.firm_id}
                          className="flex items-center justify-between p-2 bg-muted/50 rounded"
                        >
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {assignment.firm_name}
                            </span>
                            {assignment.is_primary_firm && (
                              <Badge variant="outline" className="text-xs">
                                Primary
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {assignment.role_in_firm} •{' '}
                            {assignment.access_level}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notifications Summary */}
                <div className="space-y-4">
                  <h5 className="text-sm font-medium text-foreground border-b pb-2">
                    Notification & Security Settings
                  </h5>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            formData.settings.notification_preferences
                              .email_notifications
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          )}
                        />
                        <span>Email Notifications</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            formData.settings.notification_preferences
                              .sms_notifications
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          )}
                        />
                        <span>SMS Notifications</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            formData.settings.notification_preferences
                              .push_notifications
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          )}
                        />
                        <span>Push Notifications</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            formData.settings.two_factor_enabled
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          )}
                        />
                        <span>Two-Factor Authentication</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center justify-between w-full">
          <Button
            type="button"
            variant="outline"
            onClick={getCurrentStepIndex() === 0 ? handleClose : handlePrevious}
            disabled={loading}
          >
            {getCurrentStepIndex() === 0 ? (
              'Cancel'
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </>
            )}
          </Button>

          {currentStep === 'review' ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={loading}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
}
