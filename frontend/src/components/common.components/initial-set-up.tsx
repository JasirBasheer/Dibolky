import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';



interface InitialSetUpProps {
  onClose: (value: boolean) => void;
  link:string;
  tutorialUrl:string;
}


const InitialSetUp = ({ onClose,link,tutorialUrl }: InitialSetUpProps) => {

  function handleSkipForNow  () { 
    localStorage.setItem('skipInitialSetUp', 'true');
    onClose(false)
  }
  

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={() => onClose(false)}
    >
      <Card className="w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-xl font-semibold">Quick Setup Guide</h2>
          <Button variant="ghost" size="icon" className="rounded-full"
            onClick={() => onClose(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Complete Your Account Setup</h3>
            <p className="text-gray-600 text-sm mt-1">
              Watch this quick tutorial to learn how to set up your payment methods and social media connections
            </p>
          </div>

          <div className="relative w-full overflow-hidden rounded-lg shadow-md mb-4" 
          style={{ paddingBottom: '56.25%' }}>
            <iframe
                className="absolute top-0 left-0 w-full h-full border-0"
                src={tutorialUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>



          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => handleSkipForNow()}>Skip for now</Button>
            <Link to={link}>
            <Button>Start setup</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InitialSetUp;