import { query } from "../_generated/server";
import { v } from "convex/values";

const getPieceImageUrl = query({
	args: {
		imageId: v.id("pieceImages"),
	},

	returns: v.union(v.string(), v.null()),

	handler: async (ctx, args) => {
		const pieceImage = await ctx.db.get("pieceImages", args.imageId);
		const storageId = pieceImage?.storageId;

		if (!storageId) return null;

		return await ctx.storage.getUrl(storageId);
	},
});

export { getPieceImageUrl };
