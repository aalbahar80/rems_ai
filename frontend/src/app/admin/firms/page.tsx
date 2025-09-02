'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Users,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Check,
  X,
  Edit3,
  Trash2,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { AdminLayout } from '@/components/shared/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateFirmModal } from '@/components/admin/CreateFirmModal';
import { apiClient, handleApiError } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface Firm {
  firm_id: number;
  firm_name: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  active_users?: number;
  properties_count?: number;
}

interface FirmStatistics {
  active_firms: number;
  inactive_firms: number;
  total_firms: number;
  total_active_assignments: number;
  unique_active_users: number;
  avg_properties_per_firm: number;
}

export default function FirmsManagement() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [statistics, setStatistics] = useState<FirmStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadFirms();
    loadStatistics();
  }, [currentPage, searchTerm, statusFilter]);

  const loadFirms = async () => {
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
          firms: Firm[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
          };
        };
      }>('/firms', params);

      if (response.success) {
        setFirms(response.data.firms);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to load firms:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: {
          statistics: FirmStatistics;
        };
      }>('/firms/statistics');

      if (response.success) {
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error('Failed to load firm statistics:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: 'all' | 'active' | 'inactive') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleCreateSuccess = () => {
    loadFirms();
    loadStatistics();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  const FirmRow = ({ firm }: { firm: Firm }) => {
    const [actionMenuOpen, setActionMenuOpen] = useState(false);

    return (
      <tr className="border-b hover:bg-muted/50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {firm.firm_name}
              </p>
              {firm.description && (
                <p className="text-xs text-muted-foreground truncate">
                  {firm.description}
                </p>
              )}
            </div>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="text-sm">
            {firm.contact_email && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span className="truncate">{firm.contact_email}</span>
              </div>
            )}
            {firm.contact_phone && (
              <div className="flex items-center space-x-1 text-muted-foreground mt-1">
                <Phone className="h-3 w-3" />
                <span>{firm.contact_phone}</span>
              </div>
            )}
          </div>
        </td>

        <td className="px-6 py-4 text-center">
          <div className="flex items-center justify-center space-x-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {firm.active_users || 0}
            </span>
          </div>
        </td>

        <td className="px-6 py-4 text-center">
          <div className="flex items-center justify-center space-x-1">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {firm.properties_count || 0}
            </span>
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center">
            {firm.is_active ? (
              <div className="flex items-center space-x-1 text-green-600">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium">Active</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-600">
                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                <span className="text-xs font-medium">Inactive</span>
              </div>
            )}
          </div>
        </td>

        <td className="px-6 py-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(firm.created_at)}</span>
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
                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted">
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted">
                      <Edit3 className="h-4 w-4" />
                      <span>Edit Firm</span>
                    </button>
                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-foreground hover:bg-muted">
                      <Users className="h-4 w-4" />
                      <span>Manage Users</span>
                    </button>
                    <div className="border-t my-1"></div>
                    <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Firm</span>
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
              Firms Management
            </h1>
            <p className="text-muted-foreground">
              Manage organizations and their settings across the platform
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Firm</span>
          </Button>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Firms"
              value={statistics.total_firms}
              icon={Building2}
              color="blue"
            />
            <StatCard
              title="Active Firms"
              value={statistics.active_firms}
              icon={Check}
              color="green"
            />
            <StatCard
              title="Total Users"
              value={statistics.unique_active_users}
              icon={Users}
              color="purple"
            />
            <StatCard
              title="Avg Properties"
              value={statistics.avg_properties_per_firm}
              icon={MapPin}
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
                    placeholder="Search firms..."
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

        {/* Firms Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Firms ({firms.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading firms...</p>
              </div>
            ) : firms.length === 0 ? (
              <div className="p-8 text-center">
                <Building2 className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  No firms found
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {searchTerm || statusFilter !== 'all'
                    ? 'No firms match your current filters.'
                    : 'Get started by creating your first firm.'}
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button
                    className="mt-4"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Firm
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Firm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Users
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Properties
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
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
                    {firms.map((firm) => (
                      <FirmRow key={firm.firm_id} firm={firm} />
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

        {/* Create Firm Modal */}
        <CreateFirmModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </AdminLayout>
  );
}
