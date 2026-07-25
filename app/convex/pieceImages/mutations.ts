import { mutation } from "../_generated/server";
import { v } from "convex/values";

const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		return await ctx.storage.generateUploadUrl();
	},
});

const uploadNewImage = mutation({
	args: {
		storageId: v.id("_storage"),
	},

	returns: {
		imageId: v.union(v.id("pieceImages"), v.null()),
	},

	handler: async (ctx, args) => {
		const { storageId } = args;

		const metadata = await ctx.db.system.get("_storage", storageId);
		if (!metadata) return { imageId: null };

		const imageHash = metadata.sha256;
		const existingImage = await ctx.db
			.query("pieceImages")
			.withIndex("by_image_hash", (q) => q.eq("imageHash", imageHash))
			.unique();

		if (existingImage) {
			return {
				imageId: existingImage._id,
			};
		}

		const uploadedImageId = await ctx.db.insert("pieceImages", {
			storageId,
			imageHash,
		});

		return {
			imageId: uploadedImageId,
		};
	},
});

export { generateUploadUrl, uploadNewImage };
