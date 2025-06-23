import React, { useContext, useEffect, useState } from 'react';
import StatCard from '@/components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Package, Database, Archive } from 'lucide-react';
import UserDetailsContext from '@/hooks/UserDetailsContext';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const userDetails = useContext(UserDetailsContext);

  const [poSummary, setPoSummary] = useState<any[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<any | null>(null);
  const [reqSummaryByUser, setReqSummaryByUser] = useState<Record<string, Record<string, number>>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const businessID = String(userDetails?.userDetails?.BusinessID || '');
  const teamContactID = String(userDetails?.userDetails?.TeamContactID);
  const userRole = userDetails?.userDetails?.UserRole;
  const isOwner = userRole === 'owner';

  const fetchSummaries = async () => {
    if (!businessID) {
      setError('Invalid BusinessID');
      return;
    }

    setLoading(true);

    try {
  const baseUrl = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_PORTNO}`;
  const commonPayload = {
    BusinessID: businessID,
    ...(isOwner ? {} : { TeamContactID: teamContactID }),
  };

const [vendorsRes, categoriesRes] = await Promise.all([
  axios.post(`${baseUrl}/purchases/GetVendorsList`, commonPayload),
  axios.post(`${baseUrl}/purchases/GetVendorCategories`, { BusinessID: businessID }),
]);

const totalVendors = Array.isArray(vendorsRes.data) ? vendorsRes.data.length : 0;
const totalCategories = Array.isArray(categoriesRes.data) ? categoriesRes.data.length : 0;

setDashboardSummary({
  TotalVendors: totalVendors,
  TotalCategories: totalCategories,
});


  setError(null);
} catch (err) {
  console.error('Error fetching dashboard data:', err);
  setError('Failed to load data');
} finally {
  setLoading(false);
}
  }

  useEffect(() => {
    fetchSummaries();
  }, [businessID, teamContactID, isOwner]);

  const selfReqCount = isOwner
    ? Object.values(reqSummaryByUser?.[teamContactID] || {}).reduce((sum, val) => sum + val, 0)
    : undefined;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-lg font-medium text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <StatCard
          title="Total vendors"
          value={dashboardSummary?.TotalVendors ?? 0}
          icon={<FileText />}
         
        />
        <StatCard title="Total Categories" value={dashboardSummary?.TotalCategories ?? 0} icon={<Package />} />
   
      </div>

      {/* Requisition and PO Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Requisition Summary */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg">Requisition Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : Object.keys(reqSummaryByUser).length === 0 ? (
              <p className="text-muted-foreground text-sm">No data found</p>
            ) : isOwner ? (
              (() => {
                const totalStatusCounts: Record<string, number> = {};
                Object.values(reqSummaryByUser).forEach(userStatuses => {
                  Object.entries(userStatuses).forEach(([status, count]) => {
                    totalStatusCounts[status] = (totalStatusCounts[status] || 0) + count;
                  });
                });
                return (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(totalStatusCounts).map(([status, count]) => (
                      <div key={status} className="flex text-sm">
                        <span className="w-32 capitalize">{status}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                );
              })()
            ) : (
              Object.entries(reqSummaryByUser).map(([_, statuses]) => (
                <div key={teamContactID} className="mb-4">
                  <div className="grid grid-cols-2 gap-2 pl-4">
                    {Object.entries(statuses).map(([status, count]) => (
                      <div key={status} className="flex text">
                        <span className="w-32 capitalize">{status}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card> */}

        {/* Purchase Order Summary */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg">Purchase Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : poSummary.length === 0 ? (
              <p className="text-muted-foreground text-sm">No data found</p>
            ) : isOwner ? (
              (() => {
                const statusCounts: Record<string, number> = {};
                poSummary.forEach((item: any) => {
                  const status = item.Status;
                  statusCounts[status] = (statusCounts[status] || 0) + (item.RecordCount || 0);
                });
                return (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(statusCounts).map(([status, count]) => (
                      <div key={status} className="flex text-sm">
                        <span className="w-32 capitalize">{status}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                );
              })()
            ) : (
              poSummary
                .filter(po => String(po.CreatedBy) === teamContactID)
                .map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <span className="w-32 capitalize">{item.Status}</span>
                      <span className="font-medium">{item.RecordCount}</span>
                    </div>
                  </div>
                ))
            )}
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default Dashboard;
