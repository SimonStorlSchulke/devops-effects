const DEFAULT_RULES = [
    {
        match: "bug",
        badgeColor: "#96652654",
    },
    {
        match: "master",
        badgeColor: "#ff000044",
    },
    {
        match: "hotfix",
        badgeColor: "#ff000077",
    },
    {
        match: "hold",
        badgeColor: "#e100ff91",
    }
];

let rules = DEFAULT_RULES;

chrome.storage.sync.get(
    { rules: DEFAULT_RULES },
    ({ rules: storedRules }) => {
        rules = storedRules;
        scheduleUpdate();
    }
);

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.rules) {
        rules = changes.rules.newValue || DEFAULT_RULES;
        scheduleUpdate();
    }
});

function applyColors() {
    document.querySelectorAll(".bolt-pill").forEach(pill => {
        // Reset previous styling
        pill.style.backgroundColor = "";

        const row = pill.closest("a");
        if (row) {
            row.style.backgroundColor = "";
        }

        const text = pill.textContent.toLowerCase();

        for (const rule of rules) {
            if (!rule.match) continue;

            if (text.includes(rule.match.toLowerCase())) {
                if (rule.badgeColor) {
                    pill.style.backgroundColor = rule.badgeColor;
                }
                break;
            }
        }
    });

    document.querySelectorAll(".monospaced-xs").forEach(prTarget => {
        // Reset previous styling
        prTarget.style.backgroundColor = "";

        const text = prTarget.textContent.toLowerCase();

        if (text.includes('master'.toLowerCase())) {
            prTarget.style.backgroundColor = '#d60a0a86';
        }
    });
}

let scheduled = false;

function scheduleUpdate() {
    if (scheduled) return;

    scheduled = true;

    setTimeout(() => {
        scheduled = false;
        applyColors();
    }, 100);
}

const observer = new MutationObserver(scheduleUpdate);

observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
});

scheduleUpdate();