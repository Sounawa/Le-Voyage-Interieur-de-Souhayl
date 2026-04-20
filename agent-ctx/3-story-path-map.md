# Task 3: Story Path Visualizer

## Summary

Created a StoryPathMap component — a visual branching mini-map showing explored and unexplored story paths in the book app.

## Files Created
- `/home/z/my-project/src/components/book/StoryPathMap.tsx` — Main component (~280 lines)

## Files Modified
- `/home/z/my-project/src/app/globals.css` — Added ~140 lines of CSS for the path map overlay, nodes, connections, endings, and responsive styles
- `/home/z/my-project/src/app/page.tsx` — 3 small edits: import GitBranch + StoryPathMap, add state, add button + render component

## Design

### Vertical Tree Visualization
- **Structure**: Prologue → Chapter 1 → Chapter 2 → Chapter 3 → Chapter 4 → 4 Endings
- **Connection lines**: Amber gradient vertical lines between nodes
- **Chapter nodes**: Circle with chapter emoji icon, title, visited/total pages count, mini progress bar
- **Choice point diamonds**: Up to 3 key branching choices per chapter, shown as rotated squares with emoji labels (e.g., "😤🚶🙋")
- **Ending nodes**: 4-column grid with 🌟 Lumière, 📖 Sagesse, 🌙 Ombre, 🪞 Pureté

### Visual States
- **Explored**: Amber/gold glow, animated shimmer progress, clickable to navigate
- **Unexplored**: Dark muted with lock icon, disabled interaction
- **Endings found**: Floating emoji with golden drop shadow, title revealed
- **Endings locked**: Silhouette with grayscale emoji, "???" label

### Global Stats
- Total page exploration percentage with animated shimmer bar
- Total choices explored / total available choices

### Responsive
- Mobile: Full-screen overlay
- Desktop: Centered modal, max-w-28rem

### Animations
- Framer Motion scale+fade entrance
- Staggered node reveals (0.06s delay per chapter)
- Shimmer progress bar animation
- Gentle float animation on found ending emojis

## CSS Classes Added
- `.story-path-overlay` — Backdrop blur overlay
- `.story-path-container` — Glass-morphism centered modal
- `.path-chapter-row` — Chapter row with hover glow
- `.path-node.explored` / `.path-node.unexplored` — Circle node styling
- `.path-connection` — Vertical gradient connecting line
- `.path-ending-node.ending-found` / `.path-ending-node.ending-locked` — Ending card styling
- Mobile responsive styles for full-screen mode

## Integration
- GitBranch button added to top bar buttons group (same style as other buttons)
- StoryPathMap rendered in page.tsx with isOpen/onClose props
- Uses `goToPage` from `useStoryStore` for navigation
- Reads `visitedPages` and `endingsFound` from store for real-time exploration state

## Lint
- ✅ Clean on all new/modified files (StoryPathMap.tsx, page.tsx, globals.css)
- 1 pre-existing error in ReadingStats.tsx (unrelated to this task)
