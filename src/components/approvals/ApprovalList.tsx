import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';
import { FileText, CheckSquare, X, Eye, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { Requisition } from '@/types';

interface ApprovalListProps {
  requisitions: Requisition[];
  onView: (id: string) => void;
  onActionClick: (id: string, action: 'approve' | 'reject') => void;
}

const ApprovalList: React.FC<ApprovalListProps> = ({
  requisitions,
  onView,
  onActionClick,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('Submitted');

  const filteredRequisitions = statusFilter === 'All'
    ? requisitions
    : requisitions.filter((req) => req.status === statusFilter);

  const sortedRequisitions = [...filteredRequisitions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4 space-x-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filter by status:</span>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {sortedRequisitions.length > 0 ? (
          sortedRequisitions.map((req) => (
            <Card
              key={req.id}
              className="transition hover:shadow-md"
            >
              <CardContent className="p-4 space-y-2">
                <div className="text-sm font-semibold">Requisition ID: {req.id}</div>
                <div className="flex flex-wrap justify-between text-sm text-muted-foreground gap-y-2">
                  <div>Date: {new Date(req.createdAt).toLocaleDateString()}</div>
                  <div>Requester: {req.requesterName}</div>
                  <div>Department: {req.departmentName}</div>
                  <div>Items: {req.items.length}</div>
                  <div><StatusBadge status={req.status} /></div>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(req.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-50 text-green-600 hover:bg-green-100"
                    onClick={() => onActionClick(req.id, 'approve')}
                  >
                    <CheckSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-50 text-red-600 hover:bg-red-100"
                    onClick={() => onActionClick(req.id, 'reject')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground mt-8">
            <FileText className="mx-auto h-8 w-8 mb-2" />
            <p className="text-sm">No requisitions pending approval</p>
            {statusFilter !== 'All' && (
              <p className="text-xs mt-1">Try changing your filter</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalList;