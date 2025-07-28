// Working CustomClick content script
console.log('CustomClick extension loaded!');

// Create menu HTML
function createMenu() {
    const menu = document.createElement('div');
    menu.id = 'customclick-menu';
    menu.innerHTML = `
        <div style="
            position: fixed;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 8px 0;
            min-width: 200px;
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 14px;
        ">
            <div class="menu-item" style="
                padding: 8px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background-color 0.15s ease;
            " onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
                🔍 Search
            </div>
            <div class="menu-item" style="
                padding: 8px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background-color 0.15s ease;
            " onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
                📋 Copy
            </div>
            <div class="menu-item" style="
                padding: 8px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background-color 0.15s ease;
            " onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
                🌐 Translate
            </div>
            <hr style="margin: 4px 8px; border: none; border-top: 1px solid #eee;">
            <div class="menu-item" style="
                padding: 8px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background-color 0.15s ease;
            " onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">
                ⚡ Custom Action
            </div>
        </div>
    `;
    return menu;
}

// Show menu at position
function showMenu(x, y) {
    // Remove any existing menu
    hideMenu();
    
    const menu = createMenu();
    menu.style.position = 'fixed';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.zIndex = '2147483647';
    
    // Add click handlers to menu items
    const items = menu.querySelectorAll('.menu-item');
    items.forEach((item, index) => {
        item.addEventListener('click', function() {
            const actions = ['search', 'copy', 'translate', 'custom'];
            console.log('Menu action:', actions[index]);
            hideMenu();
        });
    });
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('keydown', handleEscapeKey);
    }, 0);
}

// Hide menu
function hideMenu() {
    const existingMenu = document.getElementById('customclick-menu');
    if (existingMenu) {
        existingMenu.remove();
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('keydown', handleEscapeKey);
    }
}

// Handle clicks outside menu
function handleOutsideClick(e) {
    const menu = document.getElementById('customclick-menu');
    if (menu && !menu.contains(e.target)) {
        hideMenu();
    }
}

// Handle escape key
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        hideMenu();
    }
}

// Handle right-click events
document.addEventListener('contextmenu', function(e) {
    console.log('Right-click detected');
    
    // Allow native context menu with Shift+Right-click
    if (e.shiftKey) {
        return true;
    }
    
    // Prevent default context menu
    e.preventDefault();
    e.stopPropagation();
    
    // Show custom menu at click position
    showMenu(e.clientX, e.clientY);
    
    return false;
}, true);

// Hide menu on scroll and resize
document.addEventListener('scroll', hideMenu, true);
window.addEventListener('resize', hideMenu);

console.log('CustomClick content script initialized');