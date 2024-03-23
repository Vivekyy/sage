import { BlockSite, Session } from './types';

let blocks: BlockSite[] = [];
let sessions: Session[] = [];

const allErrors = ['#general-error', '#domain-error', '#path-error', '#start-time-error', '#end-time-error'];

function addBlockedSite() {
  clearErrors(['#domain-error', '#path-error']);

  let domain = (document.querySelector('#domain-input') as HTMLInputElement).value;
  let path = (document.querySelector('#path-input') as HTMLInputElement).value;

  if (!domain) {
    outputError('#domain-error', 'Domain is required');
    return;
  }

  domain = domain.trim();
  domain = domain.replace(/https?:|\//g, '');
  domain = domain.replace(/^www\./, '');
  domain = domain.toLowerCase();

  if (!/.+\..+/.test(domain)) {
    outputError('#domain-error', 'Invalid domain');
    return;
  }

  path = path.trim().toLowerCase();
  if (path && !/^\/.+/.test(path)) {
    outputError('#path-error', 'Invalid path');
    return;
  }

  const newBlock: BlockSite = {
    domain: domain,
    path: path ? path : '',
  };

  if (
    blocks.some(function (block) {
      return block.domain == newBlock.domain && block.path == newBlock.path;
    })
  ) {
    outputError('#domain-error', 'This block already exists');
    return;
  }

  blocks.unshift(newBlock);
  chrome.storage.sync.set({ blocks: blocks }, function () {
    const error = chrome.runtime.lastError;
    if (error) {
      console.error('Failed to add blocked site:', error);
      outputError('#domain-error', 'An unexpected error occured, please try again');
      blocks.shift();
    } else {
      addBlockUI(newBlock);
    }
  });
}

function addBlockUI(block: BlockSite) {
  console.log('Adding block row');
  const tbody = document.querySelector('#block-table') as HTMLTableElement;
  const row = tbody.insertRow(0);
  const c1 = row.insertCell();
  const c2 = row.insertCell();
  const c3 = row.insertCell();

  const favicon = document.createElement('img');
  favicon.setAttribute('src', 'http://www.google.com/s2/favicons?domain=' + block.domain);
  c1.appendChild(favicon);

  const span = document.createElement('span');
  span.textContent = '     ' + block.domain;
  c1.appendChild(span);

  c2.textContent = block.path;

  const deleteButton = document.createElement('button');
  deleteButton.addEventListener('click', deleteBlockedSite);
  deleteButton.style.background = 'none';
  deleteButton.style.border = 'none';

  const deleteImg = document.createElement('img');
  deleteImg.setAttribute('src', 'static/red-trash-can-icon.png');
  deleteButton.appendChild(deleteImg);

  c3.appendChild(deleteButton);
}

function deleteBlockedSite(this: HTMLButtonElement) {
  let row = this.parentNode;
  while (row!.nodeName != 'TR') {
    row = row!.parentNode;
  }

  const idx = (row as HTMLTableRowElement).rowIndex - 1; //array init to 0 offset

  const toDel = blocks[idx];
  blocks.splice(idx, 1);
  chrome.storage.sync.set({ blocks: blocks }, function () {
    const error = chrome.runtime.lastError;
    if (error) {
      console.error('Failed to remove blocked site:', error);
      outputError('#domain-error', 'Failed to delete block, please try again');
      blocks.splice(idx, 0, toDel);
    } else {
      (row as HTMLTableRowElement).remove();
    }
  });
}

document.querySelector('#block-add-button')!.addEventListener('click', addBlockedSite);

function addSession() {
  clearErrors(['#start-time-error', '#end-time-error']);

  const start = (document.querySelector('#start-time-input') as HTMLInputElement).valueAsDate;
  const end = (document.querySelector('#end-time-input') as HTMLInputElement).valueAsDate;

  if (!start) {
    outputError('#start-time-error', 'Must input a start time');
    return;
  }
  if (!end) {
    outputError('#end-time-error', 'Must input an end time');
    return;
  }

  // Fix timezone of input to local time
  start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
  end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

  const newSesh: Session = {
    start: start!.getTime().toString(),
    end: end!.getTime().toString(),
  };

  if (
    sessions.some(function (session) {
      return session.start == newSesh.start && session.end == newSesh.end;
    })
  ) {
    outputError('#start-time-error', 'This study session already exists');
    return;
  }

  sessions.unshift(newSesh);
  chrome.storage.sync.set({ sessions: sessions }, function () {
    const error = chrome.runtime.lastError;
    if (error) {
      console.error('Failed to add session:', error);
      outputError('#start-time-error', 'An unexpected error occured, please try again');
      sessions.shift();
    } else {
      addSessionUI(newSesh);
    }
  });
}

function addSessionUI(session: Session) {
  console.log('Adding session row');
  const tbody = document.querySelector('#session-table') as HTMLTableElement;
  const row = tbody.insertRow(0);
  const c1 = row.insertCell();
  const c2 = row.insertCell();
  const c3 = row.insertCell();

  c1.textContent = toAMPM(session.start);
  c2.textContent = toAMPM(session.end);

  const deleteButton = document.createElement('button');
  deleteButton.addEventListener('click', deleteSession);
  deleteButton.style.background = 'none';
  deleteButton.style.border = 'none';

  const deleteImg = document.createElement('img');
  deleteImg.setAttribute('src', 'static/red-trash-can-icon.png');
  deleteButton.appendChild(deleteImg);

  c3.appendChild(deleteButton);
}

function toAMPM(time: string) {
  const date = new Date(parseInt(time));
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minStr = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
  const strTime = hours.toString() + ':' + minStr + ' ' + ampm;
  return strTime;
}

function deleteSession(this: HTMLButtonElement) {
  let row = this.parentNode;
  while (row!.nodeName != 'TR') {
    row = row!.parentNode;
  }

  const idx = (row as HTMLTableRowElement).rowIndex - 1; //array init to 0 offset

  const toDel = sessions[idx];
  sessions.splice(idx, 1);
  chrome.storage.sync.set({ sessions: sessions }, function () {
    const error = chrome.runtime.lastError;
    if (error) {
      console.error('Failed to remove session:', error);
      outputError('#domain-error', 'Failed to delete session, please try again');
      sessions.splice(idx, 0, toDel);
    } else {
      (row as HTMLTableRowElement).remove();
    }
  });
}

document.querySelector('#session-add-button')!.addEventListener('click', addSession);

function outputError(type: string, text: string) {
  const errorMessage = document.querySelector(type) as HTMLParagraphElement;
  errorMessage.style.display = 'block';
  errorMessage.textContent = text;
}

function clearErrors(types: string[]) {
  const errorMessages = [];
  for (const type of types) {
    errorMessages.push(document.querySelector(type) as HTMLParagraphElement);
  }

  for (const message of errorMessages) {
    message.style.display = 'none';
  }
}

function onLoad() {
  clearErrors(allErrors);

  chrome.storage.sync.get({ blocks: [], sessions: [] }, function (value) {
    const error = chrome.runtime.lastError;
    if (error) {
      console.error('Failed to get data from storage:', error);
      outputError('#general-error', 'Failed to get data from storage, please refresh the page');
    } else {
      blocks = value.blocks;
      sessions = value.sessions;

      for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        addBlockUI(block);
      }

      for (let i = sessions.length - 1; i >= 0; i--) {
        const session = sessions[i];
        addSessionUI(session);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', onLoad);
