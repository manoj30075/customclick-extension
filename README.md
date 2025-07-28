# CustomClick Chrome Extension

Transform your right-click into a customizable AI-powered command center.

## 🚀 Features

- **Custom Context Menu**: Replace the boring default right-click menu
- **Icon Grid System**: Quick-access shortcuts with drag-drop customization  
- **AI Integration**: Built-in ChatGPT for instant assistance
- **Context-Aware Actions**: Different options for text, images, and links
- **Lightning Fast**: Renders in under 100ms

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Chrome browser for testing

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd customclick-extension

# Install dependencies
npm install

# Start development mode
npm run dev

# Build for production
npm run build

# Package for Chrome Web Store
npm run package
```

### Loading in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" 
3. Click "Load unpacked"
4. Select the `dist` folder

## 📁 Project Structure

```
src/
├── background/     # Service worker
├── content/        # Content scripts
├── popup/          # Extension popup
├── options/        # Settings page  
├── shared/         # Shared utilities
└── assets/         # Icons and images
```

## 🔧 Scripts

- `npm run dev` - Development with hot reload
- `npm run build` - Production build
- `npm run package` - Create .zip for store
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.