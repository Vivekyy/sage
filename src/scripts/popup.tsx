import { countdown } from './utils';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('popupApp')!);

function onLoad() {
  countdown(onLoad).then(function (countdownResponse) {
    let element;
    if (countdownResponse != 'false' && countdownResponse != 'fail') {
      element = PopupContent('Study Time Remaining:', countdownResponse as string);
    } else {
      element = PopupContent('No active study session', '');
    }
    root.render(element);
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

function PopupContent(prefix: string, current_session: string) {
  return (
    <div className="m-auto">
      <TextComponent content={prefix} text_size="text-xl" />
      <TextComponent content={current_session} text_size="text-2xl" />
      <div className="flex align-bottom justify-center h-fit">
        <button className="underline hover:text-gray-700 text-sm" onClick={() => fetchOptions()}>
          Manage your settings
        </button>
      </div>
    </div>
  );
}

interface Props {
  content: string;
  text_size: string;
}

function TextComponent(props: Props) {
  return (
    <div className="flex items-center justify-center">
      <div className="font-semibold m-2">
        <p className={props.text_size}>{props.content}</p>
      </div>
    </div>
  );
}
