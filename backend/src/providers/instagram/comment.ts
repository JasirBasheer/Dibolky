

export const getIGComments = async (mediaId: string, accessToken: string) => {
  const res = await fetch(
    `https://graph.facebook.com/${mediaId}/comments?fields=id,text,username,timestamp&access_token=${accessToken}`
  );
  const data = await res.json();
  if(data.error) console.log(`Error fetching comments: ${JSON.stringify(data.error)}`);
  return data.data || [];
};


export const getIGReplies = async (commentId: string, accessToken: string) => {
  const res = await fetch(
    `https://graph.facebook.com/${commentId}/replies?fields=id,text,username,timestamp&access_token=${accessToken}`
  );
  const data = await res.json();
  if(data.error) console.log(`Error fetching replies: ${JSON.stringify(data.error)}`);
  return data.data || [];
};




export const deleteIGComment = async (commentId: string, accessToken: string) => {
  const url = `https://graph.facebook.com/${commentId}?access_token=${accessToken}`;
  const res = await fetch(url, {
    method: "DELETE",
  });

  const data = await res.json();

  if (data.error) {
    console.error(`Error deleting comment: ${JSON.stringify(data.error)}`);
    throw new Error(data.error.message);
  }
  return data.data; 
};


export const setIGCommentHidden = async ( commentId: string, accessToken: string ) => {
  const url = `https://graph.facebook.com/${commentId}`;
  const params = new URLSearchParams();
  params.append("access_token", accessToken);
  params.append("hide",  "true");

  const res = await fetch(url, {
    method: "POST",
    body: params,
  });

  const data = await res.json();

  if (data.error) {
    console.error(`Error  hidin Instagram comment:`, data.error);
    throw new Error(data.error.message);
  }

  return data; 
};

