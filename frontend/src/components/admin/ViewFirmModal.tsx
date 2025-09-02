'use client';

import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Hash,
  Globe,
  Users,
  Calendar,
  Edit,
} from 'lucide-react';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Firm {
  firm_id: number;
  firm_name: string;
  description?: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  active_users?: number;
  properties_count?: number;
}

interface ViewFirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (firmId: number) => void;
  firm: Firm | null;
}

const DetailRow = ({
  icon: Icon,
  label,
  value,
  secondary = false,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value?: string | number;
  secondary?: boolean;
}) => {
  if (!value && value !== 0) return null;

  return (
    <div className="flex items-start space-x-3">
      <Icon
        className={`h-4 w-4 mt-0.5 ${secondary ? 'text-muted-foreground' : 'text-blue-600'}`}
      />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
};

export function ViewFirmModal({
  isOpen,
  onClose,
  onEdit,
  firm,
}: ViewFirmModalProps) {
  if (!firm) return null;

  const handleEdit = () => {
    if (onEdit && firm) {
      onEdit(firm.firm_id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>{firm.firm_name}</span>
          <Badge variant={firm.is_active ? 'default' : 'secondary'}>
            {firm.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      }
      size="lg"
    >
      <ModalBody>
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Company Information</span>
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <DetailRow
                icon={Building2}
                label="Company Name"
                value={firm.firm_name}
              />
              <DetailRow
                icon={FileText}
                label="Business Description"
                value={firm.description}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Contact Details</span>
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <DetailRow
                icon={Mail}
                label="Email Address"
                value={firm.contact_email}
              />
              <DetailRow
                icon={Phone}
                label="Phone Number"
                value={firm.contact_phone}
              />
            </div>
          </div>

          {/* Address Information */}
          {firm.address && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Business Address</span>
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <DetailRow icon={MapPin} label="Address" value={firm.address} />
              </div>
            </div>
          )}

          {/* Statistics */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Statistics</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-blue-700">Active Users</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {firm.active_users || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-green-700">Properties</p>
                    <p className="text-lg font-semibold text-green-900">
                      {firm.properties_count || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>System Information</span>
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <DetailRow
                icon={Calendar}
                label="Created"
                value={formatDate(firm.created_at)}
                secondary
              />
              {firm.updated_at && (
                <DetailRow
                  icon={Calendar}
                  label="Last Updated"
                  value={formatDate(firm.updated_at)}
                  secondary
                />
              )}
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button type="button" onClick={handleEdit} className="min-w-[120px]">
          <div className="flex items-center space-x-2">
            <Edit className="h-4 w-4" />
            <span>Edit Firm</span>
          </div>
        </Button>
      </ModalFooter>
    </Modal>
  );
}
