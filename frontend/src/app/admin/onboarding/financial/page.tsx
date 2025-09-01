'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Calculator,
  Clock,
  Percent,
  TrendingUp,
  Check,
} from 'lucide-react';
import { AdminLayout } from '@/components/shared/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, FormField } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  popular?: boolean;
}

interface FinancialSettings {
  primaryCurrency: string;
  additionalCurrencies: string[];
  exchangeRates: Record<string, number>;
  lateFees: {
    type: 'fixed' | 'percentage';
    fixedAmount: number;
    percentageRate: number;
    gracePeriod: number;
    maxLateFee: number;
  };
  taxSettings: {
    vatRate: number;
    includeTaxInRent: boolean;
  };
}

export default function FinancialSettingsPage() {
  const router = useRouter();

  const currencies: Currency[] = [
    {
      code: 'KWD',
      name: 'Kuwaiti Dinar',
      symbol: 'د.ك',
      flag: '🇰🇼',
      popular: true,
    },
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', popular: true },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', popular: true },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      flag: '🇬🇧',
      popular: true,
    },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'ر.س', flag: '🇸🇦' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', flag: '🇶🇦' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: 'د.ب', flag: '🇧🇭' },
  ];

  const [settings, setSettings] = useState<FinancialSettings>({
    primaryCurrency: 'KWD',
    additionalCurrencies: ['USD'],
    exchangeRates: {
      USD: 3.25,
      EUR: 3.55,
      GBP: 4.12,
    },
    lateFees: {
      type: 'percentage',
      fixedAmount: 50,
      percentageRate: 5,
      gracePeriod: 7,
      maxLateFee: 200,
    },
    taxSettings: {
      vatRate: 0,
      includeTaxInRent: false,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCurrency = (currencyCode: string) => {
    if (currencyCode === settings.primaryCurrency) return;

    setSettings((prev) => ({
      ...prev,
      additionalCurrencies: prev.additionalCurrencies.includes(currencyCode)
        ? prev.additionalCurrencies.filter((code) => code !== currencyCode)
        : [...prev.additionalCurrencies, currencyCode],
    }));
  };

  const updateExchangeRate = (currencyCode: string, rate: number) => {
    setSettings((prev) => ({
      ...prev,
      exchangeRates: {
        ...prev.exchangeRates,
        [currencyCode]: rate,
      },
    }));
  };

  const updateLateFees = (
    field: keyof typeof settings.lateFees,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      lateFees: {
        ...prev.lateFees,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Financial settings:', settings);

      router.push('/admin/onboarding/rules');
    } catch (error) {
      console.error('Failed to save financial settings:', error);
      alert('Failed to save financial settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/onboarding/regional');
  };

  const selectedCurrencies = [
    settings.primaryCurrency,
    ...settings.additionalCurrencies,
  ];

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              Currency & Financial Settings
            </h1>
            <p className="text-muted-foreground">
              Step 4 of 6 - Configure currencies, exchange rates, and late fees
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progress</span>
            <span className="text-admin-600 font-medium">Step 4 of 6</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-admin-500 h-2 rounded-full w-[66.66%]"></div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Currency Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Currency Configuration</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-3">Primary Currency</p>
                <div className="p-4 border rounded-lg bg-admin-50 border-admin-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🇰🇼</span>
                      <div>
                        <p className="font-medium">Kuwaiti Dinar (KWD)</p>
                        <p className="text-sm text-muted-foreground">
                          Primary currency for all transactions
                        </p>
                      </div>
                    </div>
                    <Check className="h-5 w-5 text-admin-600" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">
                  Additional Currencies
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currencies
                    .filter(
                      (currency) => currency.code !== settings.primaryCurrency
                    )
                    .map((currency) => (
                      <div
                        key={currency.code}
                        onClick={() => toggleCurrency(currency.code)}
                        className={cn(
                          'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200',
                          settings.additionalCurrencies.includes(currency.code)
                            ? 'border-admin-300 bg-admin-100 dark:bg-admin-900/20 dark:border-admin-600 dark:text-admin-100'
                            : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{currency.flag}</span>
                          <div>
                            <p
                              className={cn(
                                'text-sm font-medium',
                                settings.additionalCurrencies.includes(
                                  currency.code
                                )
                                  ? 'dark:text-admin-100'
                                  : 'dark:text-gray-100'
                              )}
                            >
                              {currency.code}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {currency.name}
                            </p>
                          </div>
                        </div>

                        <div
                          className={cn(
                            'w-4 h-4 rounded border-2 flex items-center justify-center',
                            settings.additionalCurrencies.includes(
                              currency.code
                            )
                              ? 'border-admin-500 bg-admin-500'
                              : 'border-gray-300'
                          )}
                        >
                          {settings.additionalCurrencies.includes(
                            currency.code
                          ) && <Check className="h-2.5 w-2.5 text-white" />}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Rates */}
          {settings.additionalCurrencies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Exchange Rates</span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Set exchange rates from KWD to other currencies
                  </p>

                  {settings.additionalCurrencies.map((currencyCode) => {
                    const currency = currencies.find(
                      (c) => c.code === currencyCode
                    );
                    if (!currency) return null;

                    return (
                      <div
                        key={currencyCode}
                        className="flex items-center space-x-4 p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{currency.flag}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium">1 KWD = </p>
                            <p className="text-xs text-muted-foreground">
                              {currency.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex-1 max-w-32">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={settings.exchangeRates[currencyCode] || ''}
                            onChange={(e) =>
                              updateExchangeRate(
                                currencyCode,
                                parseFloat(e.target.value) || 0
                              )
                            }
                            placeholder="0.00"
                          />
                        </div>

                        <div className="text-sm font-medium min-w-0">
                          {currency.symbol} {currency.code}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Late Fees Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Late Fee Configuration</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-3">Late Fee Type</p>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => updateLateFees('type', 'fixed')}
                    className={cn(
                      'p-3 border rounded-lg cursor-pointer transition-all',
                      settings.lateFees.type === 'fixed'
                        ? 'border-admin-300 bg-admin-100'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Calculator className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Fixed Amount</p>
                        <p className="text-xs text-muted-foreground">
                          Same fee for all late payments
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => updateLateFees('type', 'percentage')}
                    className={cn(
                      'p-3 border rounded-lg cursor-pointer transition-all',
                      settings.lateFees.type === 'percentage'
                        ? 'border-admin-300 bg-admin-100'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Percent className="h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Percentage</p>
                        <p className="text-xs text-muted-foreground">
                          Percentage of rent amount
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {settings.lateFees.type === 'fixed' ? (
                  <FormField label="Fixed Late Fee Amount" required>
                    <Input
                      type="number"
                      placeholder="50"
                      value={settings.lateFees.fixedAmount}
                      onChange={(e) =>
                        updateLateFees(
                          'fixedAmount',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      min="0"
                      step="0.01"
                    />
                  </FormField>
                ) : (
                  <FormField label="Late Fee Percentage" required>
                    <Input
                      type="number"
                      placeholder="5"
                      value={settings.lateFees.percentageRate}
                      onChange={(e) =>
                        updateLateFees(
                          'percentageRate',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </FormField>
                )}

                <FormField label="Grace Period (Days)" required>
                  <Input
                    type="number"
                    placeholder="7"
                    value={settings.lateFees.gracePeriod}
                    onChange={(e) =>
                      updateLateFees(
                        'gracePeriod',
                        parseInt(e.target.value) || 0
                      )
                    }
                    min="0"
                  />
                </FormField>
              </div>

              <FormField label="Maximum Late Fee (KWD)" required>
                <Input
                  type="number"
                  placeholder="200"
                  value={settings.lateFees.maxLateFee}
                  onChange={(e) =>
                    updateLateFees(
                      'maxLateFee',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  min="0"
                  step="0.01"
                  className="max-w-48"
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6">
            <Button type="button" variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
