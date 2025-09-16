const palettePool = [
  "#ff4dff,#ffe600",
  "#f72585,#7209b7",
  "#2af598,#009efd",
  "#ffe53b,#ff2525",
  "#00f5d4,#9b5de5",
  "#fa709a,#fee140",
  "#f09819,#ff5858",
  "#43e97b,#38f9d7",
  "#30cfd0,#330867",
  "#ffe29f,#ffa99f",
  "#8a2387,#e94057",
  "#21d4fd,#b721ff"
];

const metaPool = [
  "UV sealed vinyl",
  "Glow dusted edges",
  "Weatherproof adhesive",
  "Soft-touch laminate",
  "Limited artist drop",
  "Scratchproof sheen",
  "Fast-peel backing",
  "Double die-cut edges",
  "High-flex film",
  "Chrome flash finish"
];

const customMetaPool = [
  "Hand-tagged prototype",
  "Studio proof edition",
  "One-off collector pull",
  "Artist proof",
  "Signed sample run"
];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomTilt = () => `${(Math.random() * 14 - 7).toFixed(2)}deg`;

const splitPalette = (value) =>
  (value || "#ff4dff,#ffe600")
    .split(",")
    .map((color) => color.trim())
    .slice(0, 2);

const setStickerStyle = (element, colors) => {
  const [colorA, colorB] = colors;
  element.style.setProperty("--color-a", colorA);
  element.style.setProperty("--color-b", colorB);
  element.style.setProperty("--rotate", randomTilt());
};

const escapeHtml = (text) =>
  text.replace(/[&<>'"]/g, (char) =>
    (
      {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      }[char] || char
    )
  );

document.addEventListener("DOMContentLoaded", () => {
  const stickerGrid = document.querySelector(".sticker-grid");
  const shuffleTriggers = document.querySelectorAll("[data-action='shuffle'], #shuffle-wall");
  const footerYear = document.getElementById("footer-year");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  if (stickerGrid) {
    stickerGrid.querySelectorAll(".sticker").forEach((sticker) => {
      const palette = splitPalette(sticker.dataset.colors);
      setStickerStyle(sticker, palette);
      sticker.dataset.colors = palette.join(",");
      sticker.dataset.meta = sticker.querySelector(".sticker-meta")?.textContent?.trim() || "";
    });
  }

  const shuffleStickers = () => {
    if (!stickerGrid) return;

    stickerGrid.querySelectorAll(".sticker").forEach((sticker) => {
      const colors = splitPalette(randomFrom(palettePool));
      setStickerStyle(sticker, colors);
      sticker.dataset.colors = colors.join(",");
      const metaSpan = sticker.querySelector(".sticker-meta");
      if (metaSpan) {
        const pool = sticker.dataset.custom === "true" ? customMetaPool : metaPool;
        metaSpan.textContent = randomFrom(pool);
      }
      sticker.classList.remove("pulse");
      // force reflow to restart animation
      // eslint-disable-next-line no-unused-expressions
      void sticker.offsetWidth;
      sticker.classList.add("pulse");
      setTimeout(() => sticker.classList.remove("pulse"), 1500);
    });
  };

  shuffleTriggers.forEach((trigger) => {
    trigger.addEventListener("click", shuffleStickers);
  });

  const form = document.getElementById("custom-sticker-form");
  if (form && stickerGrid) {
    const textInput = document.getElementById("sticker-text");
    const preview = document.getElementById("dynamic-sticker");
    const previewText = preview?.querySelector(".dynamic-text");
    const previewMeta = preview?.querySelector(".dynamic-meta");

    const getSelectedPalette = () => {
      const selected = form.querySelector("input[name='colorway']:checked");
      const labelText = selected?.parentElement?.querySelector("span")?.textContent?.trim();
      return {
        colors: splitPalette(selected?.value),
        label: labelText || "Pop Candy"
      };
    };

    const updatePreview = () => {
      const { colors, label } = getSelectedPalette();
      const text = (textInput?.value || textInput?.placeholder || "").trim();
      if (preview) {
        preview.style.setProperty("--color-a", colors[0]);
        preview.style.setProperty("--color-b", colors[1]);
      }
      if (previewText) {
        previewText.textContent = text.length ? text.toUpperCase() : (textInput?.placeholder || "").toUpperCase();
      }
      if (previewMeta) {
        previewMeta.textContent = `Custom mix • ${label}`;
      }
    };

    updatePreview();

    form.addEventListener("input", updatePreview);
    form.querySelectorAll("input[name='colorway']").forEach((input) => {
      input.addEventListener("change", updatePreview);
    });

    const announceNewSticker = (element) => {
      element.classList.add("pulse");
      setTimeout(() => element.classList.remove("pulse"), 1500);
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!textInput) return;

      const rawText = textInput.value.trim() || textInput.placeholder || "Custom Drop";
      const cleanText = escapeHtml(rawText);
      const { colors, label } = getSelectedPalette();
      const newSticker = document.createElement("article");
      newSticker.className = "sticker";
      newSticker.dataset.custom = "true";
      newSticker.dataset.colors = colors.join(",");
      newSticker.dataset.meta = label;

      setStickerStyle(newSticker, colors);

      const metaText = randomFrom(customMetaPool);
      newSticker.innerHTML = `
        <span class="sticker-title">${cleanText}</span>
        <span class="sticker-meta">${escapeHtml(`${label} • ${metaText}`)}</span>
      `;

      stickerGrid.prepend(newSticker);
      announceNewSticker(newSticker);

      textInput.value = "";
      form.reset();
      const firstPalette = form.querySelector("input[name='colorway']");
      if (firstPalette) {
        firstPalette.checked = true;
      }
      updatePreview();
      textInput.focus({ preventScroll: true });
    });
  }
});
