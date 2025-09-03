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
} from 'lucide-react';
import { AdminLayout } from '@/components/shared/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateAccountantModal } from '@/components/admin/CreateAccountantModal';
import { ViewAccountantModal } from '@/components/admin/ViewAccountantModal';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

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

interface AccountantStatistics {
  active_accountants: number;
  inactive_accountants: number;
  total_accountants: number;
  verified_accountants: number;
  recently_active_accountants: number;
  firms_with_accountants: number;
  avg_firms_per_accountant: number;
}

export default function AccountantsManagement() {
  const [accountants, setAccountants] = useState<Accountant[]>([]);
  const [statistics, setStatistics] = useState<AccountantStatistics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAccountant, setSelectedAccountant] =
    useState<Accountant | null>(null);

  const loadAccountants = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage.toString(),
        limit: '10',
        search: searchTerm,
        status: statusFilter,
      };

      const response = await apiClient.get<{
        success: boolean;
        data: {
          accountants: Accountant[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
          };
        };
      }>('/accountants', params);

      if (response.success) {
        setAccountants(response.data.accountants);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to load accountants:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  const loadStatistics = useCallback(async () => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: {
          statistics: AccountantStatistics;
        };
      }>('/accountants/statistics');

      if (response.success) {
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error('Failed to load accountant statistics:', error);
    }
  }, []);

  useEffect(() => {
    loadAccountants();
    loadStatistics();
  }, [currentPage, searchTerm, statusFilter, loadAccountants, loadStatistics]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: 'all' | 'active' | 'inactive') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleCreateSuccess = () => {
    loadAccountants();
    loadStatistics();
  };

  const handleViewAccountant = (accountant: Accountant) => {
    setSelectedAccountant(accountant);
    setShowViewModal(true);
  };

  const handleToggleAccountantStatus = async (accountantId: number) => {
    try {
      const response = await apiClient.patch<{
        success: boolean;
        message: string;
      }>(`/accountants/${accountantId}/toggle-status`);

      if (response.success) {
        loadAccountants();
        loadStatistics();
      }
    } catch (error) {
      console.error('Failed to toggle accountant status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getAccountantName = (accountant: Accountant) => {
    // Try to get name from username or email
    if (accountant.username && accountant.username !== accountant.email) {
      return accountant.username
        .replace(/\./g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return accountant.email
      .split('@')[0]
      .replace(/\./g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
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
    color?: 'blue' | 'green' | 'purple' | 'orange';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
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

  const AccountantRow = ({
    accountant,
    onViewAccountant,
    onToggleStatus,
  }: {
    accountant: Accountant;
    onViewAccountant: (accountant: Accountant) => void;
    onToggleStatus: (accountantId: number) => void;
  }) => {
    const [actionMenuOpen, setActionMenuOpen] = useState(false);

    return (
      <tr className="border-b hover:bg-muted/50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <button
                onClick={() => onViewAccountant(accountant)}
                className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors text-left"
              >
                {getAccountantName(accountant)}
              </button>
              <p className="text-xs text-muted-foreground truncate">
                {accountant.username}
              </p>
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="text-sm">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{accountant.email}</span>
            </div>
            {accountant.phone && (
              <div className="flex items-center space-x-1 text-muted-foreground mt-1">
                <Phone className="h-3 w-3" />
                <span>{accountant.phone}</span>
              </div>
            )}
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center">
              {accountant.is_active ? (
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
            </div>
            <div className="flex items-center">
              {accountant.email_verified ? (
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
            </div>
          </div>
        </td>

        <td className="px-6 py-4 text-center">
          <div className="flex items-center justify-center space-x-1">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {accountant.assigned_firms_count || 0}
            </span>
          </div>
        </td>

        <td className="px-6 py-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>
              {accountant.last_login
                ? `Last: ${formatDate(accountant.last_login)}`
                : 'Never logged in'}
            </span>
          </div>
        </td>

        <td className="px-6 py-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(accountant.created_at)}</span>
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
                        onViewAccountant(accountant);
                        setActionMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => {
                        onToggleStatus(accountant.user_id);
                        setActionMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      {accountant.is_active ? (
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
              Accountant Management
            </h1>
            <p className="text-muted-foreground">
              Manage accountant users and their firm assignments
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Accountant</span>
          </Button>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Accountants"
              value={statistics.total_accountants}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Active Accountants"
              value={statistics.active_accountants}
              icon={UserCheck}
              color="green"
            />
            <StatCard
              title="Verified Users"
              value={statistics.verified_accountants}
              icon={Check}
              color="purple"
            />
            <StatCard
              title="Avg Assignments"
              value={statistics.avg_firms_per_accountant}
              icon={Building2}
              color="orange"
            />
          </div>
        )}

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search accountants..."
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
                    variant={statusFilter === 'active' ? 'default' : 'outline'}
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
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accountants Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Accountants ({accountants.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-muted-foreground">
                  Loading accountants...
                </p>
              </div>
            ) : accountants.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  No accountants found
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {searchTerm || statusFilter !== 'all'
                    ? 'No accountants match your current filters.'
                    : 'Get started by creating your first accountant user.'}
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button
                    className="mt-4"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Accountant
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
                    {accountants.map((accountant) => (
                      <AccountantRow
                        key={accountant.user_id}
                        accountant={accountant}
                        onViewAccountant={handleViewAccountant}
                        onToggleStatus={handleToggleAccountantStatus}
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

        {/* Create Accountant Modal */}
        <CreateAccountantModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />

        {/* View Accountant Modal */}
        <ViewAccountantModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          accountant={selectedAccountant}
        />
      </div>
    </AdminLayout>
  );
}
