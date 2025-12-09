// ---------------- GLOBAL VARIABLES ----------------
let inbox = null;
let messages = [];
let selectedMsgIndex = null;
let countdownInterval = null;
let demoCards = {}; // Store demo cards per inbox

// ---------------- DOM ELEMENTS ----------------
const addressInput = document.getElementById("addressInput");
const domainSelect = document.getElementById("domainSelect");
const createBtn = document.getElementById("createBtn");
const deleteInboxBtn = document.getElementById("deleteInboxBtn");
const createdInfo = document.getElementById("createdInfo");
const countdown = document.getElementById("countdown");
const messageList = document.getElementById("messageList");
const msgSubject = document.getElementById("msgSubject");
const msgFrom = document.getElementById("msgFrom");
const msgDate = document.getElementById("msgDate");
const msgBody = document.getElementById("msgBody");
const newBadge = document.getElementById("newBadge");

const getDemoCardBtn = document.getElementById("getDemoCardBtn");
const demoCard = document.getElementById("demoCard");
const themeToggle = document.getElementById("themeToggle");
const enBtn = document.getElementById("enFooterBtn");
const urBtn = document.getElementById("urFooterBtn");

const customSubject = document.getElementById("customSubject");
const customBody = document.getElementById("customBody");
const attachmentInput = document.getElementById("attachmentInput");
const simulateBtn = document.getElementById("simulateBtn");
const replyInput = document.getElementById("replyInput");
const replyBtn = document.getElementById("replyBtn");

// Current language state
let currentLang = "en";

// ---------------- DEMO CARD GENERATOR ----------------
function generateDemoCard(email) {
  return {
    holder: email.split("@")[0],
    number: "4" + Math.floor(100000000000000 + Math.random() * 900000000000000)
      .toString()
      .replace(/(.{4})/g, "$1 ")
      .trim(),
    expiry: "12/29",
    cvv: Math.floor(100 + Math.random() * 900).toString()
  };
}

function showDemoCard(email) {
  if (!demoCards[email]) return;
  const card = demoCards[email];
  demoCard.innerHTML = `
    <p><b>${currentLang === "en" ? "Card Holder:" : "کارڈ ہولڈر:"}</b> ${card.holder}</p>
    <p><b>${currentLang === "en" ? "Card Number:" : "کارڈ نمبر:"}</b> ${card.number}</p>
    <p><b>${currentLang === "en" ? "Expiry:" : "میعاد ختم ہونے کی تاریخ:"}</b> ${card.expiry}</p>
    <p><b>${currentLang === "en" ? "CVV:" : "سی وی وی:"}</b> ${card.cvv}</p>
  `;
}

// ---------------- INBOX LIST ----------------
function updateInboxList() {
  messageList.innerHTML = "";
  messages.forEach((msg, index) => {
    const li = document.createElement("li");
    const preview = msg.body.substring(0, 30) + (msg.body.length > 30 ? "..." : "");
    li.textContent = `${msg.subject} - ${msg.from} (${preview})`;
    li.addEventListener("click", () => {
      selectedMsgIndex = index;
      openMessage();
      newBadge.textContent = "0";
    });
    messageList.appendChild(li);
  });
}

function openMessage() {
  if (selectedMsgIndex === null) return;
  const msg = messages[selectedMsgIndex];
  msgSubject.textContent = msg.subject;
  msgFrom.textContent = `${currentLang === "en" ? "From:" : "سے:"} ${msg.from}`;
  msgDate.textContent = `${currentLang === "en" ? "Received:" : "موصول:"} ${msg.date.toLocaleString()}`;

  let content = `<p>${msg.body}</p>`;
  if (msg.replies.length) {
    content += `<hr><h4>${currentLang === "en" ? "Replies:" : "جوابات:"}</h4>`;
    msg.replies.forEach(r => {
      content += `<p><b>${r.sender}:</b> ${r.body} <i>(${r.date.toLocaleTimeString()})</i></p>`;
    });
  }
  msgBody.innerHTML = content;
}

// ---------------- COUNTDOWN ----------------
function startCountdown(seconds) {
  if (countdownInterval) clearInterval(countdownInterval);
  let remaining = seconds;
  countdown.textContent = formatTime(remaining);
  countdownInterval = setInterval(() => {
    remaining--;
    countdown.textContent = formatTime(remaining);
    if (remaining <= 0) clearInterval(countdownInterval);
  }, 1000);
}

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}${currentLang === "en" ? "h" : "گھنٹے"} ${m}${currentLang === "en" ? "m" : "منٹ"} ${s}${currentLang === "en" ? "s" : "سیکنڈ"}`;
}

// ---------------- CREATE INBOX ----------------
createBtn.addEventListener("click", () => {
  const localPart = addressInput.value.trim() || "user" + Math.floor(Math.random() * 10000);
  inbox = localPart + domainSelect.value;

  createdInfo.textContent = currentLang === "en" ? `Inbox created: ${inbox}` : `ان باکس بنایا گیا: ${inbox}`;
  messages = [];
  selectedMsgIndex = null;
  updateInboxList();
  startCountdown(3600);
  newBadge.textContent = "0";

  demoCards[inbox] = generateDemoCard(inbox);
  showDemoCard(inbox);
});

// ---------------- DELETE INBOX ----------------
deleteInboxBtn.addEventListener("click", () => {
  if (!inbox) return alert(currentLang === "en" ? "No inbox to delete" : "کوئی ان باکس نہیں");
  if (!confirm(currentLang === "en" ? "Delete inbox?" : "ان باکس حذف کریں؟")) return;

  delete demoCards[inbox];
  inbox = null;
  messages = [];
  selectedMsgIndex = null;
  messageList.innerHTML = "";
  msgSubject.textContent = currentLang === "en" ? "No message selected" : "کوئی پیغام منتخب نہیں";
  msgFrom.textContent = "";
  msgDate.textContent = "";
  msgBody.textContent = currentLang === "en" ? "No message selected" : "کوئی پیغام منتخب نہیں";
  createdInfo.textContent = currentLang === "en" ? "Inbox deleted" : "ان باکس حذف کیا گیا";
  countdown.textContent = "";
  demoCard.innerHTML = "";
  newBadge.textContent = "0";
});

// ---------------- SIMULATE RECEIVE MESSAGE ----------------
simulateBtn.addEventListener("click", () => {
  if (!inbox) return alert(currentLang === "en" ? "Please create inbox first" : "براہ کرم پہلے ان باکس بنائیں");
  const subject = customSubject.value.trim();
  const body = customBody.value.trim();
  const attachment = attachmentInput.value.trim();
  if (!subject || !body) return alert(currentLang === "en" ? "Enter subject & message" : "موضوع اور پیغام درج کریں");

  const newMsg = {
    from: "tempmail@system.com",
    subject,
    body,
    date: new Date(),
    attachments: attachment ? [attachment] : [],
    replies: []
  };

  messages.push(newMsg);
  customSubject.value = "";
  customBody.value = "";
  attachmentInput.value = "";

  updateInboxList();
  newBadge.textContent = parseInt(newBadge.textContent) + 1;
  selectedMsgIndex = messages.length - 1;
  openMessage();
});

// ---------------- REPLY ----------------
replyBtn.addEventListener("click", () => {
  if (selectedMsgIndex === null) return;
  const replyText = replyInput.value.trim();
  if (!replyText) return;

  const originalMsg = messages[selectedMsgIndex];
  const replyMsg = {
    from: inbox,
    subject: (currentLang === "en" ? "Re: " : "جواب: ") + originalMsg.subject,
    body: replyText,
    date: new Date(),
    attachments: [],
    replies: []
  };

  messages.push(replyMsg);
  replyInput.value = "";
  selectedMsgIndex = messages.length - 1;
  openMessage();
  updateInboxList();
  newBadge.textContent = parseInt(newBadge.textContent) + 1;
});

// ---------------- GET DEMO CARD ----------------
getDemoCardBtn.addEventListener("click", () => {
  if (!inbox) return alert(currentLang === "en" ? "Please create inbox first" : "براہ کرم پہلے ان باکس بنائیں");
  showDemoCard(inbox);
});

// ---------------- DARK MODE ----------------
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// ---------------- LANGUAGE SWITCH ----------------
enBtn.addEventListener("click", () => {
  currentLang = "en";
  refreshText();
});

urBtn.addEventListener("click", () => {
  currentLang = "ur";
  refreshText();
});

function refreshText() {
  // Header
  document.getElementById("title").textContent = currentLang === "en" ? "📧 Temporary Email Simulator" : "📧 عارضی ای میل سمیلیٹر";

  // Buttons
  createBtn.textContent = currentLang === "en" ? "➕ Create Inbox" : "➕ ان باکس بنائیں";
  simulateBtn.textContent = currentLang === "en" ? "📨 Simulate Receive" : "📨 موصول ہونے کا سمیولیشن";
  deleteInboxBtn.textContent = currentLang === "en" ? "🗑 Delete Inbox" : "🗑 ان باکس حذف کریں";
  getDemoCardBtn.textContent = currentLang === "en" ? "💳 Generate Demo Card" : "💳 ڈیمو کارڈ بنائیں";
  replyBtn.textContent = currentLang === "en" ? "Reply" : "جواب";

  // Labels & placeholders
  document.querySelector('label[for="addressInput"]').textContent = currentLang === "en" ? "Custom Inbox:" : "حسب ضرورت ان باکس:";
  document.querySelector('label[for="domainSelect"]').textContent = currentLang === "en" ? "Select Domain:" : "ڈومین منتخب کریں:";
  customSubject.placeholder = currentLang === "en" ? "Enter Subject" : "موضوع درج کریں";
  customBody.placeholder = currentLang === "en" ? "Enter Message Body" : "پیغام کا متن درج کریں";
  attachmentInput.placeholder = currentLang === "en" ? "Attachment filename" : "منسلک فائل کا نام";

  // Inbox info & demo card
  createdInfo.textContent = inbox ? (currentLang === "en" ? `Inbox created: ${inbox}` : `ان باکس بنایا گیا: ${inbox}`) : "";
  showDemoCard(inbox || "");
  openMessage();
  newBadge.textContent = newBadge.textContent;
}
