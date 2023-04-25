
import { generateRequestUrl, normaliseResponse } from 'google-translate-api-browser';

async function translateSelectedText(text: string) {
  const url = generateRequestUrl(text, { from: "vi", to: "en" });

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
  if (request.action == "translate" && request.data && request.data.text) {
    translateSelectedText(request.data.text).then(translatedText => {
      sendResponse({ translatedText });
    })
  }
  return true;
});

export {
}
