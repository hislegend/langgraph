const $ = (id) => document.getElementById(id);

const formatKRW = (value) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Number(value || 0)));

const linesToList = (text, fallback) => {
  const lines = text
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

  return lines.length ? lines : [fallback];
};

function renderList(target, items) {
  target.innerHTML = "";
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    target.appendChild(li);
  }
}

function updatePreview() {
  const customerName = $("customerName").value.trim() || "고객";
  const consultDate = $("consultDate").value || "-";
  const productName = $("productName").value.trim() || "-";
  const agentContact = $("agentContact").value.trim() || "-";
  const basePrice = Number($("basePrice").value || 0);
  const discountPrice = Number($("discountPrice").value || 0);
  const finalPrice = Math.max(basePrice - discountPrice, 0);

  $("previewCustomer").textContent = `${customerName} 님 상담 안내`;
  $("previewMeta").textContent = `상담일: ${consultDate} | 담당자: ${agentContact}`;
  $("previewCost").textContent = `월 ${formatKRW(finalPrice)} (기본료 ${formatKRW(basePrice)} - 할인 ${formatKRW(discountPrice)})`;
  $("previewProduct").textContent = `상품: ${productName}`;
  $("previewContact").textContent = agentContact;

  renderList(
    $("previewBenefits"),
    linesToList($("benefits").value, "제공 혜택이 없습니다.")
  );
  renderList(
    $("previewTodos"),
    linesToList($("todos").value, "추가로 진행할 사항이 없습니다.")
  );
}

async function downloadSummaryImage() {
  updatePreview();

  const card = $("summaryCard");
  const canvas = await html2canvas(card, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
  });

  const link = document.createElement("a");
  const dateText = $("consultDate").value || new Date().toISOString().slice(0, 10);
  const customerName = $("customerName").value.trim() || "고객";
  link.download = `코웨이_상담요약_${customerName}_${dateText}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

$("previewBtn").addEventListener("click", updatePreview);
$("downloadBtn").addEventListener("click", () => {
  downloadSummaryImage().catch((error) => {
    console.error(error);
    alert("이미지 생성 중 오류가 발생했습니다.");
  });
});

updatePreview();
