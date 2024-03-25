import { Session } from './types';

let sessions: Session[] = [];

export function countdown(listener: CallableFunction, sessionField: HTMLParagraphElement) {
  const now = new Date();

  return new Promise((resolve) =>
    chrome.storage.sync.get({ sessions: [] }, function (value) {
      sessions = value.sessions;

      for (const sesh of sessions) {
        const start = new Date(parseInt(sesh.start));
        start.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
        const end = new Date(parseInt(sesh.end));
        end.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());

        const diff = (end.getTime() - now.getTime()) / 1000; //Seconds remaining

        if (start <= now && end >= now && diff > 0) {
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
