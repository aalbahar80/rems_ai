'use client';

import { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Globe,
  Clock,
  Building2,
  Shield,
  Check,
  AlertTriangle,
  Calendar,
  Activity,
  Lock,
  Crown,
  Home,
  Wrench,
  Briefcase,
  Users,
  Eye,
  Settings,
  Key,
} from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
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

interface UserSession {
  session_id: string;
  ip_address: string;
  user_agent: string;
  device_info?: any;
  location_info?: any;
  login_time: string;
  last_activity: string;
  is_active: boolean;
}

interface LoginActivity {
  login_date: string;
  total_attempts: number;
  successful_attempts: number;
  failed_attempts: number;
  success_rate: number;
  unique_ips: number;
  last_successful_login?: string;
  last_failed_login?: string;
}

export function ViewUserModal({ isOpen, onClose, user }: ViewUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'details' | 'sessions' | 'activity' | 'permissions'
  >('details');
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);

  useEffect(() => {
    if (isOpen && user) {
      loadUserDetails();
    }
  }, [isOpen, user, activeTab]);

  const loadUserDetails = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load additional data based on active tab
      if (activeTab === 'sessions') {
        await loadUserSessions();
      } else if (activeTab === 'activity') {
        await loadLoginActivity();
      }
    } catch (error) {
      console.error('Failed to load user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserSessions = async () => {
    if (!user) return;

    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { sessions: UserSession[] };
      }>(`/users/${user.user_id}/sessions`);

      if (response.success) {
        setUserSessions(response.data.sessions);
      }
    } catch (error) {
      console.error('Failed to load user sessions:', error);
    }
  };

  const loadLoginActivity = async () => {
    if (!user) return;

    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { activity: LoginActivity[] };
      }>(`/users/${user.user_id}/login-activity`);

      if (response.success) {
        setLoginActivity(response.data.activity);
      }
    } catch (error) {
      console.error('Failed to load login activity:', error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
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

  const isUserLocked = (user: User) => {
    return user.locked_until && new Date(user.locked_until) > new Date();
  };

  const getDeviceInfo = (session: UserSession) => {
    if (session.device_info) {
      try {
        const device =
          typeof session.device_info === 'string'
            ? JSON.parse(session.device_info)
            : session.device_info;
        return `${device.device || 'Unknown'} - ${device.os || 'Unknown OS'}`;
      } catch {
        return 'Unknown Device';
      }
    }
    return 'Unknown Device';
  };

  const getLocationInfo = (session: UserSession) => {
    if (session.location_info) {
      try {
        const location =
          typeof session.location_info === 'string'
            ? JSON.parse(session.location_info)
            : session.location_info;
        return `${location.city || 'Unknown'}, ${location.country || 'Unknown'}`;
      } catch {
        return 'Unknown Location';
      }
    }
    return 'Unknown Location';
  };

  if (!user) return null;

  const TypeIcon = getUserTypeIcon(user.user_type);
  const isLocked = isUserLocked(user);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${getUserDisplayName(user)} - User Details`}
      size="xl"
    >
      <ModalBody>
        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <TypeIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-foreground truncate">
                {getUserDisplayName(user)}
              </h2>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge
                  variant="outline"
                  className={cn('capitalize', getUserTypeColor(user.user_type))}
                >
                  <TypeIcon className="h-3 w-3 mr-1" />
                  {user.user_type.replace('_', ' ')}
                </Badge>
                {isLocked ? (
                  <Badge
                    variant="outline"
                    className="text-red-600 border-red-200"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                ) : user.is_active ? (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-gray-600 border-gray-200"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Inactive
                  </Badge>
                )}
                {user.email_verified && (
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-200"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {user.two_factor_enabled && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    2FA
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b">
            <nav className="flex space-x-8">
              {[
                { id: 'details', label: 'Details', icon: User },
                { id: 'sessions', label: 'Sessions', icon: Activity },
                { id: 'activity', label: 'Activity', icon: Calendar },
                { id: 'permissions', label: 'Permissions', icon: Key },
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={cn(
                      'flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                    )}
                  >
                    <TabIcon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <Mail className="h-4 w-4" />
                      <span>Contact Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Email Address
                        </p>
                      </div>
                    </div>
                    {user.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{user.phone}</p>
                          <p className="text-xs text-muted-foreground">
                            Phone Number
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {user.preferred_language === 'both'
                            ? 'English & Arabic'
                            : user.preferred_language === 'en'
                              ? 'English'
                              : 'Arabic'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Preferred Language
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{user.timezone}</p>
                        <p className="text-xs text-muted-foreground">
                          Timezone
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-base">
                      <Shield className="h-4 w-4" />
                      <span>Account Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Account Status
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          user.is_active
                            ? 'text-green-600 border-green-200'
                            : 'text-gray-600 border-gray-200'
                        }
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Email Verified
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          user.email_verified
                            ? 'text-green-600 border-green-200'
                            : 'text-orange-600 border-orange-200'
                        }
                      >
                        {user.email_verified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Two-Factor Auth
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          user.two_factor_enabled
                            ? 'text-green-600 border-green-200'
                            : 'text-gray-600 border-gray-200'
                        }
                      >
                        {user.two_factor_enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Login Attempts
                      </span>
                      <span className="text-sm font-medium">
                        {user.login_attempts}/10
                      </span>
                    </div>
                    {isLocked && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Locked Until
                        </span>
                        <span className="text-sm font-medium text-red-600">
                          {formatDate(user.locked_until!)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Last Login
                      </span>
                      <span className="text-sm font-medium">
                        {user.last_login
                          ? formatDate(user.last_login)
                          : 'Never'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Created
                      </span>
                      <span className="text-sm font-medium">
                        {formatDate(user.created_at)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Firm Assignments */}
                {user.firm_assignments && user.firm_assignments.length > 0 && (
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-base">
                        <Building2 className="h-4 w-4" />
                        <span>
                          Firm Assignments ({user.firm_assignments.length})
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {user.firm_assignments.map((assignment) => (
                          <div
                            key={assignment.firm_id}
                            className="flex items-center justify-between p-3 border rounded-md"
                          >
                            <div className="flex items-center space-x-3">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <p className="text-sm font-medium">
                                    {assignment.firm_name}
                                  </p>
                                  {assignment.is_primary_firm && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs text-blue-600 border-blue-200"
                                    >
                                      Primary
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {assignment.role_in_firm} •{' '}
                                  {assignment.access_level} access
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                Assigned:{' '}
                                {formatDateShort(assignment.assigned_at)}
                              </p>
                              {assignment.assigned_by_name && (
                                <p className="text-xs text-muted-foreground">
                                  by {assignment.assigned_by_name}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Entity Information */}
                {user.entity_name && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-base">
                        <User className="h-4 w-4" />
                        <span>Related Entity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">
                          {user.entity_name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {user.related_entity_type} (ID:{' '}
                          {user.related_entity_id})
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'sessions' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <Activity className="h-4 w-4" />
                    <span>Active Sessions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Loading sessions...
                      </p>
                    </div>
                  ) : userSessions.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">
                        No active sessions found
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userSessions.map((session) => (
                        <div
                          key={session.session_id}
                          className="flex items-center justify-between p-3 border rounded-md"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {getDeviceInfo(session)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {session.ip_address} •{' '}
                                {getLocationInfo(session)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Login: {formatDate(session.login_time)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Last: {formatDate(session.last_activity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'activity' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <Calendar className="h-4 w-4" />
                    <span>Login Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Loading activity...
                      </p>
                    </div>
                  ) : loginActivity.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">
                        No login activity found
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {loginActivity.map((activity) => (
                        <div
                          key={activity.login_date}
                          className="flex items-center justify-between p-3 border rounded-md"
                        >
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {formatDateShort(activity.login_date)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {activity.total_attempts} attempts •{' '}
                                {activity.unique_ips} IPs
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className={
                                  activity.success_rate >= 80
                                    ? 'text-green-600 border-green-200'
                                    : activity.success_rate >= 50
                                      ? 'text-yellow-600 border-yellow-200'
                                      : 'text-red-600 border-red-200'
                                }
                              >
                                {activity.success_rate}% success
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {activity.successful_attempts} success •{' '}
                              {activity.failed_attempts} failed
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'permissions' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base">
                    <Key className="h-4 w-4" />
                    <span>Permissions & Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.permissions ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          System Permissions
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(user.permissions).map(
                            ([resource, permissions]) => (
                              <div
                                key={resource}
                                className="border rounded-md p-3"
                              >
                                <h5 className="text-sm font-medium capitalize mb-2">
                                  {resource}
                                </h5>
                                <div className="flex space-x-2">
                                  {Object.entries(
                                    permissions as Record<string, boolean>
                                  ).map(([action, allowed]) => (
                                    <Badge
                                      key={action}
                                      variant="outline"
                                      className={cn(
                                        'text-xs',
                                        allowed
                                          ? 'text-green-600 border-green-200'
                                          : 'text-gray-600 border-gray-200'
                                      )}
                                    >
                                      {action}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {user.settings?.notification_preferences && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Notification Preferences
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(
                              user.settings.notification_preferences
                            ).map(([type, enabled]) => (
                              <div
                                key={type}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm text-muted-foreground capitalize">
                                  {type.replace('_', ' ')}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={
                                    enabled
                                      ? 'text-green-600 border-green-200'
                                      : 'text-gray-600 border-gray-200'
                                  }
                                >
                                  {enabled ? 'Enabled' : 'Disabled'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">
                        No permissions data available
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button
          onClick={() => {
            /* TODO: Open edit modal */
          }}
        >
          <Settings className="h-4 w-4 mr-2" />
          Edit User
        </Button>
      </ModalFooter>
    </Modal>
  );
}
