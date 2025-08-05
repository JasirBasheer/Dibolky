export const getFBMediaDetails = (content) => {
  let media_type = "UNKNOWN";
  let media_url = "";

  if (content.attachments && content.attachments.data && content.attachments.data.length > 0 ) {
    const firstAttachment = content.attachments.data[0];

    media_type = firstAttachment.media_type || "UNKNOWN";
    if ( media_type === "video" && firstAttachment.media && firstAttachment.media.source ) {
      media_url = firstAttachment.media.source;
    } else if ( firstAttachment.media && firstAttachment.media.image && firstAttachment.media.image.src ) {
      media_url = firstAttachment.media.image.src;
    } else if (firstAttachment.url) {
      media_url = firstAttachment.url;
    }

    if ( firstAttachment.subattachments && firstAttachment.subattachments.data && firstAttachment.subattachments.data.length > 0 ) {
      const firstSubAttachment = firstAttachment.subattachments.data[0];
      if ( firstSubAttachment.media && firstSubAttachment.media.image && firstSubAttachment.media.image.src) {
        media_url = firstSubAttachment.media.image.src;
        media_type = firstSubAttachment.media_type || media_type;
      } else if (firstSubAttachment.media && firstSubAttachment.media.source) {
        media_url = firstSubAttachment.media.source;
        media_type = firstSubAttachment.media_type || media_type;
      } else if (firstSubAttachment.url) {
        media_url = firstSubAttachment.url;
        media_type = firstSubAttachment.media_type || media_type;
      }
    }
  }
  return { media_type, media_url }
};
