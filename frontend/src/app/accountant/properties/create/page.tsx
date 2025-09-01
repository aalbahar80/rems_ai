'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  ArrowLeft,
  ArrowRight,
  MapPin,
  DollarSign,
  Users,
  Shield,
  Calendar,
  FileText,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AccountantLayout } from '@/components/accountant/AccountantLayout';
import { cn } from '@/lib/utils';

interface PropertyFormData {
  // Step 1: Basic Information
  code: string;
  name: string;
  location: string;
  address: string;
  type: 'residential' | 'commercial' | 'mixed-use' | 'land' | 'other';
  totalArea: string;
  constructionYear: string;
  planningPermit: string;

  // Step 2: Financial Information (Optional)
  purchaseCost: string;
  currentValuation: string;
  valuationDate: string;
  valuationMethod: 'income' | 'market' | 'cost';
  hasFinancing: boolean;

  // Step 3: Unit Configuration
  unitCreationMode: 'manual' | 'bulk';
  bulkUnits: {
    type: string;
    count: number;
    startNumber: number;
    bedrooms: number;
    bathrooms: number;
    livingRooms: number;
    area: string;
    baseRent: string;
    parkingSpaces: number;
  };

  // Step 4: Ownership Assignment (Optional)
  assignOwnership: boolean;
  selectedOwnerId: string;
  ownershipPercentage: number;
}

const kuwaitLocations = [
  'Kuwait City',
  'Hawalli',
  'Farwaniya',
  'Mubarak Al-Kabeer',
  'Ahmadi',
  'Jahra',
  'Salmiya',
  'Mangaf',
  'Fahaheel',
  'Sabah Al-Salem',
];

const propertyTypes = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'mixed-use', label: 'Mixed-use' },
  { value: 'land', label: 'Land' },
  { value: 'other', label: 'Other' },
];

const unitTypes = [
  'Apartment',
  'Studio',
  'Villa',
  'Office',
  'Shop',
  'Warehouse',
  'Storage',
  'Other',
];

const valuationMethods = [
  { value: 'income', label: 'Income Approach' },
  { value: 'market', label: 'Market Comparison' },
  { value: 'cost', label: 'Cost Approach' },
];

// Mock owners data - will be replaced with API call
const mockOwners = [
  {
    id: '1',
    name: 'Alexander Richardson',
    email: 'alexander@richardson-properties.com',
  },
  { id: '2', name: 'Ahmed Al-Sabah', email: 'ahmed@alsabah-investments.com' },
  { id: '3', name: 'Sarah Al-Rasheed', email: 'sarah@alrasheed-group.com' },
];

export default function CreatePropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    code: '',
    name: '',
    location: '',
    address: '',
    type: 'residential',
    totalArea: '',
    constructionYear: '',
    planningPermit: '',
    purchaseCost: '',
    currentValuation: '',
    valuationDate: '',
    valuationMethod: 'market',
    hasFinancing: false,
    unitCreationMode: 'bulk',
    bulkUnits: {
      type: 'Apartment',
      count: 5,
      startNumber: 101,
      bedrooms: 2,
      bathrooms: 2,
      livingRooms: 1,
      area: '85.5',
      baseRent: '450',
      parkingSpaces: 1,
    },
    assignOwnership: false,
    selectedOwnerId: '',
    ownershipPercentage: 100,
  });

  const updateFormData = (field: keyof PropertyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateBulkUnits = (
    field: keyof PropertyFormData['bulkUnits'],
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      bulkUnits: { ...prev.bulkUnits, [field]: value },
    }));
  };

  const generateUnitNumbers = () => {
    const numbers = [];
    for (let i = 0; i < formData.bulkUnits.count; i++) {
      numbers.push(formData.bulkUnits.startNumber + i);
    }
    return numbers;
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.code &&
          formData.name &&
          formData.location &&
          formData.address &&
          formData.type
        );
      case 2:
        return true; // Optional step
      case 3:
        if (formData.unitCreationMode === 'bulk') {
          return formData.bulkUnits.type && formData.bulkUnits.count > 0;
        }
        return true;
      case 4:
        if (formData.assignOwnership) {
          return formData.selectedOwnerId && formData.ownershipPercentage > 0;
        }
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/accountant/properties');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Property created:', formData);

      // Navigate back to properties list
      router.push('/accountant/properties');
    } catch (error) {
      console.error('Failed to create property:', error);
      alert('Failed to create property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Basic Property Information
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Enter the essential details about your property
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Property Code *
          </label>
          <Input
            placeholder="e.g., Z1, AHS1"
            value={formData.code}
            onChange={(e) => updateFormData('code', e.target.value)}
            className="uppercase"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Property Name *
          </label>
          <Input
            placeholder="e.g., Richardson Tower One"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location *
          </label>
          <select
            value={formData.location}
            onChange={(e) => updateFormData('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          >
            <option value="">Select location</option>
            {kuwaitLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Property Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => updateFormData('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          >
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Address *
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => updateFormData('address', e.target.value)}
          placeholder="Full address including block, street, and area"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Total Area (sqm)
          </label>
          <Input
            placeholder="e.g., 1032.00"
            value={formData.totalArea}
            onChange={(e) => updateFormData('totalArea', e.target.value)}
            type="number"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Construction Year
          </label>
          <Input
            placeholder="e.g., 2012"
            value={formData.constructionYear}
            onChange={(e) => updateFormData('constructionYear', e.target.value)}
            type="number"
            min="1900"
            max="2030"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Planning Permit
          </label>
          <Input
            placeholder="e.g., PM/19821"
            value={formData.planningPermit}
            onChange={(e) => updateFormData('planningPermit', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Financial Information (Optional)
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Add financial details and valuation information if available
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Purchase/Construction Cost (KWD)
          </label>
          <Input
            placeholder="0"
            value={formData.purchaseCost}
            onChange={(e) => updateFormData('purchaseCost', e.target.value)}
            type="number"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Valuation (KWD)
          </label>
          <Input
            placeholder="e.g., 1571785.71"
            value={formData.currentValuation}
            onChange={(e) => updateFormData('currentValuation', e.target.value)}
            type="number"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Valuation Date
          </label>
          <Input
            value={formData.valuationDate}
            onChange={(e) => updateFormData('valuationDate', e.target.value)}
            type="date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Valuation Method
          </label>
          <select
            value={formData.valuationMethod}
            onChange={(e) => updateFormData('valuationMethod', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {valuationMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasFinancing"
            checked={formData.hasFinancing}
            onChange={(e) => updateFormData('hasFinancing', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="hasFinancing"
            className="ml-2 text-sm text-blue-800 dark:text-blue-200"
          >
            This property has financing/mortgage arrangements
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Unit Configuration
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Set up the rental units within this property
        </p>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Creation Method
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateFormData('unitCreationMode', 'bulk')}
            className={cn(
              'p-4 border rounded-lg text-left transition-all',
              formData.unitCreationMode === 'bulk'
                ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-600'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
            )}
          >
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                  formData.unitCreationMode === 'bulk'
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300'
                )}
              >
                {formData.unitCreationMode === 'bulk' && (
                  <Check className="h-2.5 w-2.5 text-white" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Bulk Creation
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create multiple similar units quickly
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateFormData('unitCreationMode', 'manual')}
            className={cn(
              'p-4 border rounded-lg text-left transition-all',
              formData.unitCreationMode === 'manual'
                ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-600'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
            )}
          >
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                  formData.unitCreationMode === 'manual'
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300'
                )}
              >
                {formData.unitCreationMode === 'manual' && (
                  <Check className="h-2.5 w-2.5 text-white" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Manual Entry
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add units one by one with custom details
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {formData.unitCreationMode === 'bulk' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit Type
              </label>
              <select
                value={formData.bulkUnits.type}
                onChange={(e) => updateBulkUnits('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {unitTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number to Create
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateBulkUnits(
                      'count',
                      Math.max(1, formData.bulkUnits.count - 1)
                    )
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold text-gray-900 dark:text-white w-12 text-center">
                  {formData.bulkUnits.count}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateBulkUnits('count', formData.bulkUnits.count + 1)
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Starting Unit Number
              </label>
              <Input
                value={formData.bulkUnits.startNumber.toString()}
                onChange={(e) =>
                  updateBulkUnits(
                    'startNumber',
                    parseInt(e.target.value) || 101
                  )
                }
                type="number"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Unit Numbers Preview
            </p>
            <div className="flex flex-wrap gap-2">
              {generateUnitNumbers().map((num, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-full text-sm font-medium"
                >
                  {num}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Unit Specifications
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bedrooms
                </label>
                <Input
                  value={formData.bulkUnits.bedrooms.toString()}
                  onChange={(e) =>
                    updateBulkUnits('bedrooms', parseInt(e.target.value) || 0)
                  }
                  type="number"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bathrooms
                </label>
                <Input
                  value={formData.bulkUnits.bathrooms.toString()}
                  onChange={(e) =>
                    updateBulkUnits('bathrooms', parseInt(e.target.value) || 0)
                  }
                  type="number"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Living Rooms
                </label>
                <Input
                  value={formData.bulkUnits.livingRooms.toString()}
                  onChange={(e) =>
                    updateBulkUnits(
                      'livingRooms',
                      parseInt(e.target.value) || 0
                    )
                  }
                  type="number"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Parking Spaces
                </label>
                <Input
                  value={formData.bulkUnits.parkingSpaces.toString()}
                  onChange={(e) =>
                    updateBulkUnits(
                      'parkingSpaces',
                      parseInt(e.target.value) || 0
                    )
                  }
                  type="number"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Area per Unit (sqm)
              </label>
              <Input
                placeholder="e.g., 85.5"
                value={formData.bulkUnits.area}
                onChange={(e) => updateBulkUnits('area', e.target.value)}
                type="number"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Base Rent per Unit (KWD)
              </label>
              <Input
                placeholder="e.g., 450"
                value={formData.bulkUnits.baseRent}
                onChange={(e) => updateBulkUnits('baseRent', e.target.value)}
                type="number"
                step="0.01"
              />
            </div>
          </div>
        </div>
      )}

      {formData.unitCreationMode === 'manual' && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Manual unit creation interface will be available here
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add First Unit
          </Button>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Property Ownership (Optional)
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Assign ownership to specific owners or keep as firm property
        </p>
      </div>

      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-200">
              Current Ownership Status
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              🏢 Owned by Firm (100%)
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
            <span className="text-sm font-bold text-blue-800 dark:text-blue-200">
              100%
            </span>
          </div>
        </div>

        <div className="text-sm text-blue-700 dark:text-blue-300">
          Properties without assigned owners are automatically owned by your
          firm. You can assign ownership later when owner information is
          available.
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="assignOwnership"
            checked={formData.assignOwnership}
            onChange={(e) =>
              updateFormData('assignOwnership', e.target.checked)
            }
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label
            htmlFor="assignOwnership"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Assign to specific owner
          </label>
        </div>

        {formData.assignOwnership && (
          <div className="space-y-4">
            {mockOwners.length > 0 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Owner
                </label>
                <select
                  value={formData.selectedOwnerId}
                  onChange={(e) =>
                    updateFormData('selectedOwnerId', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select an owner...</option>
                  {mockOwners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                  No owners available
                </p>
                <p className="text-sm text-red-600 dark:text-red-300">
                  You need to create owners first before you can assign
                  ownership.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => router.push('/accountant/owners/create')}
                >
                  Create Owner First
                </Button>
              </div>
            )}

            {formData.selectedOwnerId && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ownership Percentage
                  </label>
                  <Input
                    value={formData.ownershipPercentage.toString()}
                    onChange={(e) =>
                      updateFormData(
                        'ownershipPercentage',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!formData.assignOwnership && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Property will remain under firm ownership (100%)
          </p>
        </div>
      )}
    </div>
  );

  const steps = [
    { number: 1, title: 'Basic Information', icon: Building2 },
    { number: 2, title: 'Financial Details', icon: DollarSign },
    { number: 3, title: 'Unit Configuration', icon: Users },
    { number: 4, title: 'Ownership Assignment', icon: Shield },
  ];

  return (
    <AccountantLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Property
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Step {currentStep} of 4 - {steps[currentStep - 1].title}
              </p>
            </div>
          </div>
        </div>
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;

              return (
                <div key={step.number} className="flex items-center">
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                      isActive && 'border-green-500 bg-green-500 text-white',
                      isCompleted && 'border-green-500 bg-green-500 text-white',
                      !isActive &&
                        !isCompleted &&
                        'border-gray-300 text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>

                  <div
                    className={cn(
                      'ml-3 flex-1',
                      index < steps.length - 1 &&
                        'border-r border-gray-200 dark:border-gray-600 pr-8'
                    )}
                  >
                    <p
                      className={cn(
                        'text-sm font-medium',
                        isActive && 'text-green-600',
                        isCompleted && 'text-green-600',
                        !isActive && !isCompleted && 'text-gray-500'
                      )}
                    >
                      Step {step.number}
                    </p>
                    <p
                      className={cn(
                        'text-sm',
                        isActive && 'text-gray-900 dark:text-white',
                        isCompleted && 'text-gray-700 dark:text-gray-300',
                        !isActive && !isCompleted && 'text-gray-500'
                      )}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardContent className="p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t dark:border-gray-700">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </Button>

              {currentStep === 2 && (
                <Button variant="ghost" onClick={handleNext}>
                  Skip This Step
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}

              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceedToNextStep()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Save & Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceedToNextStep() || isSubmitting}
                  loading={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting
                    ? 'Creating Property...'
                    : 'Complete Property Setup'}
                  <Check className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AccountantLayout>
  );
}
