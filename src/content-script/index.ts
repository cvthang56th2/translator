// define a handler
function doc_keyUp(e: KeyboardEvent) {
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyE') {
    console.log('event')
    let activeElement = document.activeElement
    let text = activeElement?.value
    if (!text) {
      text = activeElement?.innerText
    }
    if (!activeElement || !text) {
      return
    }
    chrome.runtime.sendMessage({
      action: "translate",
      data: {
        text
      }
    }, function(response: any) {
      const { translatedText } = response
      console.log('translatedText', translatedText)
      if (activeElement.value) {
        activeElement.value = translatedText
      } else {
        navigator.clipboard.writeText(translatedText);
        selectActiveElement()
        showToast()
      }
    });
  }
}

function selectActiveElement () {
  const element = document.activeElement; // get the currently focused element
  const range = document.createRange(); // create a new range object
  range.selectNodeContents(element); // select the contents of the element
  const selection = window.getSelection(); // get the current selection object
  selection.removeAllRanges(); // clear any existing selection
  selection.addRange(range); // add the new range to the selection
}

document.addEventListener('keyup', doc_keyUp, false);

const node = document.createElement("div");
node.innerHTML = `
<div id="copybar">Copied!</div>
<style>
/* The copybar - position it at the bottom and in the middle of the screen */
#copybar {
  visibility: hidden; /* Hidden by default. Visible on click */
  background-color: #333; /* Black background color */
  color: #fff; /* White text color */
  text-align: center; /* Centered text */
  border-radius: 2px; /* Rounded borders */
  padding: 16px; /* Padding */
  position: fixed; /* Sit on top of the screen */
  z-index: 1; /* Add a z-index if needed */
  right: 30px;
  top: 30px;
}

/* Show the copybar when clicking on a button (class added with JavaScript) */
#copybar.show {
  visibility: visible; /* Show the copybar */
  /* Add animation: Take 0.5 seconds to fade in and out the copybar.
  However, delay the fade out process for 2.5 seconds */
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
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
function showToast() {
  // Get the copybar DIV
  var el = document.getElementById("copybar");

  // Add the "show" class to DIV
  el.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ el.className = el.className.replace("show", ""); }, 3000);
}
document.querySelector('body')?.appendChild(node);

export { }
