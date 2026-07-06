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

const tbody = document.getElementById("rules");
const status = document.getElementById("status");

chrome.storage.sync.get(
    { rules: DEFAULT_RULES },
    ({ rules }) => render(rules)
);

document.getElementById("add").addEventListener("click", () => {
    const rules = getRules();

    rules.push({
        match: "",
        badgeColor: "#ffffff",
    });

    render(rules);
    save();
});

function render(rules) {

    tbody.innerHTML = "";

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

        tbody.appendChild(tr);
    }

    tbody.querySelectorAll("input").forEach(i =>
        i.addEventListener("input", save));

    tbody.querySelectorAll(".delete").forEach(btn =>
        btn.addEventListener("click", e => {
            e.target.closest("tr").remove();
            save();
        }));
}

function getRules() {

    return [...tbody.querySelectorAll("tr")].map(tr => ({

        match:
            tr.querySelector(".match").value.trim(),

        badgeColor:
            tr.querySelector(".badge").value,

    }));
}

function save() {

    const rules = getRules();

    chrome.storage.sync.set({ rules }, () => {

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