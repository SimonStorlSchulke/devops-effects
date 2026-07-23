const defaults = globalThis.DEVOPS_DEFAULTS || {
    tagRules: [],
    prTargetRules: [],
};

const DEFAULT_TAG_RULES = defaults.tagRules;
const DEFAULT_PR_TARGET_RULES = defaults.prTargetRules;
const DEFAULT_PR_NAME_RULES = defaults.prNameRules;

let rules = DEFAULT_TAG_RULES;
let prTargetRules = DEFAULT_PR_TARGET_RULES;
let prNameRules = DEFAULT_PR_NAME_RULES;

chrome.storage.sync.get(
    {
        rules: DEFAULT_TAG_RULES,
        prTargetRules: DEFAULT_PR_TARGET_RULES,
        prNameRules: DEFAULT_PR_NAME_RULES,
    },
    ({ rules: storedRules, prTargetRules: storedPrTargetRules, prNameRules: storedPrNameRules }) => {
        rules = storedRules;
        prTargetRules = storedPrTargetRules;
        prNameRules = storedPrNameRules;
        scheduleUpdate();
    }
);

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;

    if (changes.rules) {
        rules = changes.rules.newValue || DEFAULT_TAG_RULES;
    }

    if (changes.prTargetRules) {
        prTargetRules = changes.prTargetRules.newValue || DEFAULT_PR_TARGET_RULES;
    }

    if (changes.rules || changes.prTargetRules) {
        scheduleUpdate();
    }
});

function triggerEffects() {
    const prCard = document.querySelector(".repos-pr-section-card");
    if(prCard) {
        applyPrColors(prCard);
    }
}

function applyPrColors(prCard) {
    prCard.querySelectorAll(".bolt-pill").forEach(pill => {
        // Reset previous styling
        pill.style.backgroundColor = "";

        const row = pill.closest("a");
        if (row) {
            row.style.backgroundColor = "";
        }

        const text = (pill.textContent || "").toLowerCase();

        for (const rule of rules) {
            if (!rule.match) continue;

            if (text.includes(rule.match.toLowerCase())) {
                if (rule.badgeColor) {
                    const reducedOpacity = rule.badgeColor + "66";
                    pill.style.backgroundColor = reducedOpacity;
                }
                break;
            }
        }
    });

    prCard.querySelectorAll("a").forEach(pr => {

        for (const rule of prNameRules) {
            const rowTextStart = pr.innerText.trim().slice(0, rule.match.length).toLowerCase();
            if(rowTextStart === rule.match.toLowerCase()) {
                const reducedOpacity = rule.targetColor + "55";
                pr.style.backgroundColor = reducedOpacity;
            }
        }
    });

    prCard.querySelectorAll(".monospaced-xs").forEach(prTarget => {
        prTarget.style.backgroundColor = "";

        const text = (prTarget.textContent || "").toLowerCase();

        for (const rule of prTargetRules) {
            if (!rule.match) continue;

            if (text.includes(rule.match.toLowerCase())) {
                if (rule.targetColor) {
                    prTarget.style.backgroundColor = rule.targetColor;
                }
                break;
            }
        }
    });
}

let scheduled = false;

function scheduleUpdate() {
    if (scheduled) return;

    scheduled = true;

    setTimeout(() => {
        scheduled = false;
        triggerEffects();
    }, 100);
}

const observer = new MutationObserver(scheduleUpdate);

observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
});

scheduleUpdate();
