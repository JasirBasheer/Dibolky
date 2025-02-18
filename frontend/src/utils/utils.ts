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
