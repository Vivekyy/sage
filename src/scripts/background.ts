import { Session } from './types.js';

const sessions: Set<Session> = new Set<Session>();
const blocks = [];
let inSession: boolean = true;

function swapPopup(logged_in: boolean) {
  if (logged_in) {
    browser.browserAction.setPopup({ popup: 'popup.html' });
  } else {
    browser.browserAction.setPopup({ popup: 'login_popup.html' });
  }
}

function checkSession(): boolean {
  const datetime = new Date();
  for (const sesh of sessions) {
    if (datetime >= sesh.start && datetime <= sesh.end) {
      return true;
    }
  }
  return false;
}

function addSession(start: Date, end: Date) {
  const sesh: Session = { start: start, end: end };
  sessions.add(sesh);
  inSession = checkSession();
}

function removeSession(start: Date, end: Date) {
  const sesh: Session = { start: start, end: end };
  sessions.delete(sesh);
  inSession = checkSession();
}

function block();

browser.webNavigation.onCommitted.addListener(block);
