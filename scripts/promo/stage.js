/** Stage controls called by the renderer: setScene, setCaption, ripple. */
const q = new URLSearchParams(location.search);
document.getElementById("app").src = q.get("app") || "http://localhost:4173";
document.getElementById("desk").src = q.get("desk") || "";

window.setScene = (i) => {
  const s = window.SCENES[i];
  document.body.className = s.mode === "center" ? "center" : "";
  const kicker = document.getElementById("kicker");
  kicker.textContent = s.kicker; kicker.style.animation = "none"; void kicker.offsetWidth; kicker.style.animation = "";
  const title = document.getElementById("title");
  title.innerHTML = s.title.split(" ").map((w, k) => `<span class="w" style="animation-delay:${0.12 * k + 0.15}s">${w}</span>`).join("");
  const sub = document.getElementById("sub");
  sub.textContent = s.sub; sub.style.animation = "none"; void sub.offsetWidth; sub.style.animation = ""; sub.style.display = s.sub ? "" : "none";
  document.getElementById("tags").innerHTML = (s.tags || []).map((t, k) => `<span style="animation-delay:${0.8 + 0.15 * k}s">${t}</span>`).join("");
  document.querySelectorAll("#steps span").forEach((el, k) => el.classList.toggle("on", k === s.step));
  const phoneOn = i >= 1 && i <= 5;
  document.getElementById("phone").classList.toggle("hide", !phoneOn);
  document.getElementById("phone").classList.toggle("tilt", false);
  document.getElementById("laptop").classList.toggle("show", !!s.laptop);
};

window.setCaption = (text) => {
  const c = document.getElementById("cap");
  if (!text) { c.classList.remove("show"); return; }
  c.classList.remove("show");
  setTimeout(() => { c.textContent = text; c.classList.add("show"); }, 120);
};

window.ripple = (x, y) => {
  const r = document.createElement("div");
  r.className = "ripple"; r.style.left = x + "px"; r.style.top = y + "px";
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 900);
};
