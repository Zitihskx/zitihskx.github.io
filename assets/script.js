/* Minimal JS: mobile nav, publications rendering, mailto form helper. */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);

  // Footer dates
  const yearEl = $("#year");
  const lastEl = $("#lastUpdated");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (lastEl) lastEl.textContent = new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });

  // Mobile nav
  const toggle = $(".nav-toggle");
  const menu = $("#nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("show");
    });
    menu.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.tagName === "A") {
        menu.classList.remove("show");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Publications
  async function loadPubs() {
    const list = $("#pubList");
    if (!list) return;

    const res = await fetch("data/publications.json", { cache: "no-store" });
    const pubs = await res.json();

    const search = $("#pubSearch");
    const filter = $("#pubFilter");

    function norm(s) { return (s || "").toLowerCase(); }

    function render() {
      const q = norm(search?.value);
      const f = filter?.value || "all";

      const shown = pubs.filter(p => {
        const text = norm([p.title, p.venue, p.year, p.type].join(" "));
        const okQ = !q || text.includes(q);
        const okF = f === "all" || (p.type || "").toLowerCase() === f;
        return okQ && okF;
      });

      list.innerHTML = shown.map(p => {
        const links = (p.links || []).map(l => `<a class="pill" href="${l.url}" target="_blank" rel="noreferrer">${l.label}</a>`).join("");
        const badge = p.type ? `<span class="pill">${p.type}</span>` : "";
        const meta = [p.authors, p.venue, p.year].filter(Boolean).join(" • ");
        return `
          <article class="pub">
            <div class="title">${p.title}</div>
            <div class="meta">${meta}</div>
            <div class="links">${badge}${links}</div>
          </article>
        `;
      }).join("");

      if (!shown.length) {
        list.innerHTML = `<div class="pub"><div class="title">No matches.</div><div class="meta">Try clearing the search or changing the filter.</div></div>`;
      }
    }

    search?.addEventListener("input", render);
    filter?.addEventListener("change", render);
    render();
  }

  loadPubs().catch(() => {
    const list = document.getElementById("pubList");
    if (list) list.innerHTML = `<div class="pub"><div class="title">Could not load publications.</div><div class="meta">Make sure you are serving the site (not opening the file directly), or keep publications embedded in HTML.</div></div>`;
  });

  // Expose tiny helper for contact form
  window.Site = {
    sendMessage(evt) {
      evt.preventDefault();
      const form = evt.target;
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const msg = form.message.value.trim();

      const subject = encodeURIComponent(`Website message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
      // Replace the email below if you fork this template
      window.location.href = `mailto:${encodeURIComponent("karyal@nebraska.edu")}?subject=${subject}&body=${body}`;
      form.reset();
      return false;
    }
  };
})();
