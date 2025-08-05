export const getFBComments = async (mediaId: string, accessToken: string) => {
  const res = await fetch(
    `https://graph.facebook.com/${mediaId}/comments?fields=id,message,from,created_time,like_count,comment_count&access_token=${accessToken}`
  );
  const data = await res.json();
  if (data.error)console.log(`Error fetching comments: ${JSON.stringify(data.error)}`);
  return data.data || [];
};

export const getFBReplies = async (replyId: string, accessToken: string) => {
  const res = await fetch(
    `https://graph.facebook.com/${replyId}/comments?fields=id,message,from,created_time,like_count&access_token=${accessToken}`
  );
  const data = await res.json();
  if (data.error)console.log(`Error fetching comments: ${JSON.stringify(data.error)}`);
  return data.data || [];
};


export const deleteFBComment = async (commentId: string, accessToken: string) => {
  const url = `https://graph.facebook.com/${commentId}?access_token=${accessToken}`;
  
  const res = await fetch(url, {
    method: "DELETE",
  });

  const data = await res.json();

  if (data.error) {
    console.error(`Error deleting Facebook comment: ${JSON.stringify(data.error)}`);
    throw new Error(data.error.message);
  }

  return data.data; 
};


export const setFBCommentHidden = async ( commentId: string, accessToken: string ) => {
  const url = `https://graph.facebook.com/${commentId}`;
  const params = new URLSearchParams();
  params.append("access_token", accessToken);
  params.append("hide", "true" );

  const res = await fetch(url, {
    method: "POST",
    body: params,
  });

  const data = await res.json();

  if (data.error) {
    console.error(`Error hiding Facebook comment:`, data.error);
    throw new Error(data.error.message);
  }

  return data; 
};

