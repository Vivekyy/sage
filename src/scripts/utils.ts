import { Session } from './types';

let sessions: Session[] = [];

export function checkSession() {
  return new Promise((resolve) =>
    chrome.storage.sync.get(
      {
        sessions: [],
      },
      function (value) {
        const error = chrome.runtime.lastError;
        if (error) {
          console.error('Failed to get data from storage:', error);
          resolve('fail');
        }

        for (const sesh of value.sessions) {
          const { inSesh: inSesh } = checkIndividualSession(sesh);
          if (inSesh) {
            resolve('true');
          }
        }
        resolve('false');
      },
    ),
  );
}

export function countdown(listener: CallableFunction, sessionField: HTMLParagraphElement) {
  const now = new Date();

  return new Promise((resolve) =>
    chrome.storage.sync.get({ sessions: [] }, function (value) {
      const error = chrome.runtime.lastError;
      if (error) {
        console.error('Failed to get data from storage:', error);
        resolve('fail');
      }

      sessions = value.sessions;

      for (const sesh of sessions) {
        const { inSesh: inSesh, end: end } = checkIndividualSession(sesh);
        const diff = (end.getTime() - now.getTime()) / 1000; //Seconds remaining

        if (inSesh && diff > 0) {
          setTimeout(listener, 100);

          let mins = Math.floor(diff / 60);
          const secs = Math.floor(diff % 60);

          const hours = Math.floor(mins / 60);
          mins = mins % 60;

          const secStr = secs < 10 ? '0' + secs.toString() : secs.toString();
          const minStr = hours && mins < 10 ? '0' + mins.toString() : mins.toString();

          sessionField.textContent = hours ? hours.toString() + ':' + minStr + ':' + secStr : minStr + ':' + secStr;
          resolve('true');
        }
      }
      resolve('false');
    }),
  );
}

// Will need to be updated for calendar and pomodoro changes
function checkIndividualSession(sesh: Session): { inSesh: boolean; end: Date } {
  const now = new Date();

  const start = new Date(parseInt(sesh.start));
  const end = new Date(parseInt(sesh.end));

  // Temporary
  start.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
  end.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());

  return { inSesh: now >= start && now <= end, end: end };
}
