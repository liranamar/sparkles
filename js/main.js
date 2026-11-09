// Scales every .stage composition (fixed px layout copied from Figma)
// to the width available in its container.
(function () {
  const stages = document.querySelectorAll(".stage");
  if (!stages.length) return;

  const fit = (stage) => {
    const w = parseFloat(getComputedStyle(stage).getPropertyValue("--w"));
    if (!w) return;
    stage.style.setProperty("--s", Math.min(1, stage.clientWidth / w));
  };

  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver((entries) => entries.forEach((e) => fit(e.target)));
    stages.forEach((s) => ro.observe(s));
  } else {
    const all = () => stages.forEach(fit);
    window.addEventListener("resize", all);
    all();
  }
})();

// Hero/background videos: play only while visible, respect reduced motion.
(function () {
  const vids = document.querySelectorAll("video[data-autoplay]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  vids.forEach((v) => {
    v.muted = true;
    if (reduce) { v.removeAttribute("autoplay"); return; }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()))
        .observe(v);
    }
  });
})();
