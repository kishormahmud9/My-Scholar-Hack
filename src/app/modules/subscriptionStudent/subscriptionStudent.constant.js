export const PLAN_NAMES = {
    FREE: "Free",
    ESSAY_HACK: "essay_hack",
    ESSAY_HACK_PLUS: "essay_hack_plus",
    ESSAY_HACK_PRO: "essay_hack_pro",
};

export const PLAN_LIMITS = {
    [PLAN_NAMES.FREE]: {
        maxEssays: 1,
        isMonthly: false, // Total limit for free trial
    },
    [PLAN_NAMES.ESSAY_HACK]: {
        maxEssays: 5,
        isMonthly: true,
    },
    [PLAN_NAMES.ESSAY_HACK_PLUS]: {
        maxEssays: 10,
        isMonthly: true,
    },
    [PLAN_NAMES.ESSAY_HACK_PRO]: {
        maxEssays: Infinity,
        isMonthly: true,
    },
};
