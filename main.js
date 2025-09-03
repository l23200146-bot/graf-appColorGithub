// Utilidades
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const toHex2 = (n) => n.toString(16).padStart(2, "0").toUpperCase();
const rgbToHex = (r, g, b) => `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

// Determina color de texto (blanco/negro) según luminancia
const readableTextColor = (r, g, b) => {
  const [R, G, B] = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  return L > 0.5 ? "#000" : "#FFF";
};

// Referencias
const rangeR = document.getElementById("rangeR");
const rangeG = document.getElementById("rangeG");
const rangeB = document.getElementById("rangeB");

const inputR = document.getElementById("inputR");
const inputG = document.getElementById("inputG");
const inputB = document.getElementById("inputB");

const outR = document.getElementById("outR");
const outG = document.getElementById("outG");
const outB = document.getElementById("outB");

const hexOut = document.getElementById("hexOut");
const preview = document.querySelector(".preview");

const copyBtn = document.getElementById("copyBtn");
const randomBtn = document.getElementById("randomBtn");
const resetBtn = document.getElementById("resetBtn");
const colorPicker = document.getElementById("colorPicker");

// Actualiza UI
function render(r, g, b) {
  r = clamp(parseInt(r), 0, 255);
  g = clamp(parseInt(g), 0, 255);
  b = clamp(parseInt(b), 0, 255);

  // sincronizar inputs
  rangeR.value = r;
  rangeG.value = g;
  rangeB.value = b;

  inputR.value = r;
  inputG.value = g;
  inputB.value = b;

  outR.textContent = r;
  outG.textContent = g;
  outB.textContent = b;

  const hex = rgbToHex(r, g, b);
  hexOut.textContent = hex;

  preview.style.backgroundColor = `rgb(${r},${g},${b})`;
  preview.style.color = readableTextColor(r, g, b);

  colorPicker.value = hex; // sincronizar con picker
}

// Eventos: sliders
[rangeR, rangeG, rangeB].forEach((el, idx) =>
  el.addEventListener("input", () => {
    render(rangeR.value, rangeG.value, rangeB.value);
  })
);

// Eventos: inputs numéricos
[inputR, inputG, inputB].forEach((el, idx) =>
  el.addEventListener("input", () => {
    render(inputR.value, inputG.value, inputB.value);
  })
);

// Evento: color picker
colorPicker.addEventListener("input", () => {
  const { r, g, b } = hexToRgb(colorPicker.value);
  render(r, g, b);
});

// Botones
copyBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(hexOut.textContent.trim());
  copyBtn.textContent = "¡Copiado!";
  setTimeout(() => (copyBtn.textContent = "Copiar HEX"), 1200);
});

randomBtn.addEventListener("click", () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  render(r, g, b);
});

resetBtn.addEventListener("click", () => {
  render(0, 0, 0);
});

// Inicial
render(0, 0, 0);
