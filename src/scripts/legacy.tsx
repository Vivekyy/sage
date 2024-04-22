// -- Old Session Table Code --

{
  /* <div className="w-screen flex justify-center">
        <div className="rounded-md overflow-hidden">
          <table className="text-sm text-left w-80">
            <thead className="text-gray-800 bg-gray-500">
              <tr>
                <th className="px-6 py-2">Start</th>
                <th className="px-6 py-2">End</th>
                <th className="px-6 py-2"></th>
              </tr>
            </thead>
            <tbody id="session-table" className="bg-gray-200">
              <tr>
                <td className="px-6 py-4 font-sans font-normal">
                  <input id="start-time-input" type="time" className="bg-gray-200" />
                  <p id="start-time-error" className="text-red-600"></p>
                </td>
                <td className="px-6 py-4 font-sans font-normal">
                  <input id="end-time-input" type="time" className="bg-gray-200" />
                  <p id="end-time-error" className="text-red-600"></p>
                </td>
                <td className="px-6 py-4">
                  <a id="session-add-button">
                    <div className="flex bg-green-400 hover:bg-green-500 text-white font-semibold py-1 px-3 rounded-full">
                      <span>Add</span>
                    </div>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */
}

// function addSession() {
//   clearErrors(['#start-time-error', '#end-time-error']);

//   const start = (document.querySelector('#start-time-input') as HTMLInputElement).valueAsDate;
//   const end = (document.querySelector('#end-time-input') as HTMLInputElement).valueAsDate;

//   if (!start) {
//     outputError('#start-time-error', 'Must input a start time');
//     return;
//   }
//   if (!end) {
//     outputError('#end-time-error', 'Must input an end time');
//     return;
//   }

//   if (start >= end) {
//     outputError('#start-time-error', 'Start time must be earlier than end time');
//   }

//   // Fix timezone of input to local time
//   start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
//   end.setMinutes(end.getMinutes() + end.getTimezoneOffset());

//   const newSesh: Session = {
//     start: start!.getTime().toString(),
//     end: end!.getTime().toString(),
//   };

//   if (
//     sessions.some(function (session) {
//       return session.start == newSesh.start && session.end == newSesh.end;
//     })
//   ) {
//     outputError('#start-time-error', 'This study session already exists');
//     return;
//   }

//   sessions.unshift(newSesh);
//   chrome.storage.sync.set({ sessions: sessions }, function () {
//     const error = chrome.runtime.lastError;
//     if (error) {
//       console.error('Failed to add session:', error);
//       outputError('#start-time-error', 'An unexpected error occured, please try again');
//       sessions.shift();
//     } else {
//       addSessionUI(newSesh);
//     }
//   });
// }

// function addSessionUI(session: Session) {
//   console.log('Adding session row');
//   const tbody = document.querySelector('#session-table') as HTMLTableElement;
//   const row = tbody.insertRow(0);
//   row.className = 'border-b border-gray-500';

//   const c1 = row.insertCell();
//   const c2 = row.insertCell();
//   const c3 = row.insertCell();

//   c1.textContent = toAMPM(session.start);
//   c1.className = 'px-6 py-4';

//   c2.textContent = toAMPM(session.end);
//   c2.className = 'px-6 py-4';

//   const deleteButton = document.createElement('button');
//   deleteButton.addEventListener('click', deleteSession);
//   deleteButton.style.background = 'none';
//   deleteButton.style.border = 'none';

//   const deleteDiv = document.createElement('div');
//   deleteDiv.className = 'flex bg-red-400 hover:bg-red-500 text-white font-semibold py-1 px-3 rounded-full';
//   const deleteSpan = document.createElement('span');
//   deleteSpan.textContent = 'Remove';

//   deleteDiv.appendChild(deleteSpan);
//   deleteButton.appendChild(deleteDiv);

//   c3.appendChild(deleteButton);
// }

// function deleteSession(this: HTMLButtonElement) {
//   let row = this.parentNode;
//   while (row!.nodeName != 'TR') {
//     row = row!.parentNode;
//   }

//   const idx = (row as HTMLTableRowElement).rowIndex - 1; //array init to 0 offset

//   const toDel = sessions[idx];
//   sessions.splice(idx, 1);
//   chrome.storage.sync.set({ sessions: sessions }, function () {
//     const error = chrome.runtime.lastError;
//     if (error) {
//       console.error('Failed to remove session:', error);
//       outputError('#domain-error', 'Failed to delete session, please try again');
//       sessions.splice(idx, 0, toDel);
//     } else {
//       (row as HTMLTableRowElement).remove();
//     }
//   });
// }

// document.querySelector('#session-add-button')!.addEventListener('click', addSession);

// const allErrors = ['#general-error', '#domain-error', '#path-error', '#start-time-error', '#end-time-error'];

// -- Block Table Interfacing --

// interface BlockInputElements extends HTMLFormControlsCollection {
//   domainInput: HTMLInputElement;
//   pathInput: HTMLInputElement;
// }

// interface BlockFormElement extends HTMLFormElement {
//   readonly elements: BlockInputElements;
// }
