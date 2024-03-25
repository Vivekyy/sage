import { countdown } from './utils';

function onLoad() {
  const sessionField = document.querySelector('#current-session') as HTMLParagraphElement;
  const prefixField = document.querySelector('#current-session-prefix') as HTMLParagraphElement;
  const sessionLink = document.querySelector('#session-link') as HTMLLinkElement;
  countdown(onLoad, sessionField).then(function (countdownResponse) {
    if (countdownResponse == 'true') {
      prefixField.textContent = 'Time Remaining in Current Study Session:';
    } else {
      prefixField.textContent = 'No active study session, feel free to resume browsing!';
      sessionField.textContent = '';

      sessionLink.setAttribute('href', '');
      sessionLink.textContent = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', onLoad);
