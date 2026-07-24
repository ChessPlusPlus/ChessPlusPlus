import { query } from "../_generated/server";
import { v } from "convex/values";

const getPieceImage = query({
	args: {
		imageId: v.id("pieceImages"),
	},
	handler: async (ctx, args) => {
		return await ctx.db.get("pieceImages", args.imageId);
	},
});

export { getPieceImage };
