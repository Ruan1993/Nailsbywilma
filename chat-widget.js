const MODEL_NAME = "gemini-2.5-flash";
const CHAT_ENDPOINT = "https://www.rcdigitalcreations.co.za/api/chat";

const WEBSITE_CONTEXT = `--- NAILS BY WILMA CONTEXT --- 
  
 BUSINESS OVERVIEW: 
 Name: Nails by Wilma 
 Owner: Wilma Prinsloo 
 Location: 27 Prinsloo Drive, Still Bay West, Stilbaai. 
 Tagline: "Professional Nail Services & Art | Best in Still Bay" 
 Contact: wilmajprinsloo@gmail.com | WhatsApp/Phone: +27 63 597 8505 
 Mission: To provide professional, artistic, and luxurious nail care and beauty services that leave clients feeling pampered and polished. 
  
 EXPERIENCE: 
 Wilma has been doing nails for more than 15 years, bringing a wealth of experience and skill to her work. She officially started "Nails by Wilma" early in 2025. 
  
 OPERATING HOURS: 
 - Monday to Friday: 08:00 - 17:00 
 - Saturday: 08:00 - 13:00 
 - Sunday & Public Holidays: Closed 
 (Note to Bella: If someone asks for a slot outside these times, ask them to WhatsApp Wilma directly to check availability.) 
  
 SERVICES & PRICING: 
 (Note to Bella: If a price isn't listed here, ask the client to WhatsApp for a custom quote.) 
 (Note to Bella: Always show the standard rate first, then the seasonal rate in this exact style: Service Name: R___, Seasonal rate: R___.) 
 
 1. NAIL SERVICES 
    - Gel Overlay on Natural Nails: R320, Seasonal rate: R350 
    - Spa Pedicure & Gel: R200, Seasonal rate: R250 
    - Tips & Gel Overlay: R450, Seasonal rate: R480 
    - Extensions (Build with Poly Gel): R450, Seasonal rate: R480 
    - Soak-off Only: R60, Seasonal rate: R100 
 
 2. BEAUTY EXTRAS 
    - Eyebrow Shaping (Waxing): R80, Seasonal rate: R100 
    - Eyebrow Tinting: R60, Seasonal rate: R100 
    - Combo (Wax & Tint): R150, Seasonal rate: R200 
 
 3. Seasonal rates apply during the April and December holidays. Explain this clearly and warmly if a client asks why the price changes. 
 
 ADDITIONAL SERVICES (GUESTHOUSE): 
 We also have a guesthouse named "De Brakke" located in Stilbaai West. 
 Website: https://www.debrakke.co.za/  
 For prices and appointments for the guesthouse, clients can also contact Wilma directly. 
  
 BOOKING & POLICIES: 
 - Booking Method: WhatsApp is best (+27 63 597 8505). 
 - Location: Home studio at 27 Prinsloo Drive, Still Bay West. 
 - Late Policy: Please arrive on time. >15 mins late may require rescheduling. 
 - Reviews: Clients can leave a review on Google here: https://www.google.com/maps/place//data=!4m3!3m2!1s0x1dd6c1afaea257ab:0xf4da84ea1d8128f4!12e1?source=g.page.m._&laa=merchant-review-solicitation  
  
 TONE & PERSONALITY (BELLA): 
 - Name: Bella. 
 - Persona: A sophisticated, warm, and feminine beauty assistant. 
 - Tone: Welcoming, polished, professional, and encouraging. Do not call clients pet names like "lovely" or "darling". Use emojis like 💅, ✨, 🌸, 💖. 
 - Key Phrase: "Your perfect nails are just an appointment away!" 
 - Formatting: When listing services or prices, please use commas for better readability, and keep the wording aligned with the website. Ensure perfect grammar and punctuation in all responses.
  
 FAQ ANSWERS: 
 Q: Do you do acrylics? 
 A: No, we specialize in gel products and nail art but we only use the best products (Bio Sculpture). Wilma is a certified Nail Technician at Bio Sculpture and clients come back with nails after 5 to 6 weeks that still look great. 
  
 Q: Can I bring a reference photo? 
 A: Absolutely! Wilma loves recreating designs or creating custom art based on your inspiration. 
  
 Q: How long does a set take? 
 A: Typically 1 to 2.5 hours depending on the complexity of the art. 
  
 Q: Where are you located? 
 A: We are at 27 Prinsloo Drive, Still Bay West. 
  
 Q: Who made this website? 
 A: This website was made by Ruan from RC Digital Creations. You can contact them at https://www.rcdigitalcreations.co.za/  or via WhatsApp at 063 473 3098. 
 `;

let websiteContent = WEBSITE_CONTEXT;
let chatContainer;
let userInput;
let sendButton;
let loadingIndicator;
let mainChatWindow;
let isChatOpen = false;
let chatHistory = [];
let typingMessageElement = null;

function toggleChatWindow() {
  isChatOpen = !isChatOpen;
  if (isChatOpen) {
    mainChatWindow.classList.remove("translate-y-full", "opacity-0");
    mainChatWindow.classList.add("translate-y-0", "opacity-100");
    if (userInput) userInput.focus();
  } else {
    mainChatWindow.classList.remove("translate-y-0", "opacity-100");
    mainChatWindow.classList.add("translate-y-full", "opacity-0");
  }
}

function createMessageElement(text, sender) {
  const isUser = sender === "user";
  const messageDiv = document.createElement("div");
  messageDiv.className = `flex ${isUser ? "justify-end" : "justify-start"}`;
  const bubble = document.createElement("div");
  bubble.className = isUser ? "bella-user-bubble" : "bella-ai-bubble";
  if (!isUser) {
    const senderLabel = document.createElement("p");
    senderLabel.className = "bella-ai-label";
    senderLabel.textContent = "Bella";
    bubble.appendChild(senderLabel);
  }
  const content = document.createElement("p");
  content.textContent = text;
  bubble.appendChild(content);
  messageDiv.appendChild(bubble);
  return messageDiv;
}


function openChatAndFocus() {
  if (!isChatOpen) toggleChatWindow();
  if (userInput) userInput.focus();
}

function setQuickPrompt(text) {
  if (!userInput) return;
  openChatAndFocus();
  userInput.value = text;
  userInput.focus();
}

function createQuickActionsElement() {
  const wrap = document.createElement("div");
  wrap.className = "bella-quick-actions";

  const title = document.createElement("p");
  title.className = "bella-quick-actions-title";
  title.textContent = "Popular options:";
  wrap.appendChild(title);

  const actions = [
    { label: "View Prices 💅", prompt: "Can you show me the prices?" },
    { label: "Book Appointment 📅", prompt: "I would like to book an appointment." },
    { label: "Ask About Designs ✨", prompt: "Can I bring a reference photo and ask about custom nail designs?" },
  ];

  const row = document.createElement("div");
  row.className = "bella-quick-actions-row";

  actions.forEach((action) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bella-quick-action-btn";
    btn.textContent = action.label;
    btn.addEventListener("click", () => setQuickPrompt(action.prompt));
    row.appendChild(btn);
  });

  wrap.appendChild(row);
  return wrap;
}

function maybeAddProactiveSuggestions(messageElement, text) {
  const lowerText = text.toLowerCase();
  const prompts = [];

  if (
    lowerText.includes("price") ||
    lowerText.includes("prices") ||
    lowerText.includes("service") ||
    lowerText.includes("overlay") ||
    lowerText.includes("pedicure") ||
    lowerText.includes("brow")
  ) {
    prompts.push({ label: "Would you like to book? 💖", prompt: "I would like to book this service." });
  }

  const isAlreadyDiscussingPrices =
    lowerText.includes("price") || lowerText.includes("prices");

  if (
    lowerText.includes("book") ||
    lowerText.includes("appointment") ||
    lowerText.includes("available") ||
    lowerText.includes("slot") ||
    lowerText.includes("whatsapp")
  ) {
    if (!isAlreadyDiscussingPrices) {
      prompts.push({ label: "I can show prices 💅", prompt: "Can you show me the prices first?" });
    }
    prompts.push({ label: "Book Appointment 📅", prompt: "I would like to book an appointment." });
  }

  if (
    lowerText.includes("design") ||
    lowerText.includes("art") ||
    lowerText.includes("reference") ||
    lowerText.includes("photo")
  ) {
    prompts.push({ label: "Ask About Custom Designs ✨", prompt: "Can I bring a reference photo for a custom design?" });
  }

  if (lowerText.includes("december") || lowerText.includes("quote")) {
    prompts.push({ label: "Contact Wilma on WhatsApp 💬", prompt: "Please share Wilma's WhatsApp booking details." });
  }

  const uniquePrompts = prompts.filter(
    (item, index, arr) => arr.findIndex((entry) => entry.label === item.label) === index
  );

  if (!uniquePrompts.length) return;

  const bubble = messageElement.querySelector(".bella-ai-bubble");
  if (!bubble) return;

  const suggest = document.createElement("div");
  suggest.className = "bella-proactive-suggestions";

  const label = document.createElement("p");
  label.className = "bella-proactive-label";
  label.textContent = "You can also:";
  suggest.appendChild(label);

  const row = document.createElement("div");
  row.className = "bella-proactive-row";

  uniquePrompts.slice(0, 3).forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bella-proactive-btn";
    btn.textContent = item.label;
    btn.addEventListener("click", () => setQuickPrompt(item.prompt));
    row.appendChild(btn);
  });

  suggest.appendChild(row);
  bubble.appendChild(suggest);
}

function appendMessage(text, sender) {
  const messageElement = createMessageElement(text, sender);
  
  if (sender === "ai") {
    const lowerText = text.toLowerCase();
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "flex gap-2 mt-3 flex-wrap";
    let hasButtons = false;
    let buttonsHTML = "";

    // Contact Buttons Logic
    if (lowerText.includes("call") || lowerText.includes("whatsapp") || lowerText.includes("book") || lowerText.includes("contact") || lowerText.includes("number")) {
       buttonsHTML += `
          <a href="https://wa.me/27635978505?text=Hi%20Wilma%2C%20I%27d%20like%20to%20book%20an%20appointment" target="_blank" style="background-color: #25D366;" class="px-4 py-2 text-white rounded-full text-sm hover:opacity-90 transition-opacity no-underline flex items-center gap-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/></svg>
            WhatsApp Wilma
          </a>
          <a href="tel:+27635978505" class="px-4 py-2 bg-pink-500 text-white rounded-full text-sm hover:bg-pink-600 transition-colors no-underline shadow-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call Salon
          </a>
       `;
       hasButtons = true;
    }

    // Review Button Logic
    if (lowerText.includes("review") || lowerText.includes("google") || lowerText.includes("feedback")) {
       buttonsHTML += `
          <a href="https://www.google.com/maps/place//data=!4m3!3m2!1s0x1dd6c1afaea257ab:0xf4da84ea1d8128f4!12e1?source=g.page.m._&laa=merchant-review-solicitation" target="_blank" class="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors no-underline shadow-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/></svg>
            Leave a Review
          </a>
       `;
       hasButtons = true;
    }

    if (hasButtons) {
        buttonsContainer.innerHTML = buttonsHTML;
        const bubble = messageElement.querySelector(".bella-ai-bubble");
        if (bubble) bubble.appendChild(buttonsContainer);
    }
  }
  
  if (sender === "ai") {
    maybeAddProactiveSuggestions(messageElement, text);
  }

  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function setChatState(isLoading) {
  sendButton.disabled = isLoading;
  userInput.disabled = isLoading;
  loadingIndicator.classList.toggle("hidden", !isLoading);
  if (isLoading) {
    if (!typingMessageElement) {
      typingMessageElement = createMessageElement("Bella is typing...", "ai");
      chatContainer.appendChild(typingMessageElement);
    }
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } else {
    if (typingMessageElement && typingMessageElement.parentNode) {
      typingMessageElement.parentNode.removeChild(typingMessageElement);
    }
    typingMessageElement = null;
  }
}

function initializeChatbot() {
  if (!chatContainer) return;
  const firstBubble = chatContainer.querySelector(".bella-ai-bubble");
  if (firstBubble && !firstBubble.querySelector(".bella-quick-actions")) {
    firstBubble.appendChild(createQuickActionsElement());
  }
}

async function sendMessage() {
  const query = userInput.value.trim();
  if (!query || websiteContent.trim() === "") {
    if (websiteContent.trim() === "")
      appendMessage(
        "I haven't been trained yet. Please add content to the training area.",
        "ai"
      );
    return;
  }
  appendMessage(query, "user");
  userInput.value = "";
  setChatState(true);
  chatHistory.push({ role: "user", parts: [{ text: query }] });
  if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);
  const MAX_RETRIES = 5;
  let retryCount = 0;
  while (retryCount < MAX_RETRIES) {
    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          context: websiteContent,
          history: chatHistory,
          botName: "Bella",
          businessName: "Nails by Wilma",
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status} ${response.statusText} - ${errorText}`
        );
      }
      const result = await response.json();
      const aiResponseText = result?.text || "";
      appendMessage(aiResponseText || "No response available.", "ai");
      if (aiResponseText) {
        chatHistory.push({ role: "model", parts: [{ text: aiResponseText }] });
      }
      setChatState(false);
      return;
    } catch (error) {
      retryCount++;
      if (retryCount >= MAX_RETRIES) {
        appendMessage(
          "I apologize, but I am unable to connect right now. Please try again later.",
          "ai"
        );
        setChatState(false);
        return;
      }
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

const CHAT_WIDGET_HTML = `<div id="chatbot-widget-container">
  <button id="chat-toggle-button" class="fixed bottom-6 right-6 z-50 text-white p-3 rounded-full shadow-2xl transition duration-300 flex items-center justify-center group">
    <span class="absolute top-0 right-0 flex h-4 w-4 -mt-1 -mr-1">
      <span class="absolute inline-flex h-full w-full rounded-full opacity-75" style="background-color:#ef4444;animation:ping 1s cubic-bezier(0,0,0.2,1) infinite;"></span>
      <span class="relative inline-flex rounded-full h-4 w-4 border-2 border-white" style="background-color:#ef4444;"></span>
    </span>
    <style>@keyframes ping{75%,100%{transform:scale(2);opacity:0}}</style>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <!-- Head -->
      <rect x="4" y="5" width="16" height="14" rx="4" fill="#fce7f3" stroke="white" stroke-width="1.5"/>
      <!-- Eyes -->
      <circle cx="9" cy="11" r="1.5" fill="#374151"/>
      <circle cx="15" cy="11" r="1.5" fill="#374151"/>
      <!-- Lashes Left -->
      <path d="M7.5 9.5L6.5 8.5" stroke="#374151" stroke-width="1" stroke-linecap="round"/>
      <path d="M9 9L9 7.5" stroke="#374151" stroke-width="1" stroke-linecap="round"/>
      <!-- Lashes Right -->
      <path d="M16.5 9.5L17.5 8.5" stroke="#374151" stroke-width="1" stroke-linecap="round"/>
      <path d="M15 9L15 7.5" stroke="#374151" stroke-width="1" stroke-linecap="round"/>
      <!-- Blush -->
      <circle cx="7" cy="14" r="1.5" fill="#f472b6" opacity="0.4"/>
      <circle cx="17" cy="14" r="1.5" fill="#f472b6" opacity="0.4"/>
      <!-- Smile -->
      <path d="M10 15C10 15 11 16 12 16C13 16 14 15 14 15" stroke="#374151" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Bow -->
      <path d="M12 3C12 3 10 2 9 3C8 4 9 5 10 5L12 5.5L14 5C15 5 16 4 15 3C14 2 12 3 12 3Z" fill="#ffffff"/>
      <circle cx="12" cy="5.5" r="1" fill="#be185d"/>
    </svg>
  </button>
  <div id="main-chat-window" class="fixed bottom-20 md:bottom-24 right-4 z-40 w-[360px] max-w-[92vw] bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[60vh] md:h-[600px] min-h-[420px] max-h-[640px] transform translate-y-full opacity-0 transition-all duration-300">
    <header class="p-4 text-white shadow-md flex items-start justify-between gap-3 flex-shrink-0">
      <div class="flex items-center gap-3 min-w-0">
        <div class="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 ring-1 ring-white/30 overflow-hidden flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-pink-100"> 
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.175 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.75 3c1.99 0 3.751.983 4.828 2.475C13.651 3.983 15.412 3 17.402 3 20.437 3 22.9 5.322 22.9 8.25c0 3.924-2.438 7.11-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /> 
          </svg>
        </div>
        <div class="flex flex-col min-w-0">
          <h1 class="text-xl font-bold leading-tight">Bella</h1>
          <div class="text-xs opacity-90">Beauty Assistant</div>
        </div>
      </div>
      <button id="chat-close-button" type="button" aria-label="Close chat" class="h-9 w-9 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white border border-white/25 flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </header>
    <div id="chat-container" class="chat-container flex-grow overflow-y-auto p-4 space-y-4">
      <div class="flex justify-start">
        <div class="bella-ai-bubble">
          <p class="bella-ai-label">Bella</p>
          <p class="text-sm">Hi, I’m Bella. Your personal beauty assistant. I can help with prices, bookings, services, and custom nail design ideas.</p>
        </div>
      </div>
      <div id="loading-indicator" class="hidden flex justify-start">
        <div class="bella-ai-bubble">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 rounded-full" style="background-color:#ec4899;animation:bounce 1s infinite;"></div>
            <div class="w-2 h-2 rounded-full" style="background-color:#ec4899;animation:bounce 1s infinite;"></div>
            <div class="w-2 h-2 rounded-full" style="background-color:#ec4899;animation:bounce 1s infinite;"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 border-t border-gray-200 flex space-x-3 bg-white">
      <input type="text" id="user-input" placeholder="Type your message..." class="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none transition duration-150 bg-white text-gray-900 placeholder-gray-500" />
      <button id="send-button" class="p-3 rounded-full shadow-lg flex-shrink-0" style="background-color:#ec4899;color:#fff">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send">
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      </button>
    </div>
  </div>
</div>`;

document.addEventListener("DOMContentLoaded", async () => {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = CHAT_WIDGET_HTML;
  document.body.appendChild(wrapper);
  chatContainer = document.getElementById("chat-container");
  userInput = document.getElementById("user-input");
  sendButton = document.getElementById("send-button");
  loadingIndicator = document.getElementById("loading-indicator");
  mainChatWindow = document.getElementById("main-chat-window");
  document
    .getElementById("chat-toggle-button")
    .addEventListener("click", toggleChatWindow);
  const closeBtn=document.getElementById("chat-close-button"); if(closeBtn){closeBtn.addEventListener("click",toggleChatWindow);}

  if (sendButton) {
    sendButton.addEventListener("click", sendMessage);
  }
  if (userInput) {
    userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }
  initializeChatbot();
});
