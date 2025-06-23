
import { User, Department, InventoryItem, Supplier } from '@/types';

// Sample Users
export const sampleUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Requester'
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Approver'
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'Purchase Manager'
  },
  {
    id: 'user-4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'Inventory Manager'
  }
];

// Sample Departments
export const sampleDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'IT'
  },
  {
    id: 'dept-2',
    name: 'Finance'
  },
  {
    id: 'dept-3',
    name: 'HR'
  },
  {
    id: 'dept-4',
    name: 'Marketing'
  },
  {
    id: 'dept-5',
    name: 'Operations'
  }
];

// Sample Inventory Items
export const sampleInventoryItems: InventoryItem[] = [
  {
    id: 'item-1',
    name: 'Laptop',
    description: 'Business Laptop - 14" Core i7',
    currentStock: 5,
    type: 'Asset',
    unitPrice: 1200
  },
  {
    id: 'item-2',
    name: 'Monitor',
    description: '27" 4K Monitor',
    currentStock: 10,
    type: 'Asset',
    unitPrice: 350
  },
  {
    id: 'item-3',
    name: 'Printer Ink',
    description: 'Black Ink Cartridge',
    currentStock: 25,
    type: 'Consumable',
    unitPrice: 45
  },
  {
    id: 'item-4',
    name: 'Office Chair',
    description: 'Ergonomic Office Chair',
    currentStock: 8,
    type: 'Asset',
    unitPrice: 250
  },
  {
    id: 'item-5',
    name: 'Notebooks',
    description: 'Pack of 5 Spiral Notebooks',
    currentStock: 50,
    type: 'Consumable',
    unitPrice: 15
  },
  {
    id: 'item-6',
    name: 'Wireless Mouse',
    description: 'Bluetooth Wireless Mouse',
    currentStock: 12,
    type: 'Asset',
    unitPrice: 35
  }
];

// Sample Suppliers
export const sampleSuppliers: Supplier[] = [
  {
    id: 'supplier-1',
    name: 'TechPro Supplies',
    contactPerson: 'Robert Johnson',
    email: 'sales@techprosupplies.com',
    phone: '555-123-4567'
  },
  {
    id: 'supplier-2',
    name: 'Office Solutions Inc.',
    contactPerson: 'Maria Garcia',
    email: 'maria@officesolutions.com',
    phone: '555-234-5678'
  },
  {
    id: 'supplier-3',
    name: 'Global Equipment Co.',
    contactPerson: 'David Kim',
    email: 'david@globalequipment.com',
    phone: '555-345-6789'
  },
  {
    id: 'supplier-4',
    name: 'Innovative Systems',
    contactPerson: 'Linda Chen',
    email: 'linda@innovativesystems.com',
    phone: '555-456-7890'
  }
];
