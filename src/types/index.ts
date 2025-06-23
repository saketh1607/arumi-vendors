
export type RequisitionStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
export type POStatus = 'Created' | 'Sent' | 'Received';
export type ItemType = 'Consumable' | 'Asset';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface RequisitionItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  itemType: ItemType;
}

export interface Requisition {
  RequestDate: any;
  priority: string;
  id: string;
  items: RequisitionItem[];
  requesterId: string;
  requesterName: string;
  departmentId: string;
  departmentName: string;
  reason: string;
  status: RequisitionStatus;
  createdAt: string;
  approvalComment?: string;
  approverId?: string;
  approverName?: string;
  approvedAt?: string;
}

export interface POItem extends RequisitionItem {
  unitCost: number;
  totalCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  requisitionId: string;
  items: POItem[];
  supplierId?: string;
  supplierName: string;
  status: POStatus;
  totalCost: number;
  createdAt: string;
  deliveryDate?: string;
  receivedDate?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  currentStock: number;
  type: ItemType;
  unitPrice: number;
}

export interface Asset {
  id: string;
  itemId: string;
  itemName: string;
  serialNumber: string;
  purchaseDate: string;
  poReference: string;
  assignedTo?: string;
  assignedToName?: string;
  status: 'Available' | 'Assigned' | 'Maintenance' | 'Retired';
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
}
