document.getElementById('save').addEventListener('click', () => {
  const key = document.getElementById('apiKey').value;
  chrome.storage.local.set({ apiKey: key }, () => {
    document.getElementById('status').innerText = "Key saved successfully!";
  });
});

chrome.storage.local.get(['apiKey'], (result) => {
  if (result.apiKey) document.getElementById('apiKey').value = result.apiKey;
});