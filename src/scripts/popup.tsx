import { countdown } from './utils';
import { createRoot } from 'react-dom/client';

function onLoad() {
  const container = document.getElementById('app')!;
  const root = createRoot(container);
  countdown(onLoad).then(function (countdownResponse) {
    if (countdownResponse != 'false' && countdownResponse != 'fail') {
      const element = defaultPopupContent('Study Time Remaining:', countdownResponse as string);
      root.render(element);
    } else {
      const element = defaultPopupContent('No active study session', '');
      root.render(element);
    }
  });
}

document.addEventListener('DOMContentLoaded', onLoad);

function fetchOptions() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
}

function defaultPopupContent(prefix: string, current_session: string) {
  return (
    <div className="m-auto">
      <div className="flex items-center justify-center">
        <p className="font-medium text-lg m-2">{prefix}</p>
      </div>
      <div className="flex items-center justify-center">
        <p className="font-semibold text-2xl m-2">{current_session}</p>
      </div>
      <div className="flex align-bottom justify-center h-fit">
        <button className="underline hover:text-gray-700 text-sm" onClick={() => fetchOptions()}>
          Manage your settings
        </button>
      </div>
    </div>
  );
}
