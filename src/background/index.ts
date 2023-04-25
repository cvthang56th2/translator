
import { generateRequestUrl, normaliseResponse } from 'google-translate-api-browser';

async function translateSelectedText(text: string, type: string) {
  const url = generateRequestUrl(text, {
    from: type === 'en-vi' ? 'en' : 'vi',
    to: type === 'en-vi' ? 'vi' : 'en'
  });

  try {
    const response = await fetch(url);
    const data = await response.json();
    const normalizedData = normaliseResponse(data);
    return normalizedData.text;
  } catch (error) {
    console.error(error);
    return null;
  }
}
// @ts-ignore
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const { text, type } = request.data || {}
  if (request.action == "translate" && text) {
    translateSelectedText(text, type).then(translatedText => {
      sendResponse({ translatedText });
    })
  }
  return true;
});

// @ts-ignore
chrome.contextMenus.removeAll(function() {
  // @ts-ignore
  chrome.contextMenus.create({
    id: "quick-translate-en-vi",
    title: "English - Vietnamese (ALT + V or Ctrl + Shift + V)",
    contexts: ["selection"]
  }, function() {
    console.log("Context menu item English - Vietnamese created");
  });
  // @ts-ignore
  chrome.contextMenus.create({
    id: "quick-translate-vi-en",
    title: "Vietnamese - English (ALT + E or Ctrl + Shift + E)",
    contexts: ["selection"]
  }, function() {
    console.log("Context menu item Vietnamese - English created");
  });
})

// @ts-ignore
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "quick-translate-en-vi") {
    // @ts-ignore
    chrome.tabs.sendMessage(tab.id, {action: "quick-translate-en-vi"}, function(response) {
    });
  }
  if (info.menuItemId === "quick-translate-vi-en") {
    // @ts-ignore
    chrome.tabs.sendMessage(tab.id, {action: "quick-translate-vi-en"}, function(response) {
    });
  }
});
export {
}
