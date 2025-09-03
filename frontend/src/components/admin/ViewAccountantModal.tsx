'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Mail,
  Phone,
  Globe,
  Clock,
  Building2,
  User,
  Calendar,
  Check,
  X,
  UserCheck,
  UserX,
  AlertTriangle,
  Shield,
  Activity,
  MapPin,
} from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface ViewAccountantModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountant: Accountant | null;
}

interface Accountant {
  user_id: number;
  username: string;
  email: string;
  phone?: string;
  is_active: boolean;
  email_verified: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  assigned_firms_count: number;
  firm_assignments?: Array<{
    firm_id: number;
    firm_name: string;
    role_in_firm: string;
    access_level: string;
    assigned_at: string;
  }>;
}

interface DetailedAccountant {
  user_id: number;
  username: string;
  email: string;
  phone?: string;
  is_active: boolean;
  email_verified: boolean;
  email_verified_at?: string;
  last_login?: string;
  login_attempts: number;
  locked_until?: string;
  permissions: any;
  settings: any;
  profile_image?: string;
  two_factor_enabled: boolean;
  preferred_language: string;
  timezone: string;
  created_at: string;
  updated_at: string;
  firm_assignments: Array<{
    assignment_id: number;
    firm_id: number;
    firm_name: string;
    firm_is_active: boolean;
    role_in_firm: string;
    access_level: string;
    is_active: boolean;
    assigned_at: string;
    assigned_by: number;
    assigned_by_username: string;
  }>;
}

export function ViewAccountantModal({
  isOpen,
  onClose,
  accountant,
}: ViewAccountantModalProps) {
  const [loading, setLoading] = useState(false);
  const [detailedAccountant, setDetailedAccountant] =
    useState<DetailedAccountant | null>(null);

  const loadAccountantDetails = useCallback(async () => {
    if (!accountant) return;

    try {
      setLoading(true);
      const response = await apiClient.get<{
        success: boolean;
        data: DetailedAccountant;
      }>(`/accountants/${accountant.user_id}`);

      if (response.success) {
        setDetailedAccountant(response.data);
      }
    } catch (error) {
      console.error('Failed to load accountant details:', error);
    } finally {
      setLoading(false);
    }
  }, [accountant]);

  useEffect(() => {
    if (isOpen && accountant) {
      loadAccountantDetails();
    }
  }, [isOpen, accountant, loadAccountantDetails]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateOnly = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getAccountantName = () => {
    if (!detailedAccountant) return '';

    const settings = detailedAccountant.settings || {};
    if (settings.full_name) return settings.full_name;
    if (settings.first_name && settings.last_name) {
      return `${settings.first_name} ${settings.last_name}`;
    }

    // Fallback to username formatting
    if (
      detailedAccountant.username &&
      detailedAccountant.username !== detailedAccountant.email
    ) {
      return detailedAccountant.username
        .replace(/\./g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return detailedAccountant.email
      .split('@')[0]
      .replace(/\./g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getLanguageName = (code: string) => {
    const languages: { [key: string]: string } = {
      en: 'English',
      ar: 'Arabic',
      fr: 'French',
      es: 'Spanish',
      de: 'German',
    };
    return languages[code] || code;
  };

  const getAccessLevelBadge = (level: string) => {
    switch (level) {
      case 'full':
        return (
          <Badge variant="outline" className="text-green-600 border-green-200">
            Full Access
          </Badge>
        );
      case 'advanced':
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            Advanced
          </Badge>
        );
      case 'standard':
      default:
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-200">
            Standard
          </Badge>
        );
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'senior_accountant':
        return (
          <Badge
            variant="outline"
            className="text-purple-600 border-purple-200"
          >
            Senior Accountant
          </Badge>
        );
      case 'financial_manager':
        return (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-200"
          >
            Financial Manager
          </Badge>
        );
      case 'accountant':
      default:
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            Accountant
          </Badge>
        );
    }
  };

  if (!isOpen || !accountant) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Accountant Details`}
      size="xl"
    >
      <ModalBody>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Loading accountant details...
            </p>
          </div>
        ) : detailedAccountant ? (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start space-x-4 p-6 bg-muted/30 rounded-lg">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-foreground truncate">
                  {getAccountantName()}
                </h2>
                <p className="text-sm text-muted-foreground">
                  @{detailedAccountant.username}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  {detailedAccountant.is_active ? (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200"
                    >
                      <UserCheck className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-red-600 border-red-200"
                    >
                      <UserX className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                  {detailedAccountant.email_verified ? (
                    <Badge
                      variant="outline"
                      className="text-blue-600 border-blue-200"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-200"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Unverified
                    </Badge>
                  )}
                  {detailedAccountant.two_factor_enabled && (
                    <Badge
                      variant="outline"
                      className="text-purple-600 border-purple-200"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      2FA Enabled
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Contact Information</span>
                </h3>

                <div className="space-y-3 pl-6">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-foreground">
                        {detailedAccountant.email}
                      </span>
                      {detailedAccountant.email_verified && (
                        <Check className="h-3 w-3 text-green-600 ml-1 inline" />
                      )}
                    </div>
                  </div>

                  {detailedAccountant.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {detailedAccountant.phone}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {getLanguageName(detailedAccountant.preferred_language)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {detailedAccountant.timezone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Account Activity</span>
                </h3>

                <div className="space-y-3 pl-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Last Login:
                      </span>
                      <div className="text-sm text-foreground">
                        {formatDate(detailedAccountant.last_login)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Created:
                      </span>
                      <div className="text-sm text-foreground">
                        {formatDate(detailedAccountant.created_at)}
                      </div>
                    </div>
                  </div>

                  {detailedAccountant.email_verified_at && (
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Email Verified:
                        </span>
                        <div className="text-sm text-foreground">
                          {formatDate(detailedAccountant.email_verified_at)}
                        </div>
                      </div>
                    </div>
                  )}

                  {detailedAccountant.locked_until && (
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <div>
                        <span className="text-xs text-red-600">
                          Locked Until:
                        </span>
                        <div className="text-sm text-red-700">
                          {formatDate(detailedAccountant.locked_until)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Security & Authentication</span>
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pl-6">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-semibold text-foreground">
                    {detailedAccountant.login_attempts}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Failed Attempts
                  </div>
                </div>

                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-semibold text-foreground">
                    {detailedAccountant.two_factor_enabled ? (
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-600 mx-auto" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    2FA Status
                  </div>
                </div>

                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-semibold text-foreground">
                    {detailedAccountant.email_verified ? (
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-orange-600 mx-auto" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Email Verified
                  </div>
                </div>

                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-semibold text-foreground">
                    {detailedAccountant.is_active ? (
                      <UserCheck className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <UserX className="h-5 w-5 text-red-600 mx-auto" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Account Status
                  </div>
                </div>
              </div>
            </div>

            {/* Firm Assignments */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>
                  Firm Assignments ({detailedAccountant.firm_assignments.length}
                  )
                </span>
              </h3>

              {detailedAccountant.firm_assignments.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No firm assignments yet</p>
                </div>
              ) : (
                <div className="space-y-3 pl-6">
                  {detailedAccountant.firm_assignments.map((assignment) => (
                    <div
                      key={assignment.assignment_id}
                      className={cn(
                        'border rounded-lg p-4 space-y-2',
                        assignment.is_active
                          ? 'border-green-200 bg-green-50/50'
                          : 'border-gray-200 bg-gray-50/50'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">
                            {assignment.firm_name}
                          </span>
                          {!assignment.firm_is_active && (
                            <Badge
                              variant="outline"
                              className="text-orange-600 border-orange-200"
                            >
                              Firm Inactive
                            </Badge>
                          )}
                        </div>
                        {assignment.is_active ? (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-200"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-gray-600 border-gray-200"
                          >
                            Inactive
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Role: </span>
                          {getRoleBadge(assignment.role_in_firm)}
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Access:{' '}
                          </span>
                          {getAccessLevelBadge(assignment.access_level)}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Assigned on {formatDateOnly(assignment.assigned_at)} by{' '}
                        {assignment.assigned_by_username}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground/50 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              Unable to load details
            </h3>
            <p className="mt-2 text-muted-foreground">
              There was an error loading the accountant details.
            </p>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
