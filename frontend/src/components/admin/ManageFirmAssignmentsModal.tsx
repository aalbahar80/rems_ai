'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Trash2,
  AlertTriangle,
  Users,
  Shield,
  Crown,
  Star,
  Save,
  X,
} from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient, handleApiError } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface ManageFirmAssignmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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
  firm_assignments?: FirmAssignment[];
  settings?: {
    full_name?: string;
    first_name?: string;
    last_name?: string;
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

interface Firm {
  firm_id: number;
  firm_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface NewAssignment {
  firm_id: number;
  role_in_firm: string;
  access_level: string;
  is_primary_firm: boolean;
}

const FormField = ({
  label,
  required = false,
  children,
  error,
  description,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  description?: string;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground flex items-center space-x-1">
      <span>{label}</span>
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {description && (
      <p className="text-xs text-muted-foreground">{description}</p>
    )}
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
);

export function ManageFirmAssignmentsModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: ManageFirmAssignmentsModalProps) {
  const [loading, setLoading] = useState(false);
  const [firms, setFirms] = useState<Firm[]>([]);
  const [assignments, setAssignments] = useState<FirmAssignment[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState<NewAssignment>({
    firm_id: 0,
    role_in_firm: 'member',
    access_level: 'standard',
    is_primary_firm: false,
  });
  const [assignmentErrors, setAssignmentErrors] = useState<
    Record<string, string>
  >({});
  const [removingAssignments, setRemovingAssignments] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (isOpen && user) {
      loadFirms();
      setAssignments(user.firm_assignments || []);
    }
  }, [isOpen, user]);

  const loadFirms = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{
        success: boolean;
        data: { firms: Firm[] };
      }>('/firms');

      if (response.success) {
        setFirms(response.data.firms.filter((f) => f.is_active));
      }
    } catch (error) {
      console.error('Failed to load firms:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateNewAssignment = (): boolean => {
    const errors: Record<string, string> = {};

    if (!newAssignment.firm_id) {
      errors.firm_id = 'Please select a firm';
    } else if (assignments.some((a) => a.firm_id === newAssignment.firm_id)) {
      errors.firm_id = 'User is already assigned to this firm';
    }

    if (!newAssignment.role_in_firm) {
      errors.role_in_firm = 'Role is required';
    }

    if (
      newAssignment.is_primary_firm &&
      assignments.some((a) => a.is_primary_firm)
    ) {
      errors.is_primary_firm = 'User can only have one primary firm';
    }

    setAssignmentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAssignment = async () => {
    if (!user || !validateNewAssignment()) return;

    setLoading(true);
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
      }>(`/users/${user.user_id}/assign-firm`, newAssignment);

      if (response.success) {
        // Add the new assignment to the local state
        const selectedFirm = firms.find(
          (f) => f.firm_id === newAssignment.firm_id
        );
        if (selectedFirm) {
          const newAssignmentData: FirmAssignment = {
            firm_id: newAssignment.firm_id,
            firm_name: selectedFirm.firm_name,
            role_in_firm: newAssignment.role_in_firm,
            access_level: newAssignment.access_level,
            is_primary_firm: newAssignment.is_primary_firm,
            assigned_at: new Date().toISOString(),
          };
          setAssignments((prev) => [...prev, newAssignmentData]);
        }

        // Reset form
        setNewAssignment({
          firm_id: 0,
          role_in_firm: 'member',
          access_level: 'standard',
          is_primary_firm: false,
        });
        setShowAddForm(false);
        setAssignmentErrors({});
      }
    } catch (error: any) {
      const errorData = handleApiError(error);
      setAssignmentErrors({ general: errorData.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAssignment = async (firmId: number) => {
    if (!user) return;

    setRemovingAssignments((prev) => new Set(prev).add(firmId));
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
      }>(`/users/${user.user_id}/remove-firm`, { firm_id: firmId });

      if (response.success) {
        setAssignments((prev) => prev.filter((a) => a.firm_id !== firmId));
      }
    } catch (error: any) {
      const errorData = handleApiError(error);
      console.error('Failed to remove assignment:', errorData.message);
    } finally {
      setRemovingAssignments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(firmId);
        return newSet;
      });
    }
  };

  const handleSaveAndClose = () => {
    onSuccess();
    onClose();
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

  const getAvailableFirms = () => {
    const assignedFirmIds = assignments.map((a) => a.firm_id);
    return firms.filter((f) => !assignedFirmIds.includes(f.firm_id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Firm Assignments - ${getUserDisplayName(user)}`}
      size="lg"
    >
      <ModalBody>
        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">
                {getUserDisplayName(user)}
              </h3>
              <p className="text-sm text-muted-foreground">
                @{user.username} • {user.user_type.replace('_', ' ')}
              </p>
            </div>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {assignments.length} Assignment
              {assignments.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Current Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>Current Firm Assignments</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(true)}
                  disabled={getAvailableFirms().length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Assignment
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">
                    No firm assignments found
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Add assignments to grant access to specific firms
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
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
                                className="text-xs text-yellow-600 border-yellow-200 bg-yellow-50"
                              >
                                <Star className="h-3 w-3 mr-1" />
                                Primary
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="capitalize">
                              {assignment.role_in_firm}
                            </span>
                            <span>•</span>
                            <span className="capitalize">
                              {assignment.access_level} access
                            </span>
                            <span>•</span>
                            <span>
                              Assigned: {formatDate(assignment.assigned_at)}
                            </span>
                          </div>
                          {assignment.assigned_by_name && (
                            <p className="text-xs text-muted-foreground">
                              by {assignment.assigned_by_name}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveAssignment(assignment.firm_id)
                        }
                        disabled={removingAssignments.has(assignment.firm_id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {removingAssignments.has(assignment.firm_id) ? (
                          <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Assignment Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Firm Assignment</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAddForm(false);
                      setAssignmentErrors({});
                      setNewAssignment({
                        firm_id: 0,
                        role_in_firm: 'member',
                        access_level: 'standard',
                        is_primary_firm: false,
                      });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignmentErrors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <p className="text-sm text-red-600">
                        {assignmentErrors.general}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Select Firm"
                    required
                    error={assignmentErrors.firm_id}
                  >
                    <select
                      value={newAssignment.firm_id}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          firm_id: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value={0}>Select a firm...</option>
                      {getAvailableFirms().map((firm) => (
                        <option key={firm.firm_id} value={firm.firm_id}>
                          {firm.firm_name}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField
                    label="Role in Firm"
                    required
                    error={assignmentErrors.role_in_firm}
                  >
                    <select
                      value={newAssignment.role_in_firm}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          role_in_firm: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="member">Member</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </FormField>

                  <FormField
                    label="Access Level"
                    description="Determines data access permissions"
                  >
                    <select
                      value={newAssignment.access_level}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          access_level: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="standard">Standard</option>
                      <option value="elevated">Elevated</option>
                      <option value="full">Full Access</option>
                    </select>
                  </FormField>

                  <FormField
                    label="Primary Firm"
                    description="User's main firm for default operations"
                    error={assignmentErrors.is_primary_firm}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_primary_firm"
                        checked={newAssignment.is_primary_firm}
                        onChange={(e) =>
                          setNewAssignment({
                            ...newAssignment,
                            is_primary_firm: e.target.checked,
                          })
                        }
                        className="rounded border-border"
                      />
                      <label
                        htmlFor="is_primary_firm"
                        className="text-sm text-foreground"
                      >
                        Set as primary firm
                      </label>
                    </div>
                  </FormField>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setAssignmentErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddAssignment} disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Assignment
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSaveAndClose}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </ModalFooter>
    </Modal>
  );
}
