const CONFIG = {
  tokenAddress: "",
  pumpFunUrl: "",
  twitter: "https://x.com/vaginaonx",
  telegram: "https://t.me/vaginaontg",
};

function getPumpFunUrl() {
  if (CONFIG.pumpFunUrl) return CONFIG.pumpFunUrl;
  if (CONFIG.tokenAddress) return `https://pump.fun/coin/${CONFIG.tokenAddress}`;
  return "https://pump.fun";
}

function initContract() {
  const display = document.getElementById("ca-display");
  const copyBtn = document.getElementById("copy-ca");
  const toast = document.getElementById("copy-toast");
  const address = CONFIG.tokenAddress;

  if (!address) {
    display.textContent = "TBA";
    copyBtn.disabled = true;
    copyBtn.title = "Contract address coming soon";
    return;
  }

  display.textContent = address;

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(address);
      copyBtn.classList.add("copied");
      copyBtn.textContent = "Copied";
      toast.textContent = "Contract address copied.";
      toast.classList.add("show");

      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.textContent = "Copy";
        toast.classList.remove("show");
      }, 2500);
    } catch {
      toast.textContent = "Copy failed — select and copy manually.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }
  });
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initSocialLinks() {
  const pumpUrl = getPumpFunUrl();

  document.querySelectorAll("[data-pumpfun]").forEach((el) => {
    el.href = pumpUrl;
  });

  document.querySelectorAll("[data-telegram]").forEach((el) => {
    if (CONFIG.telegram) el.href = CONFIG.telegram;
  });

  document.querySelectorAll("[data-twitter]").forEach((el) => {
    if (CONFIG.twitter) el.href = CONFIG.twitter;
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initReveal() {
  if (!("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("js-reveal");

  document.querySelectorAll("[data-reveal-group]").forEach((group) => {
    [...group.children].forEach((child, i) => child.style.setProperty("--i", i));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll("[data-reveal], [data-reveal-group]").forEach((el) => observer.observe(el));
}

function initSparks() {
  const container = document.querySelector(".hero-sparks");
  if (!container || prefersReducedMotion()) return;

  const glyphs = ["(", ")", "(", ")", "·", "♡"];
  const count = window.innerWidth < 720 ? 10 : 18;

  for (let i = 0; i < count; i++) {
    const spark = document.createElement("span");
    const rand = (min, max) => min + Math.random() * (max - min);
    spark.textContent = glyphs[i % glyphs.length];
    spark.style.left = `${rand(0, 100)}%`;
    spark.style.fontSize = `${rand(1, 2.6)}rem`;
    spark.style.setProperty("--dur", `${rand(10, 20)}s`);
    spark.style.setProperty("--delay", `${rand(-20, 0)}s`);
    spark.style.setProperty("--dx", `${rand(-80, 80)}px`);
    spark.style.setProperty("--spin", `${rand(-90, 90)}deg`);
    spark.style.setProperty("--alpha", rand(0.25, 0.75).toFixed(2));
    container.appendChild(spark);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initContract();
  initNav();
  initSocialLinks();
  initReveal();
  initSparks();
});
