import { defineTable } from "convex/server";
import { v } from "convex/values";

const pieceImages = defineTable({
	imageHash: v.string(),
	image: v.id("_storage"),
}).index("by_image_hash", ["imageHash"]);

export { pieceImages };
