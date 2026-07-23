const defaults = globalThis.DEVOPS_DEFAULTS || {
    tagRules: [],
    prTargetRules: [],
};

const DEFAULT_TAG_RULES = defaults.tagRules;
const DEFAULT_PR_TARGET_RULES = defaults.prTargetRules;
const DEFAULT_PR_NAME_RULES = defaults.prNameRules;

const tagRulesBody = document.getElementById("rules");
const prNameRulesBody = document.getElementById("prNameRules");
const prTargetRulesBody = document.getElementById("prTargetRules");
const status = document.getElementById("status");

chrome.storage.sync.get(
    {
        rules: DEFAULT_TAG_RULES,
        prTargetRules: DEFAULT_PR_TARGET_RULES,
        prNameRules: DEFAULT_PR_NAME_RULES,
    },
    ({ rules, prTargetRules, prNameRules }) => {
        renderTagRules(rules);
        renderPrTargetRules(prTargetRules);
        renderPrNameRules(prNameRules);
    }
);

document.getElementById("add").addEventListener("click", () => {
    const rules = getTagRules();

    rules.push({
        match: "",
        badgeColor: "#ffffff",
    });

    renderTagRules(rules);
    save();
});

document.getElementById("addTarget").addEventListener("click", () => {
    const prTargetRules = getPrTargetRules();

    prTargetRules.push({
        match: "",
        targetColor: "",
    });

    renderPrTargetRules(prTargetRules);
    save();
});

document.getElementById("addPrName").addEventListener("click", () => {
    const prTargetRules = getPrNameRules();

    prTargetRules.push({
        match: "",
        targetColor: "",
    });

    renderPrNameRules(prTargetRules);
    save();
});

function renderPrNameRules(rules) {

    prNameRulesBody.innerHTML = "";

    for (const rule of rules) {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                <input class="match" type="text" value="${rule.match}">
            </td>

            <td>
                <input class="target" type="color"
                    value="${toColor(rule.targetColor)}">
            </td>

            <td>
                <button class="delete">Delete</button>
            </td>
        `;

        prNameRulesBody.appendChild(tr);
    }

    prNameRulesBody.querySelectorAll("input").forEach(i =>
        i.addEventListener("input", save));

    prNameRulesBody.querySelectorAll(".delete").forEach(btn =>
        btn.addEventListener("click", e => {
            e.target.closest("tr").remove();
            save();
        }));
}

function renderTagRules(rules) {

    tagRulesBody.innerHTML = "";

    for (const rule of rules) {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                <input class="match" type="text" value="${rule.match}">
            </td>

            <td>
                <input class="badge" type="color"
                    value="${toColor(rule.badgeColor)}">
            </td>

            <td>
                <button class="delete">Delete</button>
            </td>
        `;

        tagRulesBody.appendChild(tr);
    }

    tagRulesBody.querySelectorAll("input").forEach(i =>
        i.addEventListener("input", save));

    tagRulesBody.querySelectorAll(".delete").forEach(btn =>
        btn.addEventListener("click", e => {
            e.target.closest("tr").remove();
            save();
        }));
}

function renderPrTargetRules(prTargetRules) {

    prTargetRulesBody.innerHTML = "";

    for (const rule of prTargetRules) {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>
                <input class="match" type="text" value="${rule.match}">
            </td>

            <td>
                <input class="target" type="color"
                    value="${toColor(rule.targetColor)}">
            </td>

            <td>
                <button class="delete">Delete</button>
            </td>
        `;

        prTargetRulesBody.appendChild(tr);
    }

    prTargetRulesBody.querySelectorAll("input").forEach(i =>
        i.addEventListener("input", save));

    prTargetRulesBody.querySelectorAll(".delete").forEach(btn =>
        btn.addEventListener("click", e => {
            e.target.closest("tr").remove();
            save();
        }));
}

function getTagRules() {

    return [...tagRulesBody.querySelectorAll("tr")].map(tr => ({

        match:
            tr.querySelector(".match").value.trim(),

        badgeColor:
            tr.querySelector(".badge").value,

    }));
}

function getPrTargetRules() {

    return [...prTargetRulesBody.querySelectorAll("tr")].map(tr => ({

        match:
            tr.querySelector(".match").value.trim(),

        targetColor:
            tr.querySelector(".target").value.trim(),

    }));
}

function getPrNameRules() {

    return [...prNameRulesBody.querySelectorAll("tr")].map(tr => ({

        match:
            tr.querySelector(".match").value.trim(),

        targetColor:
            tr.querySelector(".target").value.trim(),

    }));
}

function save() {

    const rules = getTagRules();
    const prTargetRules = getPrTargetRules();
    const prNameRules = getPrNameRules();

    chrome.storage.sync.set({ rules, prTargetRules, prNameRules }, () => {

        status.textContent = "Saved";

        clearTimeout(status._timer);

        status._timer = setTimeout(() => {
            status.textContent = "";
        }, 1000);
    });
}

function toColor(value) {

    if (!value)
        return "#ffffff";

    return value.substring(0, 7);
}
