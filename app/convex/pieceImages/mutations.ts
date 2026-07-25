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

const updateImage = mutation({
	args: {
		newStorageId: v.id("_storage"),
	},

	returns: {
		imageId: v.union(v.string(), v.null()),
	},

	handler: async (ctx, args) => {
		const { newStorageId } = args;

		const metadata = await ctx.db.system.get("_storage", newStorageId);
		if (!metadata) return { imageId: null };

		const imageHash = metadata.sha256;
		const newImage = await ctx.db
			.query("pieceImages")
			.withIndex("by_image_hash", (q) => q.eq("imageHash", imageHash))
			.unique();

		if (newImage) {
			return { imageId: newImage._id };
		}

		const createdImageId = await ctx.db.insert("pieceImages", {
			storageId: newStorageId,
			imageHash: imageHash,
		});

		return {
			imageId: createdImageId,
		};
	},
});

export { generateUploadUrl, uploadNewImage, updateImage };
