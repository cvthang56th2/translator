// define a handler
function doc_keyUp(e: KeyboardEvent) {
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyE') {
    const activeElement = document.activeElement
    if (activeElement && activeElement.value) {
      chrome.runtime.sendMessage({
        action: "translate",
        data: {
          text: activeElement.value
        }
      }, function(response: any) {
        activeElement.value = response.translatedText
      });
    }
  }
}
document.addEventListener('keyup', doc_keyUp, false);

export { }
