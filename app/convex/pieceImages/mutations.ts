import { mutation } from "../_generated/server";

const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		return await ctx.storage.generateUploadUrl();
	},
});

export { generateUploadUrl };
