import { Session } from './types';

let sessions: Session[] = [];

function onLoad() {
  const now = new Date();
  console.log('hi');

  chrome.storage.sync.get({ sessions: [] }, function (value) {
    sessions = value.sessions;

    let inSesh = false;
    for (const sesh of sessions) {
      const start = new Date(parseInt(sesh.start));
      start.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
      const end = new Date(parseInt(sesh.end));
      end.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());

      if (start <= now && end >= now) {
        inSesh = true;
        countdown(end);
      }
    }

    if (!inSesh) {
      const sessionField = document.querySelector('#current-session') as HTMLParagraphElement;
      sessionField.textContent = 'No currently active session';
    }
  });
}

function countdown(end: Date) {
  const sessionField = document.querySelector('#current-session') as HTMLParagraphElement;

  const now = new Date();

  const diff = (end.getTime() - now.getTime()) / 1000; //Seconds remaining
  if (diff > 0) {
    setTimeout(onLoad, 100);

    const mins = Math.ceil(diff / 60);
    const secs = Math.ceil(diff % 60);

    const secStr = secs < 10 ? '0' + secs.toString() : secs.toString();
    sessionField.textContent = 'Time Remaining: ' + mins.toString() + ':' + secStr;
  } else {
    sessionField.textContent = 'No currently active session';
  }
}

document.addEventListener('DOMContentLoaded', onLoad);

document.querySelector('#options-link')!.addEventListener('click', function () {
  if (chrome.runtime.openOptionsPage) {
    // New way to open options pages, if supported (Chrome 42+).
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});
