import html2canvas from "html2canvas";

const dataUrlToBlob = async (dataUrl) => {
  const res = await fetch(dataUrl);
  return res.blob();
};

export async function captureElementImage(element, { scale = 2.5, backgroundColor = "#ffffff" } = {}) {
  if (!element) return null;
  const canvas = await html2canvas(element, {
    scale,
    backgroundColor,
    useCORS: true,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });
  const dataUrl = canvas.toDataURL("image/png");
  return {
    dataUrl,
    width: canvas.width,
    height: canvas.height,
    toBlob: () => dataUrlToBlob(dataUrl),
  };
}

export function sliceImageDataUrl(dataUrl, width, height, sliceHeightPx) {
  const slices = [];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = sliceHeightPx;

  const img = document.createElement("img");
  img.src = dataUrl;

  return new Promise((resolve, reject) => {
    img.onload = () => {
      let y = 0;
      while (y < height) {
        const h = Math.min(sliceHeightPx, height - y);
        canvas.height = h;
        ctx.clearRect(0, 0, width, h);
        ctx.drawImage(img, 0, -y, width, height);
        slices.push({ dataUrl: canvas.toDataURL("image/png"), width, height: h });
        y += h;
      }
      resolve(slices);
    };
    img.onerror = reject;
  });
}
