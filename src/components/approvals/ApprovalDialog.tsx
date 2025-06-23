
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/types';

interface ApprovalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  actionType: 'approve' | 'reject' | null;
  comment: string;
  setComment: (comment: string) => void;
  approverId: string;
  setApproverId: (id: string) => void;
  onConfirm: () => void;
  approvers: User[];
}

const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
  isOpen,
  onOpenChange,
  actionType,
  comment,
  setComment,
  approverId,
  setApproverId,
  onConfirm,
  approvers,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === 'approve' ? 'Approve Requisition' : 'Reject Requisition'}
          </DialogTitle>
          <DialogDescription>
            {actionType === 'approve' 
              ? 'Confirm approval of this purchase requisition.'
              : 'Please provide a reason for rejection.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Approver</label>
            <Select value={approverId} onValueChange={setApproverId}>
              <SelectTrigger>
                <SelectValue placeholder="Select approver" />
              </SelectTrigger>
              <SelectContent>
                {approvers.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Comment</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={actionType === 'approve' 
                ? 'Optional approval comments...' 
                : 'Please provide a reason for rejection...'
              }
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            variant={actionType === 'approve' ? 'default' : 'destructive'}
          >
            {actionType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalDialog;
