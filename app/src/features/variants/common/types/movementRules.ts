type MoveConditions = "has_not_moved";
type MoveStopConditions = "inside_piece";

type MoveDefinition = {
	moveX: number;
	moveY: number;
	range: number | "inf";
	moveStopConditions: MoveStopConditions[];
};

type MoveDefinitionChanges = {
	offsetX: number;
	offsetY: number;
	range: number | "inf";
	moveStopConditions: MoveStopConditions[];
};

type MovementRule = {
	forMovement: boolean;
	forCapture: boolean;
	conditions: MoveConditions[];

	moveDefinition: MoveDefinition;
};

type NumericFieldConstraints = Record<string, { min: number | null, max: number | null }>

type MovementRules = Record<string, MovementRule>;

export type { MovementRule, MovementRules, MoveDefinitionChanges, MoveDefinition, NumericFieldConstraints };
