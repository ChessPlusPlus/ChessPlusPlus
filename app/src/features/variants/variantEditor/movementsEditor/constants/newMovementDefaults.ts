import type { MovementRule } from "@/features/variants/common/types/movementRules";

const newMovementDefaults: MovementRule = {
	forMovement: true,
	forCapture: true,
	conditions: [],
	moveDefinition: {
		moveX: 0,
		moveY: 0,
		range: 1,
		moveStopConditions: ["inside_piece"],
	},
};

export { newMovementDefaults };
