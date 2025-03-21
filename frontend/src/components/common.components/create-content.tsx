import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Card, CardContent } from '../ui/card';

const CreateContent = () => {
    const [isOpen,setIsOpen] = useState<boolean>(false)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
      <Card className="w-full overflow-hidden group relative cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-0">
         
        </CardContent>
      </Card>
    </DialogTrigger>

    <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
     
    </DialogContent>
  </Dialog>
);
)
}

export default CreateContent