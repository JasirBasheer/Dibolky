export const getIGMedias = async (mediaId: string, accessToken: string) => {
  const res = await fetch(
    `https://graph.facebook.com/${mediaId}?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username,children&access_token=${accessToken}`
  );
  const data = await res.json();
  if (data.error) console.log(`Error fetching replies: ${JSON.stringify(data.error)}`);
  return data || [];
};

export const getIGInsights = async (mediaId: string, accessToken: string, metrics: string[]) => {
  const res = await fetch(
    `https://graph.facebook.com/${mediaId}/insights?metric=${metrics.join(
      ","
    )}&access_token=${accessToken}`
  );
  const data = await res.json();

  if (data.error)console.log(`Error fetching replies: ${JSON.stringify(data.error)}`);
  return data.data || [];
};
