'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Plus, ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { AdminLayout } from '@/components/shared/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, FormField } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ExpenseCategory {
  id: string;
  name: string;
  isDefault: boolean;
  isSelected: boolean;
  isTaxDeductible: boolean;
  isCustom: boolean;
}

export default function ExpenseCategoriesPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<ExpenseCategory[]>([
    {
      id: '1',
      name: 'Capital Expenditure',
      isDefault: true,
      isSelected: true,
      isTaxDeductible: false,
      isCustom: false,
    },
    {
      id: '2',
      name: 'Operating Expenses',
      isDefault: true,
      isSelected: true,
      isTaxDeductible: true,
      isCustom: false,
    },
    {
      id: '3',
      name: 'Utilities',
      isDefault: true,
      isSelected: true,
      isTaxDeductible: true,
      isCustom: false,
    },
    {
      id: '4',
      name: 'Maintenance & Repairs',
      isDefault: true,
      isSelected: true,
      isTaxDeductible: true,
      isCustom: false,
    },
  ]);

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [customTaxDeductible, setCustomTaxDeductible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, isSelected: !cat.isSelected } : cat
      )
    );
  };

  const toggleTaxDeductible = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, isTaxDeductible: !cat.isTaxDeductible }
          : cat
      )
    );
  };

  const addCustomCategory = () => {
    if (!customCategoryName.trim()) return;

    const newCategory: ExpenseCategory = {
      id: Date.now().toString(),
      name: customCategoryName.trim(),
      isDefault: false,
      isSelected: true,
      isTaxDeductible: customTaxDeductible,
      isCustom: true,
    };

    setCategories((prev) => [...prev, newCategory]);
    setCustomCategoryName('');
    setCustomTaxDeductible(false);
    setIsAddingCustom(false);
  };

  const removeCustomCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Implement actual API call
      console.log(
        'Selected categories:',
        categories.filter((cat) => cat.isSelected)
      );

      // Navigate to next step
      router.push('/admin/onboarding/regional');
    } catch (error) {
      console.error('Failed to save categories:', error);
      alert('Failed to save categories. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/onboarding/firm');
  };

  const selectedCount = categories.filter((cat) => cat.isSelected).length;

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">Expense Categories Setup</h1>
            <p className="text-muted-foreground">
              Step 2 of 6 - Configure your expense tracking categories
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progress</span>
            <span className="text-admin-600 font-medium">Step 2 of 6</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-admin-500 h-2 rounded-full w-[33.33%]"></div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Expense Categories</span>
              </div>
              <span className="text-sm font-normal text-muted-foreground">
                {selectedCount} selected
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Default Categories */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Default Categories (Recommended)
                </p>

                {categories
                  .filter((cat) => cat.isDefault)
                  .map((category) => (
                    <div
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={cn(
                        'flex items-center justify-between p-4 border rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md',
                        category.isSelected
                          ? 'border-admin-300 bg-admin-100 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                            category.isSelected
                              ? 'border-admin-500 bg-admin-500'
                              : 'border-gray-300'
                          )}
                        >
                          {category.isSelected && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>

                        <span
                          className={cn(
                            'font-medium',
                            category.isSelected
                              ? 'text-admin-800'
                              : 'text-muted-foreground'
                          )}
                        >
                          {category.name}
                        </span>
                      </div>

                      {/* Tax Deductible Toggle */}
                      <div className="flex items-center space-x-2">
                        <span
                          className={cn(
                            'text-xs font-medium',
                            category.isSelected
                              ? 'text-admin-700'
                              : 'text-muted-foreground'
                          )}
                        >
                          Tax-Deductible:
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaxDeductible(category.id);
                          }}
                          disabled={!category.isSelected}
                          className={cn(
                            'relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200 border',
                            category.isTaxDeductible && category.isSelected
                              ? 'bg-admin-500 border-admin-600'
                              : category.isSelected
                                ? 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                                : 'bg-gray-100 border-gray-200',
                            !category.isSelected &&
                              'opacity-50 cursor-not-allowed'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-3 w-3 transform rounded-full transition-transform shadow-sm',
                              category.isTaxDeductible
                                ? 'translate-x-5 bg-white'
                                : 'translate-x-1 bg-white'
                            )}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Custom Categories */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Custom Categories
                  </p>

                  {!isAddingCustom && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddingCustom(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Custom Category
                    </Button>
                  )}
                </div>

                {/* Add Custom Category Form */}
                {isAddingCustom && (
                  <Card className="border-2 border-dashed border-admin-300">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <FormField label="Category Name" required>
                          <Input
                            type="text"
                            placeholder="e.g. Legal Fees, Insurance"
                            value={customCategoryName}
                            onChange={(e) =>
                              setCustomCategoryName(e.target.value)
                            }
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addCustomCategory();
                              }
                            }}
                          />
                        </FormField>

                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() =>
                              setCustomTaxDeductible(!customTaxDeductible)
                            }
                            className={cn(
                              'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                              customTaxDeductible
                                ? 'bg-admin-500'
                                : 'bg-gray-300'
                            )}
                          >
                            <span
                              className={cn(
                                'inline-block h-3 w-3 transform rounded-full bg-white transition-transform',
                                customTaxDeductible
                                  ? 'translate-x-5'
                                  : 'translate-x-1'
                              )}
                            />
                          </button>
                          <span className="text-sm">Tax-deductible</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={addCustomCategory}
                            disabled={!customCategoryName.trim()}
                          >
                            Add Category
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsAddingCustom(false);
                              setCustomCategoryName('');
                              setCustomTaxDeductible(false);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Custom Categories List */}
                {categories
                  .filter((cat) => cat.isCustom)
                  .map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 border rounded-lg border-admin-300 bg-admin-100 shadow-sm"
                    >
                      <div
                        onClick={() => toggleCategory(category.id)}
                        className="flex items-center space-x-3 flex-1 text-left cursor-pointer"
                      >
                        <div
                          className={cn(
                            'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                            category.isSelected
                              ? 'border-admin-500 bg-admin-500'
                              : 'border-gray-300'
                          )}
                        >
                          {category.isSelected && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>

                        <span className="font-medium text-admin-800">
                          {category.name}
                        </span>

                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Custom
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* Tax Deductible Toggle */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-admin-700">
                            Tax-Deductible:
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTaxDeductible(category.id);
                            }}
                            className={cn(
                              'relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-200 border',
                              category.isTaxDeductible
                                ? 'bg-admin-500 border-admin-600'
                                : 'bg-gray-200 border-gray-300 hover:bg-gray-300'
                            )}
                          >
                            <span
                              className={cn(
                                'inline-block h-3 w-3 transform rounded-full transition-transform shadow-sm bg-white',
                                category.isTaxDeductible
                                  ? 'translate-x-5'
                                  : 'translate-x-1'
                              )}
                            />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCustomCategory(category.id);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Summary */}
              {selectedCount > 0 && (
                <div className="bg-admin-50 border border-admin-200 rounded-lg p-4">
                  <h4 className="font-medium text-admin-800 mb-2">
                    Selected Categories Summary
                  </h4>
                  <div className="text-sm text-admin-700">
                    <p>
                      • {selectedCount} categories will be available for expense
                      tracking
                    </p>
                    <p>
                      •{' '}
                      {
                        categories.filter(
                          (cat) => cat.isSelected && cat.isTaxDeductible
                        ).length
                      }{' '}
                      categories marked as tax-deductible
                    </p>
                    <p>
                      • You can modify these settings later in the admin panel
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-6">
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting || selectedCount === 0}
                  size="lg"
                >
                  {isSubmitting ? 'Saving...' : 'Save & Continue'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
