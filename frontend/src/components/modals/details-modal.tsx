import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReactNode } from "react";

interface DetailModalProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}


const DetailModal: React.FC<DetailModalProps> = ({
  title, open, onOpenChange, children
}) => {
  return (
   <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">{children}</div>
      </DialogContent>
    </Dialog>
  )
}

export default DetailModal