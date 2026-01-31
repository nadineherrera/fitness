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
};

function showScreen(key){
  Object.values(screens).forEach(s => s.classList.remove("visible"));
  screens[key].classList.add("visible");
  tabs.forEach(t => t.classList.toggle("active", t.dataset.screen === key));
  window.scrollTo({top:0, behavior:"instant"});
}

tabs.forEach(t => t.addEventListener("click", () => showScreen(t.dataset.screen)));

// ---------- Local Save / Load ----------
function collectFormState(){
  const fields = document.querySelectorAll("input, textarea, select");
  const data = {};
  fields.forEach((el) => {
    const id = el.id;
    if (!id) return;
    if (el.type === "checkbox") data[id] = el.checked;
    else data[id] = el.value;
  });
  return data;
}

function applyFormState(data){
  const fields = document.querySelectorAll("input, textarea, select");
  fields.forEach((el) => {
    const id = el.id;
    if (!id || !(id in data)) return;
    if (el.type === "checkbox") el.checked = !!data[id];
    else el.value = data[id];
  });
}

const KEY = "planner_app_state_v1";

document.getElementById("saveBtn")?.addEventListener("click", () => {
  const state = collectFormState();
  localStorage.setItem(KEY, JSON.stringify(state));
  alert("Saved locally ✔");
});

document.getElementById("loadBtn")?.addEventListener("click", () => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return alert("No saved data found.");
  applyFormState(JSON.parse(raw));
  alert("Loaded ✔");
});

document.getElementById("clearBtn")?.addEventListener("click", () => {
  localStorage.removeItem(KEY);
  alert("Cleared ✔");
});

document.getElementById("printBtn")?.addEventListener("click", () => {
  window.print();
});
