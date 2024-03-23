// Handle Blocking
function checkSession() {
  return new Promise((resolve) =>
    chrome.storage.sync.get(
      {
        sessions: [],
      },
      function (value) {
        const error = chrome.runtime.lastError;
        if (error) {
          console.error('Failed to get data from storage:', error);
          resolve('fail');
        }

        for (const sesh of value.sessions) {
          const now = new Date();

          const start = new Date(parseInt(sesh.start));
          start.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
          const end = new Date(parseInt(sesh.end));
          end.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());

          if (now >= start && now <= end) {
            resolve('true');
          }
        }
        resolve('false');
      },
    ),
  );
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'loading' && tab.url) {
    let blocked = false;

    return new Promise((resolve) =>
      checkSession().then(function (checkSessionResponse) {
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
