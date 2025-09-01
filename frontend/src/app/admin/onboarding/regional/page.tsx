'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Clock,
  Calendar,
  Hash,
  Check,
} from 'lucide-react';
import { AdminLayout } from '@/components/shared/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RegionalSettings {
  language: string;
  secondaryLanguage?: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  numberFormat: string;
  firstDayOfWeek: 'Sunday' | 'Monday';
  enableRTL: boolean;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

interface Timezone {
  value: string;
  label: string;
  offset: string;
  popular?: boolean;
}

export default function RegionalSettingsPage() {
  const router = useRouter();

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇰🇼',
      rtl: true,
    },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  ];

  const timezones: Timezone[] = [
    {
      value: 'Asia/Kuwait',
      label: 'Kuwait Time (AST)',
      offset: '+03:00',
      popular: true,
    },
    {
      value: 'Asia/Dubai',
      label: 'Gulf Standard Time',
      offset: '+04:00',
      popular: true,
    },
    {
      value: 'Asia/Riyadh',
      label: 'Arabia Standard Time',
      offset: '+03:00',
      popular: true,
    },
    { value: 'UTC', label: 'Coordinated Universal Time', offset: '+00:00' },
    {
      value: 'America/New_York',
      label: 'Eastern Time',
      offset: '-05:00',
    },
    { value: 'Europe/London', label: 'Greenwich Mean Time', offset: '+00:00' },
  ];

  const dateFormats = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '31/12/2025' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '12/31/2025' },
    { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD', example: '2025/12/31' },
    { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY', example: '31-12-2025' },
  ];

  const numberFormats = [
    { value: 'en-US', label: '1,234.56 (US)', example: '1,234.56' },
    { value: 'en-EU', label: '1.234,56 (EU)', example: '1.234,56' },
    { value: 'ar-KW', label: '١٬٢٣٤٫٥٦ (Arabic)', example: '١٬٢٣٤٫٥٦' },
    { value: 'en-IN', label: '1,23,456 (Indian)', example: '1,23,456' },
  ];

  const [settings, setSettings] = useState<RegionalSettings>({
    language: 'en',
    secondaryLanguage: 'ar',
    timezone: 'Asia/Kuwait',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: 'en-US',
    firstDayOfWeek: 'Sunday',
    enableRTL: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateSetting = <K extends keyof RegionalSettings>(
    key: K,
    value: RegionalSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Auto-enable RTL for Arabic
    if (key === 'language' && value === 'ar') {
      setSettings((prev) => ({ ...prev, enableRTL: true }));
    } else if (key === 'language' && value !== 'ar') {
      setSettings((prev) => ({ ...prev, enableRTL: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Regional settings:', settings);

      // Navigate to next step
      router.push('/admin/onboarding/financial');
    } catch (error) {
      console.error('Failed to save regional settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/onboarding/expenses');
  };

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
            <h1 className="text-2xl font-bold">Language & Regional Settings</h1>
            <p className="text-muted-foreground">
              Step 3 of 6 - Configure localization and regional preferences
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progress</span>
            <span className="text-admin-600 font-medium">Step 3 of 6</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-admin-500 h-2 rounded-full w-[50%]"></div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Language Configuration</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-3">Primary Language</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {languages.map((language) => (
                    <div
                      key={language.code}
                      onClick={() => updateSetting('language', language.code)}
                      className={cn(
                        'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200',
                        settings.language === language.code
                          ? 'border-admin-300 bg-admin-100 dark:bg-admin-900/20 dark:border-admin-600'
                          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{language.flag}</span>
                        <div>
                          <p
                            className={cn(
                              'text-sm font-medium',
                              settings.language === language.code
                                ? 'dark:text-admin-100'
                                : 'dark:text-gray-100'
                            )}
                          >
                            {language.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {language.nativeName}
                          </p>
                        </div>
                      </div>

                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                          settings.language === language.code
                            ? 'border-admin-500 bg-admin-500'
                            : 'border-gray-300'
                        )}
                      >
                        {settings.language === language.code && (
                          <Check className="h-2.5 w-2.5 text-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">
                  Secondary Language (Optional)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {languages
                    .filter((lang) => lang.code !== settings.language)
                    .map((language) => (
                      <div
                        key={language.code}
                        onClick={() =>
                          updateSetting(
                            'secondaryLanguage',
                            settings.secondaryLanguage === language.code
                              ? undefined
                              : language.code
                          )
                        }
                        className={cn(
                          'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200',
                          settings.secondaryLanguage === language.code
                            ? 'border-admin-300 bg-admin-100 dark:bg-admin-900/20 dark:border-admin-600'
                            : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{language.flag}</span>
                          <div>
                            <p
                              className={cn(
                                'text-sm font-medium',
                                settings.secondaryLanguage === language.code
                                  ? 'dark:text-admin-100'
                                  : 'dark:text-gray-100'
                              )}
                            >
                              {language.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {language.nativeName}
                            </p>
                          </div>
                        </div>

                        <div
                          className={cn(
                            'w-4 h-4 rounded border-2 flex items-center justify-center',
                            settings.secondaryLanguage === language.code
                              ? 'border-admin-500 bg-admin-500'
                              : 'border-gray-300'
                          )}
                        >
                          {settings.secondaryLanguage === language.code && (
                            <Check className="h-2.5 w-2.5 text-white" />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* RTL Support */}
              {(settings.language === 'ar' ||
                settings.secondaryLanguage === 'ar') && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200">
                        Right-to-Left (RTL) Support
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-300">
                        Enable RTL layout for Arabic text display
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateSetting('enableRTL', !settings.enableRTL)
                      }
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-2',
                        settings.enableRTL
                          ? 'bg-blue-500 border-blue-600'
                          : 'bg-gray-300 border-gray-400 dark:bg-gray-600 dark:border-gray-500'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          settings.enableRTL ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date & Time Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Date & Time Configuration</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-3">Timezone</p>
                <div className="space-y-2">
                  {timezones.map((timezone) => (
                    <div
                      key={timezone.value}
                      onClick={() => updateSetting('timezone', timezone.value)}
                      className={cn(
                        'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all',
                        settings.timezone === timezone.value
                          ? 'border-admin-300 bg-admin-100 dark:bg-admin-900/20 dark:border-admin-600'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                      )}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <p
                            className={cn(
                              'text-sm font-medium',
                              settings.timezone === timezone.value
                                ? 'dark:text-admin-100'
                                : 'dark:text-gray-100'
                            )}
                          >
                            {timezone.label}
                          </p>
                          {timezone.popular && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {timezone.offset} • {timezone.value}
                        </p>
                      </div>

                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                          settings.timezone === timezone.value
                            ? 'border-admin-500 bg-admin-500'
                            : 'border-gray-300'
                        )}
                      >
                        {settings.timezone === timezone.value && (
                          <Check className="h-2.5 w-2.5 text-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-3">Date Format</p>
                  <div className="space-y-2">
                    {dateFormats.map((format) => (
                      <div
                        key={format.value}
                        onClick={() =>
                          updateSetting('dateFormat', format.value)
                        }
                        className={cn(
                          'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all',
                          settings.dateFormat === format.value
                            ? 'border-admin-300 bg-admin-100 dark:bg-admin-900/20 dark:border-admin-600'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                        )}
                      >
                        <div>
                          <p
                            className={cn(
                              'text-sm font-medium',
                              settings.dateFormat === format.value
                                ? 'dark:text-admin-100'
                                : 'dark:text-gray-100'
                            )}
                          >
                            {format.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format.example}
                          </p>
                        </div>

                        <div
                          className={cn(
                            'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                            settings.dateFormat === format.value
                              ? 'border-admin-500 bg-admin-500'
                              : 'border-gray-300'
                          )}
                        >
                          {settings.dateFormat === format.value && (
                            <Check className="h-2.5 w-2.5 text-white" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Time Format</p>
                  <div className="space-y-2">
                    <div
                      onClick={() => updateSetting('timeFormat', '12h')}
                      className={cn(
                        'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all',
                        settings.timeFormat === '12h'
                          ? 'border-admin-300 bg-admin-100 dark:bg-admin-900/20 dark:border-admin-600'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                      )}
                    >
                      <div>
                        <p
                          className={cn(
                            'text-sm font-medium',
                            settings.timeFormat === '12h'
                              ? 'dark:text-admin-100'
                              : 'dark:text-gray-100'
                          )}
                        >
                          12-Hour Format
                        </p>
                        <p className="text-xs text-muted-foreground">2:30 PM</p>
                      </div>

                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                          settings.timeFormat === '12h'
                            ? 'border-admin-500 bg-admin-500'
                            : 'border-gray-300'
                        )}
                      >
                        {settings.timeFormat === '12h' && (
                          <Check className="h-2.5 w-2.5 text-white" />
                        )}
                      </div>
                    </div>

                    <div
                      onClick={() => updateSetting('timeFormat', '24h')}
                      className={cn(
                        'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all',
                        settings.timeFormat === '24h'
                          ? 'border-admin-300 bg-admin-100 dark:bg-admin-900/20 dark:border-admin-600'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                      )}
                    >
                      <div>
                        <p
                          className={cn(
                            'text-sm font-medium',
                            settings.timeFormat === '24h'
                              ? 'dark:text-admin-100'
                              : 'dark:text-gray-100'
                          )}
                        >
                          24-Hour Format
                        </p>
                        <p className="text-xs text-muted-foreground">14:30</p>
                      </div>

                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                          settings.timeFormat === '24h'
                            ? 'border-admin-500 bg-admin-500'
                            : 'border-gray-300'
                        )}
                      >
                        {settings.timeFormat === '24h' && (
                          <Check className="h-2.5 w-2.5 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Number Format & Locale */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hash className="h-5 w-5" />
                <span>Number & Locale Settings</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-3">Number Format</p>
                <div className="space-y-2">
                  {numberFormats.map((format) => (
                    <div
                      key={format.value}
                      onClick={() =>
                        updateSetting('numberFormat', format.value)
                      }
                      className={cn(
                        'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all',
                        settings.numberFormat === format.value
                          ? 'border-admin-300 bg-admin-100 dark:bg-admin-900/20 dark:border-admin-600'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                      )}
                    >
                      <div>
                        <p
                          className={cn(
                            'text-sm font-medium',
                            settings.numberFormat === format.value
                              ? 'dark:text-admin-100'
                              : 'dark:text-gray-100'
                          )}
                        >
                          {format.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Example: {format.example}
                        </p>
                      </div>

                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                          settings.numberFormat === format.value
                            ? 'border-admin-500 bg-admin-500'
                            : 'border-gray-300'
                        )}
                      >
                        {settings.numberFormat === format.value && (
                          <Check className="h-2.5 w-2.5 text-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">Week Configuration</p>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => updateSetting('firstDayOfWeek', 'Sunday')}
                    className={cn(
                      'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all',
                      settings.firstDayOfWeek === 'Sunday'
                        ? 'border-admin-300 bg-admin-100 dark:bg-admin-900/20 dark:border-admin-600'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                    )}
                  >
                    <div>
                      <p
                        className={cn(
                          'text-sm font-medium',
                          settings.firstDayOfWeek === 'Sunday'
                            ? 'dark:text-admin-100'
                            : 'dark:text-gray-100'
                        )}
                      >
                        Sunday First
                      </p>
                      <p className="text-xs text-muted-foreground">
                        US/Kuwait Standard
                      </p>
                    </div>

                    <div
                      className={cn(
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                        settings.firstDayOfWeek === 'Sunday'
                          ? 'border-admin-500 bg-admin-500'
                          : 'border-gray-300'
                      )}
                    >
                      {settings.firstDayOfWeek === 'Sunday' && (
                        <Check className="h-2.5 w-2.5 text-white" />
                      )}
                    </div>
                  </div>

                  <div
                    onClick={() => updateSetting('firstDayOfWeek', 'Monday')}
                    className={cn(
                      'flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all',
                      settings.firstDayOfWeek === 'Monday'
                        ? 'border-admin-300 bg-admin-100 dark:bg-admin-900/20 dark:border-admin-600'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                    )}
                  >
                    <div>
                      <p
                        className={cn(
                          'text-sm font-medium',
                          settings.firstDayOfWeek === 'Monday'
                            ? 'dark:text-admin-100'
                            : 'dark:text-gray-100'
                        )}
                      >
                        Monday First
                      </p>
                      <p className="text-xs text-muted-foreground">
                        International Standard
                      </p>
                    </div>

                    <div
                      className={cn(
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                        settings.firstDayOfWeek === 'Monday'
                          ? 'border-admin-500 bg-admin-500'
                          : 'border-gray-300'
                      )}
                    >
                      {settings.firstDayOfWeek === 'Monday' && (
                        <Check className="h-2.5 w-2.5 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-admin-50 border-admin-200 dark:bg-admin-900/10 dark:border-admin-800">
            <CardContent className="p-4">
              <h4 className="font-medium text-admin-800 dark:text-admin-200 mb-3">
                Regional Settings Summary
              </h4>
              <div className="space-y-2 text-sm text-admin-700 dark:text-admin-300">
                <div className="flex justify-between">
                  <span>Primary Language:</span>
                  <span className="font-medium">
                    {languages.find((l) => l.code === settings.language)?.name}
                  </span>
                </div>
                {settings.secondaryLanguage && (
                  <div className="flex justify-between">
                    <span>Secondary Language:</span>
                    <span className="font-medium">
                      {
                        languages.find(
                          (l) => l.code === settings.secondaryLanguage
                        )?.name
                      }
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Timezone:</span>
                  <span className="font-medium">
                    {
                      timezones.find((t) => t.value === settings.timezone)
                        ?.label
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date Format:</span>
                  <span className="font-medium">
                    {
                      dateFormats.find((f) => f.value === settings.dateFormat)
                        ?.example
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time Format:</span>
                  <span className="font-medium">
                    {settings.timeFormat === '12h' ? '12-hour' : '24-hour'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Number Format:</span>
                  <span className="font-medium">
                    {
                      numberFormats.find(
                        (f) => f.value === settings.numberFormat
                      )?.example
                    }
                  </span>
                </div>
              </div>
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
