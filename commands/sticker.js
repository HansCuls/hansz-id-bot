module.exports = async (ctx) => {
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const fileUrl = await ctx.telegram.getFileLink(fileId);
    
    ctx.replyWithSticker({ url: fileUrl });
};
