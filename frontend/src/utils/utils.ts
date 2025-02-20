export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export function formatDate(date: string) {
    const createdAt = new Date(date);
    
    if (isNaN(createdAt.getTime())) {
        console.error('Invalid date input:', date);
        return date;
    }
    
    return createdAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}



export const getStatusColor = (status : string) => {
    const colors:Record<string,string> = {
      "Active": "bg-green-100 text-green-800",
      "In Progress": "bg-blue-100 text-blue-800",
      "Planning": "bg-yellow-100 text-yellow-800",
      "Completed": "bg-gray-100 text-gray-800",
      "Pending": "bg-orange-100 text-orange-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };
