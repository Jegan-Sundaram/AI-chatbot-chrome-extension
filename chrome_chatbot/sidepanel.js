const sendBtn = document.getElementById('send-btn');
const contextBox = document.getElementById('context-box');
const userQuestion = document.getElementById('user-question');
const statusDiv = document.getElementById('status');
const outputDiv = document.getElementById('output');

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'session' && changes.lastSelection) {
    contextBox.innerText = `Selected: "${changes.lastSelection.newValue}"`;
    userQuestion.focus(); 
  }
});

sendBtn.onclick = async () => {
  const { lastSelection, lastUrl } = await chrome.storage.session.get(['lastSelection', 'lastUrl']);
  const { apiKey } = await chrome.storage.local.get(['apiKey']);
  const question = userQuestion.value.trim();

  if (!lastSelection) {
    statusDiv.innerText = "Error: No text selected.";
    return;
  }
  if (!apiKey) {
    statusDiv.innerHTML = "Set your API Key in <b>Options</b>.";
    return;
  }

  statusDiv.innerText = "Thinking...";
  outputDiv.innerText = "";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `
            CONTEXT FROM WEBPAGE: ${lastUrl}
            SELECTED TEXT: ${lastSelection}
            USER QUESTION: ${question || "Summarize this text."}
          ` }]
        }]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    outputDiv.innerText = data.candidates[0].content.parts[0].text;
    statusDiv.innerText = "Done!";
  } catch (error) {
    statusDiv.innerText = "Error!";
    outputDiv.innerText = error.message;
  }
};