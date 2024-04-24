import { checkSession } from './utils';

// Handle Blocking
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'loading' && tab.url) {
    let blocked = false;

    return new Promise((resolve) =>
      checkSession().then(function (checkSessionResponse) {
        // checkSessionResponse = 'true'; //temporary
        if (checkSessionResponse == 'true') {
          chrome.storage.sync.get({ blocks: [] }, function (value) {
            const error = chrome.runtime.lastError;
            if (error) {
              console.error('Failed to get data from storage:', error);
              resolve({});
            }

            const curUrl = new URL(tab.url!);
            const curDomain = curUrl.hostname.replace(/^www\./, '');
            const curPath = curUrl.pathname;

            for (const blockSite of value.blocks) {
              const domainReg = new RegExp(blockSite.domain);
              if (domainReg.test(curDomain)) {
                if (!blockSite.path) {
                  blocked = true;
                  break;
                } else {
                  const pathReg = new RegExp(blockSite.path);
                  if (pathReg.test(curPath)) {
                    blocked = true;
                    break;
                  }
                }
              }
            }

            if (blocked) {
              console.log('Blocking site');
              const blockUrl = chrome.runtime.getURL('block.html');
              chrome.tabs.update(tabId, { url: blockUrl });
            }
          });
        }
      }),
    );
  }
});

// Handle Login
// TODO
