export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function formatDateTime(date: string) {
  const createdAt = new Date(date);

  if (isNaN(createdAt.getTime())) {
    console.error("Invalid date input:", date);
    return date;
  }

  return createdAt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(date: string) {
  const createdAt = new Date(date);

  if (isNaN(createdAt.getTime())) {
    console.error("Invalid date input:", date);
    return date;
  }

  return createdAt.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Active: "bg-green-100 text-green-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Planning: "bg-yellow-100 text-yellow-800",
    Completed: "bg-gray-100 text-gray-800",
    Pending: "bg-orange-100 text-orange-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
}

export function getSocialMediaIcon(platform: string) {
  const platformLower: string = platform.toLowerCase();

  const icons: Record<string, string> = {
    facebook:
      "M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.04 20.44 19.7 18.73C21.35 17.03 22.34 14.82 22.34 12.56C22.34 9.8 21.23 7.16 19.26 5.19C17.29 3.23 14.65 2.11 11.9 2.11L12 2.04Z",
    instagram:
      "M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.509-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.044.976.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.976-.044 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.054.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.044-.976-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 8.468a3.333 3.333 0 100-6.666 3.333 3.333 0 000 6.666zm6.538-8.469a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z",
    x: "M18.901 2.289h-3.346L8.978 9.743 3.099 2.289H0l7.071 10.286L0 21.711h3.346l7.071-8.457 5.879 8.457h3.099l-7.071-10.286 7.071-8.457z",
    linkedin:
      "M22 3.47C22 2.65 21.35 2 20.53 2H3.47C2.65 2 2 2.65 2 3.47v17.06C2 21.35 2.65 22 3.47 22h17.06c.82 0 1.47-.65 1.47-1.47V3.47zM6.67 18H4V8.67h2.67V18zm-1.33-10.67c-.86 0-1.56-.7-1.56-1.56s.7-1.56 1.56-1.56 1.56.7 1.56 1.56-.7 1.56-1.56 1.56zm14.66 10.67h-2.67v-5.33c0-1.27-.45-2.13-1.58-2.13-.86 0-1.37.58-1.6 1.14-.08.2-.1.48-.1.76v5.56H11.33V8.67h2.56v1.14c.38-.58 1.06-1.4 2.58-1.4 1.9 0 3.33 1.24 3.33 3.9v5.69z",
    gmail:
      "M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.99L12 10.09l9.374-6.269h.99c.904 0 1.636.732 1.636 1.636z",
  };
  if (!icons[platformLower])
    return `M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.04 20.44 19.7 18.73C21.35 17.03 22.34 14.82 22.34 12.56C22.34 9.8 21.23 7.16 19.26 5.19C17.29 3.23 14.65 2.11 11.9 2.11L12 2.04Z`;
  return icons[platformLower];
}



export const stringToIntegerHash = (str: string): number => {
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Ensure the result is a positive integer, as required by some Agora versions
  return Math.abs(hash); 
};
