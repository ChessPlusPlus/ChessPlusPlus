import type { SetupRules } from "@/features/variants/common/types/setupRules";
import type { PieceRuleset } from "@/features/variants/common/types/pieceRules";
import type { MovementRules } from "@/features/variants/common/types/movementRules";

type VariantRules = {
	setup: SetupRules;
	pieces: PieceRuleset;
	moves: MovementRules;
};

type VariantInfo = {
	variantRules: VariantRules;
	variantName: string;
};

export type { VariantInfo, VariantRules };
