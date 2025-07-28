// Background script for CustomClick extension
console.log('CustomClick background script loaded');

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('CustomClick extension installed');
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  sendResponse({ status: 'received' });
});

export {};