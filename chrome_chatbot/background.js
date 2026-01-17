chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyze-text",
    title: "Analyze selection with AI",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyze-text") {
    chrome.sidePanel.open({ windowId: tab.windowId });
    chrome.storage.session.set({ 
      lastSelection: info.selectionText, 
      lastUrl: tab.url,
      timestamp: Date.now() 
    });
  }
});