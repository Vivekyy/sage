import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faX } from '@fortawesome/free-solid-svg-icons';

import { createRoot } from 'react-dom/client';
import React, { ReactNode, useState } from 'react';

import styled from 'styled-components';

import { BlockSite, Session } from './types';
import { checkIndividualSession } from './utils';

const root = createRoot(document.getElementById('optionsApp')!);

function onLoad() {
  root.render(<OptionsContent />);
}

document.addEventListener('DOMContentLoaded', onLoad);

function OptionsContent() {
  return (
    <div>
      <nav className="bg-white w-full z-20 top-0 start-0 border-b border-gray-300">
        <img src="static/sage-logo-dark-horizontal.png" className="h-12 m-2 inline" />
        <span className="text-xl text-center align-bottom font-semibold">Web-Extension Options</span>
      </nav>

      <p id="general-error" className="text-red-600"></p>
      <SessionCalenderComp />
      <BlockTableComp />
    </div>
  );
}

// -- CALENDAR --

function SessionCalenderComp() {
  const [sessions, setSessions] = useState(Array(0));
  const [week, setWeek] = useState(0);
  const [popupBool, setPopupBool] = useState(false);

  chrome.storage.sync.get({ sessions: [] }, function (value) {
    const error = chrome.runtime.lastError;
    if (error) {
      console.error('Failed to get data from storage:', error);
      outputError('#general-error', 'Failed to get data from storage, please refresh the page');
    } else {
      setSessions(value.sessions);
    }
  });

  const seshComp = <div></div>;

  return (
    <div>
      <div className="w-screen flex text-2xl justify-center mt-8">
        <span className="m-2">Study Schedule</span>
      </div>

      <div className="w-screen flex justify-center">
        <div className="rounded-md overflow-hidden w-4/5">
          <div className="text-sm text-left font-sans font-normal">
            <CalenderHeaderComp week={week} />

            <div className="overflow-auto h-96">
              <div className="bg-gray-200">
                <div className="grid grid-cols-8 grid-rows-auto auto-cols-min">
                  <HourLineComp week={week} />
                  <CalendarSidebarComp />
                  {seshComp}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CalendarNavComp week={week} popupBool={popupBool} setWeek={setWeek} setPopupBool={setPopupBool} />

      <AddPopupComp popupBool={popupBool} setPopupBool={setPopupBool} sessions={sessions} setSessions={setSessions} />
    </div>
  );
}

interface CalendarHeaderProps {
  week: number;
}
function CalenderHeaderComp(props: CalendarHeaderProps) {
  const dow = getDow(props.week);

  return (
    <div className="text-gray-800 bg-gray-500">
      <div className="grid grid-cols-8 auto-cols-min font-bold">
        <div className="px-6 py-2"></div>
        <div className="px-6 py-2">
          Monday {dow[0].getMonth() + 1}/{dow[0].getDate()}
        </div>
        <div className="px-6 py-2">
          Tuesday {dow[1].getMonth() + 1}/{dow[1].getDate()}
        </div>
        <div className="px-6 py-2">
          Wednesday {dow[2].getMonth() + 1}/{dow[2].getDate()}
        </div>
        <div className="px-6 py-2">
          Thursday {dow[3].getMonth() + 1}/{dow[3].getDate()}
        </div>
        <div className="px-6 py-2">
          Friday {dow[4].getMonth() + 1}/{dow[4].getDate()}
        </div>
        <div className="px-6 py-2">
          Saturday {dow[5].getMonth() + 1}/{dow[5].getDate()}
        </div>
        <div className="px-6 py-2">
          Sunday {dow[6].getMonth() + 1}/{dow[6].getDate()}
        </div>
      </div>
    </div>
  );
}

function CalendarSidebarComp() {
  const hourBlocksComp: JSX.Element[] = [];

  for (let i = 0; i < 24; i++) {
    let post = '';
    if (i < 12) {
      post = ':00 AM';
    } else {
      post = ':00 PM';
    }

    let hr = i % 12;
    if (!hr) {
      hr = 12;
    }
    const hrStr = hr.toString();

    hourBlocksComp.push(HourBlockComp(hrStr + post, i));
  }

  return <div className="col-start-1 col-end-2 gap-8 bg-gray-400 text-gray-600">{hourBlocksComp}</div>;
}

interface CalendarNavProps {
  week: number;
  popupBool: boolean;
  setWeek: React.Dispatch<React.SetStateAction<number>>;
  setPopupBool: React.Dispatch<React.SetStateAction<boolean>>;
}
function CalendarNavComp(props: CalendarNavProps) {
  return (
    <div>
      <div className="w-screen flex justify-center">
        <div className="w-4/5 flex justify-between">
          <div className="flex ml-auto">
            <button onClick={() => props.setPopupBool(true)} className="m-1">
              <div>
                <div className="flex bg-blue-300 hover:bg-blue-500 py-1 px-3 rounded-full">
                  <span className="text-gray-800 font-sans font-semibold text-sm">Add Session</span>
                </div>
              </div>
            </button>
            <div className="mr-2 mt-1">
              <button onClick={() => props.setWeek(props.week - 1)} className="mr-0.5">
                <div>
                  <div className="flex bg-gray-200 hover:bg-gray-400 py-1 px-3 rounded-full">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </div>
                </div>
              </button>
              <button onClick={() => props.setWeek(props.week + 1)}>
                <div className="flex bg-gray-200 hover:bg-gray-400 py-1 px-3 rounded-full">
                  <FontAwesomeIcon icon={faChevronRight} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center align-center"></div>
    </div>
  );
}

interface AddPopupProps {
  sessions: Session[];
  popupBool: boolean;
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  setPopupBool: React.Dispatch<React.SetStateAction<boolean>>;
}
function AddPopupComp(props: AddPopupProps) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [repeat, setRepeat] = useState('');

  return (
    <PopupComp title="Add a Study Session" popupBool={props.popupBool} setPopupBool={props.setPopupBool}>
      <span className="whitespace-nowrap py-2">
        <span>Session Start: </span>
        <input
          onChange={(e) => setStart(e.target.value)}
          type="datetime-local"
          className="bg-gray-300 p-2 border-b-2 border-gray-500 rounded-sm outline-none focus:bg-gray-200 mr-6"
        />
      </span>
      <span className="whitespace-nowrap py-2">
        <span>Session End: </span>
        <input
          onChange={(e) => setEnd(e.target.value)}
          type="datetime-local"
          className="bg-gray-300 p-2 border-b-2 border-gray-500 rounded-sm outline-none focus:bg-gray-200"
        />
      </span>
      <div className="py-2">
        <span>
          Repeat Every{' '}
          <input
            onChange={(e) => setRepeat(e.target.value)}
            type="number"
            min="1"
            className="bg-gray-300 p-2 border-b-2 w-10 border-gray-500 rounded-sm outline-none focus:bg-gray-200"
          />{' '}
          Days
        </span>
      </div>
      <div className="pt-3">
        <button onClick={() => addSession(start, end, repeat, props.sessions, props.setSessions, props.setPopupBool)}>
          <div className="flex bg-blue-300 hover:bg-blue-500 py-1 px-3 rounded-full">
            <span className="text-gray-800 font-sans font-semibold">Add to Schedule</span>
          </div>
        </button>
      </div>
      <p id="session-error" className="text-red-600"></p>
    </PopupComp>
  );
}

function addSession(
  startStr: string,
  endStr: string,
  repeatStr: string,
  sessions: Session[],
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>,
  setPopupBool: React.Dispatch<React.SetStateAction<boolean>>,
) {
  console.log('Adding Session');

  clearErrors(['#session-error']);

  if (!startStr) {
    outputError('#session-error', 'Must input a start time');
    return;
  }
  if (!endStr) {
    outputError('#session-error', 'Must input an end time');
    return;
  }

  const start = new Date(startStr);
  const end = new Date(endStr);
  // const repeat = repeatStr ? Number(repeatStr) : 0;

  if (start >= end) {
    outputError('#session-error', 'Start time must be earlier than end time');
    return;
  }

  const newSesh: Session = {
    start: start!.getTime().toString(),
    end: end!.getTime().toString(),
    repeat: repeatStr,
    exceptions: [],
  };

  // Enforce no overlapping sessions
  if (
    sessions.some(function (session) {
      return (
        checkIndividualSession(new Date(parseInt(newSesh.start)), session) ||
        checkIndividualSession(new Date(parseInt(newSesh.end)), session) ||
        checkIndividualSession(new Date(parseInt(session.start)), newSesh)
      );
    })
  ) {
    outputError('#session-error', 'This study session overlaps with an existing session');
    return;
  }

  const nextSessions = sessions.slice();
  nextSessions.unshift(newSesh);
  chrome.storage.sync.set({ sessions: nextSessions }, function () {
    const error = chrome.runtime.lastError;
    if (error) {
      console.error('Failed to add blocked site:', error);
      outputError('#domain-error', 'An unexpected error occured, please try again');
    } else {
      setSessions(nextSessions);
      setPopupBool(false);
    }
  });
}

// -- CURRENT TIME LINE --

// Workaround with styled components due to tailwind bugs

const HOUR_HEIGHT = 40;

const HourHeightDiv = styled.div`
  height: ${HOUR_HEIGHT}px;
`;

function HourBlockComp(time: string, id: number) {
  return (
    <div key={id}>
      <HourHeightDiv>
        <div className="flex justify-end mr-4">{time}</div>
      </HourHeightDiv>
    </div>
  );
}

interface HourLinePosProps {
  offset: string;
}
const HourLinePosDiv = styled.div<HourLinePosProps>`
  position: relative;
  top: ${(p) => p.offset}px;
`;

interface HourLineProps {
  week: number;
}
function HourLineComp(props: HourLineProps) {
  if (props.week != 0) {
    return (
      <div className="col-start-1 col-end-9">
        <div className="border-gray-200 border"></div>
      </div>
    );
  }

  const dt = new Date();
  const hr = dt.getHours();
  const min = dt.getMinutes();
  const hourLineOffset = (hr + min / 60) * HOUR_HEIGHT + 12; //12 px offset for half of the text line height (default 24)

  return (
    <div className="col-start-1 col-end-9">
      <HourLinePosDiv offset={hourLineOffset.toString()}>
        <div className={'border-red-500 border'}></div>
      </HourLinePosDiv>
    </div>
  );
}

// -- BLOCK TABLE --

function BlockTableComp() {
  const [blocks, setBlocks] = useState(Array(0));
  const [domain, setDomain] = useState('');
  const [path, setPath] = useState('');

  chrome.storage.sync.get({ blocks: [] }, function (value) {
    const error = chrome.runtime.lastError;
    if (error) {
      console.error('Failed to get data from storage:', error);
      outputError('#general-error', 'Failed to get data from storage, please refresh the page');
    } else {
      setBlocks(value.blocks);
    }
  });

  const blocksComp = blocks.map((value) => <BlockComponent curBlock={value} blocks={blocks} setBlocks={setBlocks} />);

  return (
    <div>
      <div className="w-screen flex text-2xl justify-center mt-8">
        <span className="m-2">Blocked Sites</span>
      </div>

      <div className="w-screen flex justify-center">
        <div className="rounded-md overflow-hidden">
          <table className="text-sm text-left w-96 font-sans font-normal">
            <thead className="text-gray-800 bg-gray-500">
              <tr>
                <th className="px-6 py-2">Domain</th>
                <th className="px-6 py-2">Path (Optional)</th>
                <th className="px-6 py-2"></th>
              </tr>
            </thead>
            <tbody id="block-table" className="bg-gray-200">
              {blocksComp}
              <tr>
                <td className="px-6 py-4">
                  <input
                    onChange={(e) => setDomain(e.target.value)}
                    type="text"
                    className="bg-gray-100 p-2 border-b-2 border-gray-500 rounded-sm"
                    placeholder="e.g. youtube.com"
                  />
                  <p id="domain-error" className="text-red-600"></p>
                </td>
                <td className="px-6 py-4">
                  <input
                    onChange={(e) => setPath(e.target.value)}
                    type="text"
                    className="bg-gray-100 p-2 border-b-2 border-gray-500 rounded-sm"
                    placeholder="e.g. /playlist"
                  />
                  <p id="path-error" className="text-red-600"></p>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => addBlockedSite(domain, path, blocks, setBlocks)}>
                    <div className="flex bg-green-400 hover:bg-green-500 text-white font-semibold py-1 px-3 rounded-full">
                      <span>Add</span>
                      {/* <div className="align-middle"><i className="fa-solid fa-plus"></i></div> */}
                    </div>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface BlockComponentProps {
  curBlock: BlockSite;
  blocks: BlockSite[];
  setBlocks: React.Dispatch<React.SetStateAction<BlockSite[]>>;
}
function BlockComponent(props: BlockComponentProps) {
  return (
    <tr className="border-b border-gray-500" key={props.curBlock.domain + '/' + props.curBlock.path}>
      <td>
        <div className="flex px-6 py-4">
          <img className="mr-2" src={'http://www.google.com/s2/favicons?domain=' + props.curBlock.domain} />
          <span className="underline hover:text-gray-700">{props.curBlock.domain}</span>
        </div>
      </td>
      <td className="px-6 py-4">{props.curBlock.path}</td>
      <td>
        <button
          className="bg-inherit border-none"
          onClick={() => deleteBlockedSite(props.curBlock, props.blocks, props.setBlocks)}
        >
          <div className="flex bg-red-400 hover:bg-red-500 text-white font-semibold py-1 px-3 rounded-full">
            <span>Remove</span>
          </div>
        </button>
      </td>
    </tr>
  );
}

function addBlockedSite(
  domain: string,
  path: string,
  blocks: BlockSite[],
  setBlocks: React.Dispatch<React.SetStateAction<BlockSite[]>>,
) {
  console.log('Adding Blocked Site');

  clearErrors(['#domain-error', '#path-error']);

  if (!domain) {
    outputError('#domain-error', 'Domain is required');
    return;
  }

  domain = domain.trim();
  domain = domain.replace(/https?:|\//g, '');
  domain = domain.replace(/^www\./, '');
  domain = domain.toLowerCase();

  // Want: [anything].[anything] format
  if (!/.+\..+/.test(domain)) {
    outputError('#domain-error', 'Invalid domain');
    return;
  }

  path = path.trim();
  if (path != '' && path[0] != '/') {
    path = '/' + path;
  }
  // Want: /[anything] format (technically possible to still fail with newlines)
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

  const nextBlocks = blocks.slice();
  nextBlocks.unshift(newBlock);

  chrome.storage.sync.set({ blocks: nextBlocks }, function () {
    const error = chrome.runtime.lastError;
    if (error) {
      console.error('Failed to add blocked site:', error);
      outputError('#domain-error', 'An unexpected error occured, please try again');
    } else {
      setBlocks(nextBlocks);
    }
  });
}

function deleteBlockedSite(
  curBlock: BlockSite,
  blocks: BlockSite[],
  setBlocks: React.Dispatch<React.SetStateAction<BlockSite[]>>,
) {
  const nextBlocks = blocks.filter(function (block) {
    return block.domain != curBlock.domain || block.path != curBlock.path;
  });

  chrome.storage.sync.set({ blocks: nextBlocks }, function () {
    const error = chrome.runtime.lastError;
    if (error) {
      console.error('Failed to remove blocked site:', error);
      outputError('#domain-error', 'Failed to delete block, please try again');
    } else {
      setBlocks(nextBlocks);
    }
  });
}

// -- ERROR DISPLAY --

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

// -- GENERAL POPUPS --

interface PopupProps {
  title: string;
  popupBool: boolean;
  setPopupBool: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode;
}
function PopupComp(props: PopupProps) {
  return props.popupBool ? (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50 font-sans font-normal">
      <div className="relative p-8 pb-4 w-2/5 rounded-md bg-gray-300 overflow-auto">
        <div className="absolute top-0 left-0 w-full rounded-t-md bg-gray-400">
          <span className="flex text-lg text-gray-800 font-semibold ml-4 my-2">{props.title}</span>
          <div className={'border-gray-500 border'}></div>
        </div>
        <div className="absolute top-0 right-0">
          <div className="m-2">
            <div className="bg-gray-500 hover:bg-gray-600 rounded-full">
              <div className="m-1">
                <button onClick={() => props.setPopupBool(false)} className="text-gray-800">
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">{props.children}</div>
      </div>
    </div>
  ) : (
    ''
  );
}

// -- UTILS --

function getDow(week: number) {
  const dt = new Date();
  const sunday = new Date();
  sunday.setDate(dt.getDate() - dt.getDay() + 7 * week);

  const dow = [];
  for (let i = 1; i < 8; i++) {
    const day = new Date(sunday.getTime());
    day.setDate(day.getDate() + i);
    dow.push(day);
  }

  return dow;
}
