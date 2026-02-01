// ===========================
// Tabs & Screens
// ===========================
const tabs = document.querySelectorAll(".tab");

const screens = {
  starting: document.getElementById("screen-starting"),
  goals: document.getElementById("screen-goals"),
  workout: document.getElementById("screen-workout"),
  meals: document.getElementById("screen-meals"),
  monthlyPlan: document.getElementById("screen-monthlyPlan"),
  monthlyReview: document.getElementById("screen-monthlyReview"),
  products: document.getElementById("screen-products"),
  tracker: document.getElementById("screen-tracker"),

  // ✅ Grocery List
  grocery: document.getElementById("screen-grocery"),
};

function showScreen(key) {
  Object.values(screens).forEach((s) => s && s.classList.remove("visible"));
  if (screens[key]) screens[key].classList.add("visible");

  tabs.forEach((t) =>
    t.classList.toggle("active", t.dataset.screen === key)
  );

  window.scrollTo({ top: 0, behavior: "instant" });
}

tabs.forEach((t) =>
  t.addEventListener("click", () => showScreen(t.dataset.screen))
);

// ===========================
// Local Save / Load
// ===========================
const KEY = "planner_app_state_v1";

function collectFormState() {
  const fields = document.querySelectorAll("input, textarea, select");
  const data = {};

  fields.forEach((el) => {
    if (!el.id) return;

    if (el.type === "checkbox") {
      data[el.id] = el.checked;
    } else {
      data[el.id] = el.value;
    }
  });

  return data;
}

function applyFormState(data) {
  if (!data || typeof data !== "object") return;

  const fields = document.querySelectorAll("input, textarea, select");

  fields.forEach((el) => {
    if (!el.id || !(el.id in data)) return;

    if (el.type === "checkbox") {
      el.checked = !!data[el.id];
    } else {
      el.value = data[el.id] ?? "";
    }
  });
}

function clearAllFields() {
  const fields = document.querySelectorAll("input, textarea, select");

  fields.forEach((el) => {
    if (!el.id) return;

    if (el.type === "checkbox") {
      el.checked = false;
    } else {
      el.value = "";
    }
  });
}

// ===========================
// Buttons
// ===========================
document.getElementById("saveBtn")?.addEventListener("click", () => {
  const state = collectFormState();
  localStorage.setItem(KEY, JSON.stringify(state));
  alert("Saved locally ✔");
});

document.getElementById("loadBtn")?.addEventListener("click", () => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return alert("No saved data found.");

  try {
    applyFormState(JSON.parse(raw));
    alert("Loaded ✔");
  } catch {
    alert("Saved data is corrupted.");
  }
});

document.getElementById("clearBtn")?.addEventListener("click", () => {
  localStorage.removeItem(KEY);
  clearAllFields();
  alert("Cleared ✔");
});

document.getElementById("printBtn")?.addEventListener("click", () => {
  window.print();
});

// ===========================
// Auto-load on refresh
// ===========================
(function boot() {
  showScreen("starting");

  const raw = localStorage.getItem(KEY);
  if (!raw) return;

  try {
    applyFormState(JSON.parse(raw));
  } catch {
    // fail silently
  }
})();

// ===========================
// Optional: Auto-save (debounced)
// ===========================
let autosaveTimer = null;

function scheduleAutosave() {
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    const state = collectFormState();
    localStorage.setItem(KEY, JSON.stringify(state));
  }, 400);
}

document.addEventListener("input", (e) => {
  const el = e.target;
  if (!el || !el.id) return;
  if (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT"
  ) {
    scheduleAutosave();
  }
});

document.addEventListener("change", (e) => {
  const el = e.target;
  if (!el || !el.id) return;
  scheduleAutosave();
});
