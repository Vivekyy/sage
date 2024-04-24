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
          const inSesh = checkIndividualSession(new Date(), sesh);
          if (inSesh) {
            resolve('true');
          }
        }
        resolve('false');
      },
    ),
  );
}

export function countdown(listener: CallableFunction) {
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
        const inSesh = checkIndividualSession(new Date(), sesh);
        const end = new Date(parseInt(sesh.end));
        const diff = (end.getTime() - now.getTime()) / 1000; //Seconds remaining

        if (inSesh && diff > 0) {
          setTimeout(listener, 100);

          let mins = Math.floor(diff / 60);
          const secs = Math.floor(diff % 60);

          const hours = Math.floor(mins / 60);
          mins = mins % 60;

          const secStr = secs < 10 ? '0' + secs.toString() : secs.toString();
          const minStr = hours && mins < 10 ? '0' + mins.toString() : mins.toString();

          const sessionField = hours ? hours.toString() + ':' + minStr + ':' + secStr : minStr + ':' + secStr;
          resolve(sessionField);
        }
      }
      resolve('false');
    }),
  );
}

// TODO: Update for repeat and pomodoro
export function checkIndividualSession(check: Date, sesh: Session) {
  const start = new Date(parseInt(sesh.start));
  const end = new Date(parseInt(sesh.end));

  return check >= start && check <= end;
}

export function toAMPM(date: Date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minStr = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
  const strTime = hours.toString() + ':' + minStr + ' ' + ampm;
  return strTime;
}
