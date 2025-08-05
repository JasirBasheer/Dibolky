export const getSupportedMetrics = (type: string) => {
  switch (type.toUpperCase()) {
    case "VIDEO":
      return ["reach", "likes", "comments"];
    case "IMAGE":
      return ["reach", "saved", "likes", "comments"];
    case "REELS":
      return ["views", "likes", "comments", "saved"];
    case "STORY":
      return ["replies", "exits", "taps_forward", "taps_back"];
    default:
      return ["reach", "likes", "comments"];
  }
};
