'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Check,
  Trash2,
  Eye,
  Building2,
  UserCheck,
  UserX,
  AlertTriangle,
  Shield,
  Crown,
  Home,
  Wrench,
  Briefcase,
} from 'lucide-react';
import { AdminLayout } from '@/components/shared/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateUserModal } from '@/components/admin/CreateUserModal';
import { ViewUserModal } from '@/components/admin/ViewUserModal';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

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
  firm_assignments?: Array<{
    firm_id: number;
    firm_name: string;
    role_in_firm: string;
    access_level: string;
    assigned_at: string;
    is_primary_firm: boolean;
  }>;
}

interface UserStatistics {
  total_users: number;
  active_users: number;
  inactive_users: number;
  verified_users: number;
  locked_users: number;
  two_factor_enabled_users: number;
  user_type_breakdown: {
    admin: number;
    accountant: number;
    owner: number;
    tenant: number;
    vendor: number;
    maintenance_staff: number;
  };
  recently_active_users: number;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive' | 'locked'
  >('all');
  const [typeFilter, setTypeFilter] = useState<'all' | User['user_type']>(
    'all'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        status: statusFilter,
        user_type: typeFilter === 'all' ? '' : typeFilter,
      };

      const response = await apiClient.get<{
        success: boolean;
        data: {
          users: User[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
          };
        };
      }>('/users', params);

      if (response.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  const loadStatistics = useCallback(async () => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: {
          statistics: UserStatistics;
        };
      }>('/users/statistics');

      if (response.success) {
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error('Failed to load user statistics:', error);
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadStatistics();
  }, [
    currentPage,
    searchTerm,
    statusFilter,
    typeFilter,
    loadUsers,
    loadStatistics,
  ]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (
    status: 'all' | 'active' | 'inactive' | 'locked'
  ) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleTypeFilter = (type: 'all' | User['user_type']) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const handleCreateSuccess = () => {
    loadUsers();
    loadStatistics();
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      const response = await apiClient.patch<{
        success: boolean;
        message: string;
      }>(`/users/${userId}/toggle-status`);

      if (response.success) {
        loadUsers();
        loadStatistics();
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleUnlockUser = async (userId: number) => {
    try {
      const response = await apiClient.patch<{
        success: boolean;
        message: string;
      }>(`/users/${userId}/unlock`);

      if (response.success) {
        loadUsers();
        loadStatistics();
      }
    } catch (error) {
      console.error('Failed to unlock user:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getUserDisplayName = (user: User) => {
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

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color = 'blue',
  }: {
    title: string;
    value: number | string;
    icon: React.ComponentType<{ className?: string }>;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'amber';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      amber: 'bg-amber-50 text-amber-600 border-amber-200',
    };

    return (
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-3xl font-bold text-foreground">{value}</p>
            </div>
            <div className={cn('p-3 rounded-full', colorClasses[color])}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const UserRow = ({
    user,
    onViewUser,
    onToggleStatus,
    onUnlockUser,
  }: {
    user: User;
    onViewUser: (user: User) => void;
    onToggleStatus: (userId: number) => void;
    onUnlockUser: (userId: number) => void;
  }) => {
    const [actionMenuOpen, setActionMenuOpen] = useState(false);
    const TypeIcon = getUserTypeIcon(user.user_type);
    const isLocked = isUserLocked(user);

    return (
      <tr className="border-b hover:bg-muted/50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TypeIcon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <button
                onClick={() => onViewUser(user)}
                className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors text-left"
              >
                {getUserDisplayName(user)}
              </button>
              <p className="text-xs text-muted-foreground truncate">
                {user.username}
              </p>
              {user.entity_name && (
                <p className="text-xs text-muted-foreground truncate">
                  {user.entity_name}
                </p>
              )}
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="text-sm">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-1 text-muted-foreground mt-1">
                <Phone className="h-3 w-3" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </td>

        <td className="px-6 py-4">
          <Badge
            variant="outline"
            className={cn('capitalize', getUserTypeColor(user.user_type))}
          >
            <TypeIcon className="h-3 w-3 mr-1" />
            {user.user_type.replace('_', ' ')}
          </Badge>
        </td>

        <td className="px-6 py-4">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center">
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
                  <UserCheck className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-gray-600 border-gray-200"
                >
                  <UserX className="h-3 w-3 mr-1" />
                  Inactive
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {user.email_verified ? (
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
        </td>

        <td className="px-6 py-4 text-center">
          <div className="flex items-center justify-center space-x-1">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {user.assigned_firms_count || 0}
            </span>
          </div>
        </td>

        <td className="px-6 py-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>
              {user.last_login
                ? `Last: ${formatDate(user.last_login)}`
                : 'Never logged in'}
            </span>
          </div>
        </td>

        <td className="px-6 py-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(user.created_at)}</span>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActionMenuOpen(!actionMenuOpen)}
              className="h-8 w-8 p-0"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {actionMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setActionMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border rounded-md shadow-lg z-20">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onViewUser(user);
                        setActionMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    {isLocked ? (
                      <button
                        onClick={() => {
                          onUnlockUser(user.user_id);
                          setActionMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <UserCheck className="h-4 w-4" />
                        <span>Unlock Account</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onToggleStatus(user.user_id);
                          setActionMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        {user.is_active ? (
                          <>
                            <UserX className="h-4 w-4" />
                            <span>Deactivate</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4" />
                            <span>Activate</span>
                          </>
                        )}
                      </button>
                    )}
                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted">
                      <Building2 className="h-4 w-4" />
                      <span>Manage Assignments</span>
                    </button>
                    <div className="border-t my-1"></div>
                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                      <span>Reset Password</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage system users and their permissions across all portals
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create User</span>
          </Button>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={statistics.total_users}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Active Users"
              value={statistics.active_users}
              icon={UserCheck}
              color="green"
            />
            <StatCard
              title="Verified Users"
              value={statistics.verified_users}
              icon={Check}
              color="purple"
            />
            <StatCard
              title="Locked Users"
              value={statistics.locked_users}
              icon={AlertTriangle}
              color="red"
            />
          </div>
        )}

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-9 w-80"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant={statusFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusFilter('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={
                        statusFilter === 'active' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => handleStatusFilter('active')}
                    >
                      Active
                    </Button>
                    <Button
                      variant={
                        statusFilter === 'inactive' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => handleStatusFilter('inactive')}
                    >
                      Inactive
                    </Button>
                    <Button
                      variant={
                        statusFilter === 'locked' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => handleStatusFilter('locked')}
                    >
                      Locked
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Filter by type:
                </span>
                <div className="flex items-center space-x-1">
                  <Button
                    variant={typeFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTypeFilter('all')}
                  >
                    All Types
                  </Button>
                  <Button
                    variant={typeFilter === 'admin' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTypeFilter('admin')}
                  >
                    Admin
                  </Button>
                  <Button
                    variant={
                      typeFilter === 'accountant' ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => handleTypeFilter('accountant')}
                  >
                    Accountant
                  </Button>
                  <Button
                    variant={typeFilter === 'owner' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTypeFilter('owner')}
                  >
                    Owner
                  </Button>
                  <Button
                    variant={typeFilter === 'tenant' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTypeFilter('tenant')}
                  >
                    Tenant
                  </Button>
                  <Button
                    variant={typeFilter === 'vendor' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTypeFilter('vendor')}
                  >
                    Vendor
                  </Button>
                  <Button
                    variant={
                      typeFilter === 'maintenance_staff' ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => handleTypeFilter('maintenance_staff')}
                  >
                    Staff
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Users ({users.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  No users found
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'No users match your current filters.'
                    : 'Get started by creating your first user.'}
                </p>
                {!searchTerm &&
                  statusFilter === 'all' &&
                  typeFilter === 'all' && (
                    <Button
                      className="mt-4"
                      onClick={() => setShowCreateModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First User
                    </Button>
                  )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Assignments
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background">
                    {users.map((user) => (
                      <UserRow
                        key={user.user_id}
                        user={user}
                        onViewUser={handleViewUser}
                        onToggleStatus={handleToggleUserStatus}
                        onUnlockUser={handleUnlockUser}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Create User Modal */}
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />

        {/* View User Modal */}
        <ViewUserModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          user={selectedUser}
        />
      </div>
    </AdminLayout>
  );
}
