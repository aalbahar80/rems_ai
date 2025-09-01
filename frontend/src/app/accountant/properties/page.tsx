'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AccountantLayout } from '@/components/accountant/AccountantLayout';
import { cn } from '@/lib/utils';

// Mock data for properties - will be replaced with API calls
const mockProperties = [
  {
    id: '1',
    code: 'Z1',
    name: 'Richardson Tower One',
    location: 'Salmiya',
    address: 'Block 2, Salem Al-Mubarak Street, Salmiya',
    type: 'Residential',
    totalUnits: 5,
    occupiedUnits: 3,
    occupancyRate: 60,
    totalArea: 1032,
    constructionYear: 2012,
    currentValuation: 1571785.71,
    monthlyRevenue: 1350,
    ownership: {
      type: 'individual',
      owners: [{ name: 'Alexander Richardson', percentage: 100 }],
    },
    status: 'active',
    createdAt: '2024-02-15',
  },
  {
    id: '2',
    code: 'AHS1',
    name: 'Al-Hamra Shared Investment',
    location: 'Hawalli',
    address: 'Al-Hamra Complex, Hawalli Governorate',
    type: 'Commercial',
    totalUnits: 12,
    occupiedUnits: 10,
    occupancyRate: 83,
    totalArea: 2400,
    constructionYear: 2018,
    currentValuation: 2850000,
    monthlyRevenue: 4200,
    ownership: {
      type: 'shared',
      owners: [
        { name: 'Ahmed Al-Sabah', percentage: 50 },
        { name: 'Sarah Al-Rasheed', percentage: 30 },
        { name: 'Firm Default', percentage: 20 },
      ],
    },
    status: 'active',
    createdAt: '2024-01-20',
  },
];

interface Property {
  id: string;
  code: string;
  name: string;
  location: string;
  address: string;
  type: string;
  totalUnits: number;
  occupiedUnits: number;
  occupancyRate: number;
  totalArea: number;
  constructionYear: number;
  currentValuation: number;
  monthlyRevenue: number;
  ownership: {
    type: 'individual' | 'shared' | 'firm';
    owners: Array<{ name: string; percentage: number }>;
  };
  status: 'active' | 'inactive' | 'under_construction';
  createdAt: string;
}

export default function PropertiesPage() {
  const router = useRouter();
  const [properties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'inactive'
  >('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateProperty = () => {
    router.push('/accountant/properties/create');
  };

  const handleViewProperty = (propertyId: string) => {
    router.push(`/accountant/properties/${propertyId}`);
  };

  const handleEditProperty = (propertyId: string) => {
    router.push(`/accountant/properties/${propertyId}/edit`);
  };

  const getOccupancyColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOwnershipDisplay = (ownership: Property['ownership']) => {
    if (
      ownership.type === 'individual' &&
      ownership.owners.length === 1 &&
      ownership.owners[0].percentage === 100
    ) {
      return ownership.owners[0].name;
    }

    if (ownership.type === 'shared') {
      return `${ownership.owners.length} co-owners`;
    }

    return 'Firm owned';
  };

  return (
    <AccountantLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Property Management
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage your property portfolio and track performance
              </p>
            </div>
            <Button
              onClick={handleCreateProperty}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Properties
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {properties.length}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Units
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {properties.reduce((sum, p) => sum + p.totalUnits, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg Occupancy
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(
                      properties.reduce((sum, p) => sum + p.occupancyRate, 0) /
                        properties.length
                    )}
                    %
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monthly Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {properties
                      .reduce((sum, p) => sum + p.monthlyRevenue, 0)
                      .toLocaleString()}{' '}
                    KWD
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')
              }
              className="border rounded-lg px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            >
              <option value="all">All Properties</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>

        {/* Properties Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card
                key={property.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        {property.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Code: {property.code} • {property.type}
                      </p>
                    </div>
                    <div className="relative">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    {property.location}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Total Units
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {property.totalUnits}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Occupancy
                      </p>
                      <p
                        className={cn(
                          'font-semibold',
                          getOccupancyColor(property.occupancyRate)
                        )}
                      >
                        {property.occupancyRate}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Monthly Revenue
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {property.monthlyRevenue.toLocaleString()} KWD
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Valuation
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {(property.currentValuation / 1000).toFixed(0)}K KWD
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Ownership
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {getOwnershipDisplay(property.ownership)}
                    </p>
                    {property.ownership.type === 'shared' && (
                      <div className="flex space-x-1 mt-1">
                        {property.ownership.owners.map((owner, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                          >
                            {owner.percentage}%
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t dark:border-gray-700">
                    <span
                      className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        property.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      )}
                    >
                      {property.status === 'active' ? 'Active' : 'Inactive'}
                    </span>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewProperty(property.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProperty(property.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Units
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Occupancy
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Ownership
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredProperties.map((property) => (
                      <tr
                        key={property.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {property.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Code: {property.code}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {property.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {property.occupiedUnits}/{property.totalUnits}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'text-sm font-medium',
                              getOccupancyColor(property.occupancyRate)
                            )}
                          >
                            {property.occupancyRate}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {property.monthlyRevenue.toLocaleString()} KWD
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {getOwnershipDisplay(property.ownership)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                              property.status === 'active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            )}
                          >
                            {property.status === 'active'
                              ? 'Active'
                              : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewProperty(property.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditProperty(property.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No properties found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first property to the portfolio'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button
                onClick={handleCreateProperty}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Button>
            )}
          </div>
        )}
      </div>
    </AccountantLayout>
  );
}
