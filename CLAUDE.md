# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CustomClick** is a Chrome Manifest V3 extension that transforms Chrome's static right-click context menu into a dynamic, personalized command center with integrated AI assistance. The extension puts custom actions and AI capabilities at users' fingertips through an enhanced context menu experience.

## Development Commands

### Essential Build Commands
- `npm run build` - Production build for Chrome extension distribution
- `npm run dev` - Watch mode development with automatic rebuilding
- `npm run package` - Creates distributable zip file for Chrome Web Store
- `npm run type-check` - TypeScript validation without emit

### Code Quality Commands  
- `npm run lint` - ESLint with zero warnings policy (build will fail on warnings)
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Prettier formatting for all TypeScript, CSS, and JSON files

### Chrome Extension Testing
After building, load the extension in Chrome:
1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `dist/` folder
4. After code changes, run `npm run build` and click the refresh button on the extension card

## Architecture Overview

### Multi-Entry Vite Build System
The project uses a sophisticated Vite configuration with 4 distinct entry points that compile to different Chrome extension components:

- **Background Service Worker**: `src/background/index.ts` → `dist/background.js` (ES modules)
- **Content Scripts**: `src/content/index.tsx` → `dist/content.js` (React components injected into web pages)
- **Popup Interface**: `src/popup/index.html` → `dist/src/popup/index.html` (React-based toolbar popup)
- **Options Page**: `src/options/index.html` → `dist/src/options/index.html` (Full settings interface)

### Chrome Extension Manifest V3 Structure
The extension follows Manifest V3 requirements with specific permission model:
- **Host Permissions**: `<all_urls>` for universal right-click functionality
- **Storage**: Cross-device settings synchronization via `chrome.storage.sync`
- **Content Script Injection**: Automatic injection on all websites with `document_end` timing
- **Service Worker**: Background script as ES module with proper message handling

### React Architecture Patterns
- **Modern React 18**: Uses `createRoot` and functional components with hooks
- **Isolated DOM Injection**: Content scripts create isolated containers with high z-index (999999)
- **Chrome API Integration**: Direct usage of `chrome.storage.sync`, `chrome.runtime` APIs in React components
- **Type-Safe Settings**: TypeScript interfaces in `src/shared/types.ts` define all extension data structures

### Shared Architecture
- **`src/shared/types.ts`**: Central type definitions for settings, menu items, messages, AI config
- **`src/shared/constants.ts`**: Extension-wide constants including storage keys, animation durations, z-index values
- **Path Aliases**: Use `@/`, `@/shared/`, `@/assets/` for clean imports across components

### Styling System
- **Tailwind CSS**: Complete integration with custom color palette and dark mode support
- **Component-Scoped Styles**: Each extension component has its own CSS file using Tailwind utilities
- **PostCSS Processing**: Autoprefixer and Tailwind processing via Vite build pipeline

## Critical Development Notes

### Build Output Structure
The Vite build creates a specific structure required for Chrome extensions:
- Static assets (manifest.json, icons) must be manually copied to `dist/` 
- HTML files are nested in `dist/src/popup/` and `dist/src/options/` directories
- JavaScript entry points are flattened to `dist/` root level

### TypeScript Configuration
- **Strict Mode**: All TypeScript strict checks enabled
- **Chrome Extension Types**: `@types/chrome` provides full Chrome API typing
- **ES2020 Target**: Modern JavaScript features supported
- **Path Mapping**: Configured for clean imports matching Vite aliases

### Extension-Specific Considerations
- **Content Script Isolation**: Creates React roots in isolated DOM containers to avoid conflicts
- **Message Passing**: Background script and content scripts communicate via `chrome.runtime.onMessage`
- **Storage Persistence**: Settings are stored in `chrome.storage.sync` for cross-device synchronization
- **Permission Model**: Follows principle of least privilege while enabling core functionality

### Code Quality Standards
- **Zero Warning Policy**: ESLint configured to fail builds on any warnings
- **Type Safety**: No `any` types allowed (use `unknown` for external data)
- **Modern React**: Functional components only, no class components
- **Chrome API Best Practices**: Proper error handling and manifest permissions for all Chrome APIs used

## Menu Action System
The extension uses a custom action format for context menu items:
```typescript
{
  type: 'ai_action' | 'custom_script' | 'quick_link' | 'text_transform',
  label: string,
  icon?: string,
  action: string | Function,
  context?: 'text' | 'image' | 'link' | 'page'
}
```

## Technology Stack
- **Build**: Vite with @crxjs/vite-plugin for Chrome extension bundling
- **Frontend**: React 18.2 with TypeScript 5.0, Tailwind CSS 3.4 for styling
- **State Management**: Zustand for extension state
- **Validation**: Zod for runtime schema validation
- **Security**: DOMPurify for content sanitization
- **Testing**: Jest for unit tests, Playwright for E2E
- **Quality**: ESLint (Airbnb TypeScript), Prettier, Husky pre-commit hooks

## Security Considerations
- All user-generated content is sanitized through DOMPurify
- CSP policy restricts script execution to 'self'
- Context menu permissions are scoped to minimize attack surface
- AI API keys are stored securely in Chrome storage with encryption

## MVP Goals
- **Target**: 1,000+ installs within 30 days of launch
- **Performance**: <100ms context menu render time
- **Quality**: 4.0+ star rating on Chrome Web Store
- **Conversion**: 10% free-to-paid conversion rate
- **Reliability**: Zero critical bugs in production

## Current Sprint Status

### Active Sprint: CustomClick MVP Development
**Jira Project**: SCRUM (Test Claude)  
**Sprint Board**: https://manojpls.atlassian.net  

#### Phase 1: Core Functionality (In Progress)
- **SCRUM-22** (CC-1): Setup Chrome Extension Project Structure ✅ **COMPLETED**
- **SCRUM-23** (CC-2): Implement Context Menu Override System 🔄 **NEXT**
- **SCRUM-24** (CC-3): Build Basic Menu UI Component
- **SCRUM-25** (CC-4): Implement Text Selection Detection  
- **SCRUM-26** (CC-5): Add Basic Search Actions

#### Phase 2: Customization Features 
- **SCRUM-27** (CC-6): Create Icon Grid System
- **SCRUM-28** (CC-7): Implement Drag-Drop Reordering
- **SCRUM-29** (CC-8): Build Settings/Options Page
- **SCRUM-30** (CC-9): Implement Theme System
- **SCRUM-31** (CC-10): Add Chrome Storage Integration

#### Phase 3: AI Integration
- **SCRUM-32** (CC-11): Setup OpenAI API Integration  
- **SCRUM-33** (CC-12): Create AI Chat Interface
- **SCRUM-34** (CC-13): Implement Prompt Engineering System
- **SCRUM-35** (CC-14): Add Response Streaming
- **SCRUM-36** (CC-15): Create API Key Management

#### Phase 4: Polish & Launch
- **SCRUM-37** (CC-16): Performance Optimization
- **SCRUM-38** (CC-17): Create Chrome Web Store Assets
- **SCRUM-39** (CC-18): Implement Analytics & Telemetry  
- **SCRUM-40** (CC-19): Create Documentation & Help System
- **SCRUM-41** (CC-20): Launch Preparation & Marketing

### Sprint Progress
- **Total Tasks**: 20 tasks (CC-1 through CC-20)
- **Completed**: 1/20 (5%)
- **In Progress**: Phase 1 - Core Functionality
- **Next Priority**: SCRUM-23 (Context Menu Override System)

### Task Implementation Workflow

When starting any Jira task, follow this structured approach:

#### 0. **Jira Ticket Review** (MANDATORY FIRST STEP)
- **Check Jira ticket status**: Visit the ticket URL and verify current status
- **Move ticket to "In Progress"**: If status is "To Do", transition it to "In Progress"
- **Read all ticket comments**: Review the complete comment history to understand:
  - What work has already been completed
  - Current progress and blockers
  - Technical decisions made
  - Any context or requirements changes
- **Identify current state**: Determine exactly where the previous work left off
- **Update work log**: Add a comment indicating you're starting work on the ticket

#### 1. **Research Phase** (Before Implementation)
- **Read the Jira ticket thoroughly**: Understand acceptance criteria, technical requirements, and dependencies
- **Research best practices online**: Use WebSearch to find current best practices, patterns, and examples
  - Search for "Chrome extension [feature] best practices 2025"
  - Look for "React TypeScript [component] implementation patterns"
  - Find "Chrome MV3 [API] examples and tutorials"
- **Check official documentation**: Review Chrome Extension APIs, React docs, TypeScript guides
- **Analyze similar implementations**: Search GitHub for open-source Chrome extensions with similar features
- **Understand the context**: Review related files in the codebase and existing patterns
- **Research tools and libraries**: Find the most suitable packages and check their documentation

**Example Research Queries**:
```
"Chrome extension context menu override 2025"
"React TypeScript Chrome extension architecture"
"Chrome MV3 content script best practices"
"Chrome extension state management patterns"
```

#### 2. **Planning Phase**
- **Create implementation plan**: Break down the task into specific steps using TodoWrite
- **Identify dependencies**: Check if prerequisite tasks are completed
- **Review architecture**: Ensure the approach fits the existing system design
- **Consider edge cases**: Think about error handling, performance, and security implications

#### 3. **Implementation Phase**
- **Follow the implementation plan**: Execute step-by-step using your todo list
- **Write clean, documented code**: Follow existing code patterns and conventions
- **Test thoroughly**: Verify functionality and edge cases
- **Update progress**: Add work logs and comments to Jira ticket

#### 4. **Completion Phase**
- **Verify acceptance criteria**: Ensure all requirements are met
- **Run quality checks**: Execute linting, type checking, and tests
- **Document the implementation**: Add detailed completion comment to Jira
- **Transition ticket to "Done"** in Jira
- **Update sprint progress**: Add summary to Epic if significant milestone

### Jira Integration Guidelines
**Status Transitions**: "To Do" → "In Progress" → "Done"
**Work Logging**: Add detailed comments with progress updates and technical decisions
**Dependencies**: Link related tickets and note any blockers or prerequisites
**Documentation**: Include code snippets, implementation notes, and verification steps

## Development Status
Project is in active development with structured sprint planning. Core extension scaffolding is complete and ready for context menu implementation.