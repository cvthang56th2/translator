let timeout:any = null
function showToast(text = 'Copied!') {
  // Get the copybar DIV
  var el:any = document.getElementById("copybar");

  // Add the "show" class to DIV
  el.className = "show";
  el.innerHTML = text

  // After 3 seconds, remove the show class from DIV
  clearTimeout(timeout)
  timeout = setTimeout(function(){ el.className = el.className.replace("show", ""); }, 3000);
}

const node = document.createElement("div");
node.innerHTML = `
<div id="copybar"></div>
<style>
/* The copybar - position it at the bottom and in the middle of the screen */
#copybar {
  max-width: calc(100vw - 60px);
  visibility: hidden; /* Hidden by default. Visible on click */
  background-color: #333; /* Black background color */
  color: #fff; /* White text color */
  text-align: center; /* Centered text */
  border-radius: 2px; /* Rounded borders */
  padding: 16px; /* Padding */
  position: fixed; /* Sit on top of the screen */
  z-index: 9999; /* Add a z-index if needed */
  right: 20px;
  top: 30px;
}

#copybar p {
  margin-bottom: 4px;
  font-weight: 600;
}

/* Show the copybar when clicking on a button (class added with JavaScript) */
#copybar:hover {
  visibility: visible !important; /* Show the copybar */
  // animation: none !important;
}
#copybar.show {
  visibility: visible; /* Show the copybar */
  /* Add animation: Take 0.5 seconds to fade in and out the copybar.
  However, delay the fade out process for 2.5 seconds */
  // -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  // animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

/* Animations to fade the copybar in and out */
@-webkit-keyframes fadein {
  from {top: 0; opacity: 0;}
  to {top: 30px; opacity: 1;}
}

@keyframes fadein {
  from {top: 0; opacity: 0;}
  to {top: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {top: 30px; opacity: 1;}
  to {top: 0; opacity: 0;}
}

@keyframes fadeout {
  from {top: 30px; opacity: 1;}
  to {top: 0; opacity: 0;}
}
</style>
`

document.querySelector('body')?.appendChild(node);

let processing = false
// define a handler
function doc_keyUp(e: KeyboardEvent) {
  if (((e.ctrlKey && e.shiftKey) || (e.altKey && !e.ctrlKey && !e.shiftKey)) && (['KeyE', 'KeyV'].includes(e.code))) {
    getTextAndQuickTranslate(e.code === 'KeyE' ? 'vi-en' : 'en-vi')
  }
}

// @ts-ignore
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "quick-translate-vi-en") {
    getTextAndQuickTranslate('vi-en')
  }
  if (request.action === "quick-translate-en-vi") {
    getTextAndQuickTranslate('en-vi')
  }
});

function getTextAndQuickTranslate (type: string) {
  if (processing) {
    showToast(`<div>Please wait...</div>`)
    return
  }
  processing = true
  let getTextMethod = 'selection'
  let text = window.getSelection()?.toString()
  if (!text) {
    const activeElement:any = document.activeElement
    if (!activeElement) {
      return
    }
    text = activeElement.value
    getTextMethod = 'activeValue'
    if (!text) {
      getTextMethod = 'activeText'
      text = activeElement.innerText
    }
  }
  if (!text) {
    return
  }
  console.log('text', text)
  showToast(`<div>Processing...</div>`)
  // @ts-ignore
  chrome.runtime.sendMessage({
    action: "translate",
    data: {
      text,
      type
    }
  }, function(response: any) {
    const { translatedText } = response
    console.log(translatedText)
    switch (getTextMethod) {
      case 'selection':
      case 'activeText':
        navigator.clipboard.writeText(translatedText);
        showToast(`<p>Copied:</p><div>${translatedText}</div>`)
        if (getTextMethod === 'activeText') {
          selectActiveElement()
        }
        break;
      case 'activeValue':
        if (document.activeElement) {
          // @ts-ignore
          document.activeElement.value = translatedText
          showToast(`Done`)
        }
        break;
    }
    processing = false
  });
}

function selectActiveElement () {
  const element:any = document.activeElement; // get the currently focused element
  const range = document.createRange(); // create a new range object
  range.selectNodeContents(element); // select the contents of the element
  const selection:any = window.getSelection(); // get the current selection object
  selection.removeAllRanges(); // clear any existing selection
  selection.addRange(range); // add the new range to the selection
}

document.addEventListener('keyup', doc_keyUp, false);

export { }
