
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Requisition, 
  PurchaseOrder, 
  InventoryItem, 
  Asset, 
  User,
  Department
} from '@/types';
import { sampleUsers, sampleDepartments, sampleInventoryItems } from '@/data/sampleData';

interface AppContextType {
  // Data collections
  requisitions: Requisition[];
  purchaseOrders: PurchaseOrder[];
  inventoryItems: InventoryItem[];
  assets: Asset[];
  users: User[];
  departments: Department[];
  
  // CRUD operations
  addRequisition: (requisition: Requisition) => void;
  updateRequisition: (requisition: Requisition) => void;
  addPurchaseOrder: (order: PurchaseOrder) => void;
  updatePurchaseOrder: (order: PurchaseOrder) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  addAsset: (asset: Asset) => void;
  
  // Helper functions
  generatePONumber: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or with empty arrays
  const [requisitions, setRequisitions] = useState<Requisition[]>(() => {
    const saved = localStorage.getItem('requisitions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('purchaseOrders');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('inventoryItems');
    return saved ? JSON.parse(saved) : sampleInventoryItems;
  });
  
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('assets');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Sample data that doesn't change
  const [users] = useState<User[]>(sampleUsers);
  const [departments] = useState<Department[]>(sampleDepartments);
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('requisitions', JSON.stringify(requisitions));
  }, [requisitions]);
  
  useEffect(() => {
    localStorage.setItem('purchaseOrders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);
  
  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
  }, [inventoryItems]);
  
  useEffect(() => {
    localStorage.setItem('assets', JSON.stringify(assets));
  }, [assets]);
  
  // CRUD operations
  const addRequisition = (requisition: Requisition) => {
    setRequisitions(prev => [...prev, requisition]);
  };
  
  const updateRequisition = (updated: Requisition) => {
    setRequisitions(prev => prev.map(req => req.id === updated.id ? updated : req));
  };
  
  const addPurchaseOrder = (order: PurchaseOrder) => {
    setPurchaseOrders(prev => [...prev, order]);
  };
  
  const updatePurchaseOrder = (updated: PurchaseOrder) => {
    setPurchaseOrders(prev => prev.map(po => po.id === updated.id ? updated : po));
    
    // If PO is marked as received, update inventory
    if (updated.status === 'Received') {
      updated.items.forEach(poItem => {
        setInventoryItems(prev => prev.map(invItem => {
          if (invItem.id === poItem.itemId) {
            return {
              ...invItem,
              currentStock: (invItem.currentStock || 0) + poItem.quantity
            };
          }
          return invItem;
        }));
      });
    }
  };
  
  const updateInventoryItem = (updated: InventoryItem) => {
    setInventoryItems(prev => prev.map(item => item.id === updated.id ? updated : item));
  };
  
  const addAsset = (asset: Asset) => {
    setAssets(prev => [...prev, asset]);
  };
  
  // Helper functions
  const generatePONumber = () => {
    const poCount = purchaseOrders.length + 1;
    return `PO-${poCount.toString().padStart(3, '0')}`;
  };
  
  const value = {
    requisitions,
    purchaseOrders,
    inventoryItems,
    assets,
    users,
    departments,
    addRequisition,
    updateRequisition,
    addPurchaseOrder,
    updatePurchaseOrder,
    updateInventoryItem,
    addAsset,
    generatePONumber
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
