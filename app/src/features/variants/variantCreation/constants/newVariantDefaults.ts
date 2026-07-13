import type { VariantRules } from "@/features/variants/common/types/variants";
import { defaultPieceRuleset } from "@/features/variants/variantCreation/constants/pieceRuleDefaults";
import { defaultSetupRules } from "@/features/variants/variantCreation/constants/defaultSetupRules";
import { defaultMovementRules } from "@/features/variants/variantCreation/constants/defaultMovementRules";

const defaultVariantRules: VariantRules = {
	setup: defaultSetupRules,
	pieces: defaultPieceRuleset,
	moves: defaultMovementRules,
};

export { defaultVariantRules };
