const DEVOPS_DEFAULTS = {
    tagRules: [
        {
            match: "bug",
            badgeColor: "#966526",
        },
        {
            match: "master",
            badgeColor: "#ff0000",
        },
        {
            match: "main",
            badgeColor: "#ff0000",
        },
        {
            match: "hotfix",
            badgeColor: "#ff0000",
        },
        {
            match: "hold",
            badgeColor: "#e100ff",
        }
    ],
    prTargetRules: [
        {
            match: "master",
            targetColor: "#d60a0a",
        },
        {
            match: "main",
            targetColor: "#d60a0a",
        },
    ],
    prNameRules: [
        {
            match: "feature",
            targetColor: "#3cbe93",
        },
    ],
};

globalThis.DEVOPS_DEFAULTS = DEVOPS_DEFAULTS;

