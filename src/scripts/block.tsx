import { countdown } from './utils';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('blockApp')!);

function onLoad() {
  countdown(onLoad).then(function (countdownResponse) {
    let element;
    if (countdownResponse != 'fail' && countdownResponse != 'false') {
      element = BlockContent('Time Remaining in Current Study Session:', countdownResponse as string);
    } else {
      element = BlockContent('No active study session, feel free to resume browsing!', '');
    }
    root.render(element);
  });
}

document.addEventListener('DOMContentLoaded', onLoad);

function BlockContent(prefix: string, session: string) {
  let link;
  if (session != '') {
    link = <LinkComponent />;
  }

  return (
    <div className="flex bg-gradient-to-r from-green-700 via-yellow-200 to-green-700 h-screen">
      <div className="m-auto">
        <div className="flex items-center justify-center">
          <img src="static/sage-logo-dark.png" className="m-10" />
        </div>
        <TextComponent text_size="text-2xl" content={prefix} />
        <TextComponent text_size="text-3xl" content={session} />
        {link}
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
      <div className="m-4 font-semibold">
        <p id="current-session-prefix" className={props.text_size}>
          {props.content}
        </p>
      </div>
    </div>
  );
}

function LinkComponent() {
  return (
    <div className="flex items-center justify-center">
      <a
        id="session-link"
        href="https://www.sageflashcards.ai/"
        className="text-lg font-semibold underline hover:text-gray-700"
      >
        Return to your session
      </a>
    </div>
  );
}
