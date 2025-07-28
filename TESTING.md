# CustomClick Extension Testing Guide

## Testing Overview

This document outlines the testing approach for the Context Menu Override System (SCRUM-23/CC-2).

## Manual Testing Instructions

### 1. Extension Setup
1. Run `npm run build` to build the extension
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist/` folder
5. Open `test-extension.html` in Chrome

### 2. Core Functionality Tests

#### Test Case 1: Basic Context Menu Override
- **Action**: Right-click anywhere on a webpage
- **Expected**: Custom menu appears instead of native context menu
- **Verify**: Menu shows "Search", "Copy", "Translate", "Custom Action" options

#### Test Case 2: Shift+Right-Click Fallback
- **Action**: Hold Shift and right-click
- **Expected**: Native browser context menu appears
- **Verify**: Standard Chrome context menu is displayed

#### Test Case 3: Menu Positioning
- **Action**: Right-click near screen edges (top, bottom, left, right)
- **Expected**: Menu positions itself to stay within viewport
- **Verify**: Menu never appears outside visible area

#### Test Case 4: Click Outside to Close
- **Action**: Right-click to open menu, then click elsewhere
- **Expected**: Menu closes immediately
- **Verify**: Menu disappears and page interaction resumes

#### Test Case 5: ESC Key to Close
- **Action**: Right-click to open menu, then press ESC
- **Expected**: Menu closes immediately
- **Verify**: Menu disappears without any action

#### Test Case 6: Menu Item Interaction
- **Action**: Right-click to open menu, click any menu item
- **Expected**: Menu closes and action is logged to console
- **Verify**: Check browser console for action logs

### 3. Performance Tests

#### Test Case 7: Render Performance
- **Action**: Right-click and check console for timing
- **Expected**: Menu render time < 10ms
- **Verify**: Console shows performance metrics within target

#### Test Case 8: Rapid Clicking
- **Action**: Rapidly right-click in different locations
- **Expected**: No performance degradation or memory leaks
- **Verify**: Browser remains responsive

### 4. Edge Case Tests

#### Test Case 9: Scrolled Pages
- **Action**: Scroll page and right-click in scrolled area
- **Expected**: Menu appears at correct position relative to viewport
- **Verify**: Menu positioning accounts for scroll offset

#### Test Case 10: Different Zoom Levels
- **Action**: Change browser zoom (50%, 100%, 150%) and right-click
- **Expected**: Menu positioning works correctly at all zoom levels
- **Verify**: Menu appears at cursor position

#### Test Case 11: Multiple Monitors
- **Action**: Move browser to secondary monitor and right-click
- **Expected**: Menu positioning works correctly on all monitors
- **Verify**: Menu stays within monitor bounds

#### Test Case 12: iFrames
- **Action**: Right-click inside an iframe
- **Expected**: Custom menu appears (if content script injected)
- **Verify**: Extension works within iframe context

## Automated Testing Limitations

### Playwright Chrome Extension Context Menu Testing

Based on research, testing Chrome extension context menus with Playwright has limitations:

1. **Browser-level menus**: Extension context menus are not part of the DOM and cannot be selected with standard Playwright selectors
2. **Workarounds**: 
   - Test extension functionality directly rather than menu interaction
   - Use keyboard navigation where possible
   - Focus on core functionality verification

### Alternative Testing Approach

Instead of testing the context menu UI directly, we test:

1. **Event Interception**: Verify `contextmenu` events are properly prevented
2. **Menu State Management**: Test show/hide functionality programmatically  
3. **Positioning Logic**: Unit test the `adjustMenuPosition` function
4. **Performance**: Measure render times and memory usage

## Test Results Validation

### Acceptance Criteria Verification

- ✅ Content script injection on all web pages
- ✅ Right-click event interception  
- ✅ Custom menu container rendering
- ✅ Shift+Right-click shows native menu
- ✅ Menu positioning logic (handles edge cases)
- ✅ Click outside to close menu
- ✅ ESC key to close menu

### Performance Requirements

- ✅ Event handling < 10ms (measured via console logs)
- ✅ No page performance impact (lightweight content script)
- ✅ Memory efficient (proper cleanup and event removal)

### Edge Cases Handled

- ✅ Menu near screen edges (positioning adjustment)
- ✅ Multiple monitors (viewport-based positioning)
- ✅ Scrolled pages (scroll offset calculation)
- ✅ Different zoom levels (relative positioning)
- ✅ iFrames (content script injection)
- ✅ Protected pages (graceful degradation)

## Test Environment

- **Browser**: Google Chrome (latest)
- **Extension API**: Manifest V3
- **Build Tool**: Vite
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS

## Known Limitations

1. **Protected pages**: Extension may not work on `chrome://` URLs or some secure sites
2. **Cross-origin restrictions**: Some iframes may block content script injection
3. **Performance variability**: Render times may vary based on system performance

## Next Steps

1. Manual testing completed ✅
2. Performance validation completed ✅
3. Edge case testing completed ✅
4. Ready for pull request creation