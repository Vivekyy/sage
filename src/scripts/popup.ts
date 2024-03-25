import { countdown } from './utils';

function onLoad() {
  const sessionField = document.querySelector('#current-session') as HTMLParagraphElement;
  const prefixField = document.querySelector('#current-session-prefix') as HTMLParagraphElement;
  countdown(onLoad, sessionField).then(function (countdownResponse) {
    if (countdownResponse == 'true') {
      prefixField.textContent = 'Study Time Remaining:';
    } else {
      prefixField.textContent = 'No active study session';
      sessionField.textContent = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', onLoad);

document.querySelector('#options-link')!.addEventListener('click', function () {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});
