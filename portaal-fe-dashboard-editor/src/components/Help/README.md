# Dashboard Editor Help System

A comprehensive, integrated help system for the React TypeScript dashboard widget editor. This system provides contextual help, guided tours, searchable documentation, and usage analytics.

## 🚀 Features

- **Interactive Tooltips**: Contextual help that appears on hover, click, or focus
- **Guided Tours**: Step-by-step interactive walkthroughs
- **Searchable Documentation**: Comprehensive help panel with categorized content
- **Help Mode**: Global mode that highlights all interactive help elements
- **Analytics**: Track help system usage and user behavior
- **Contextual Suggestions**: Smart recommendations based on user context
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive Design**: Works on all screen sizes
- **Multi-language Support**: Ready for internationalization

## 📦 Components

### Core Components

- **`HelpSystem`**: Main wrapper component that provides the help context
- **`HelpProvider`**: React context provider for help system state management
- **`HelpTooltip`**: Interactive tooltips with rich content support
- **`HelpTour`**: Guided tour system with progress tracking and navigation
- **`HelpPanel`**: Comprehensive documentation viewer with search and categories
- **`HelpTrigger`**: Main help menu with quick access to all features
- **`HelpContextualSuggestions`**: Smart help suggestions based on user context

### Services

- **`helpAnalytics`**: Analytics service for tracking help system usage

## 🛠 Installation & Setup

The help system is already integrated into the dashboard editor. To use it in a new application:

```tsx
import { HelpSystem } from './components/Help';

function App() {
  return (
    <HelpSystem
      config={{
        enabled: true,
        showTooltipsInHelpMode: true,
        enableKeyboardShortcuts: true,
        defaultCategory: 'getting-started',
        autoStartTour: null // or 'first-time-user'
      }}
    >
      <YourApplication />
    </HelpSystem>
  );
}
```

## 📖 Basic Usage

### Adding Tooltips

```tsx
import { HelpTooltip } from './components/Help';

<HelpTooltip
  id="unique-help-id"
  title="Feature Title"
  content="Detailed explanation of what this feature does and how to use it."
  position="top" // top, bottom, left, right
  trigger="hover" // hover, click, focus
>
  <YourComponent />
</HelpTooltip>
```

### Using Help Mode

Help Mode can be activated by:
- Pressing `F1` key
- Clicking the Help button and selecting "Enter Help Mode"
- Programmatically: `const { toggleHelpMode } = useHelp(); toggleHelpMode();`

### Adding Tours

Tours are defined in `data/helpTours.ts`:

```typescript
{
  id: 'my-tour',
  name: 'My Feature Tour',
  description: 'Learn how to use this awesome feature',
  category: 'features',
  steps: [
    {
      id: 'step-1',
      target: '[data-help-id="my-component"]',
      title: 'Welcome',
      content: 'This is the first step of our tour.',
      position: 'bottom'
    }
    // ... more steps
  ]
}
```

### Adding Help Content

Help articles are defined in `data/helpContent.ts`:

```typescript
{
  id: 'my-article',
  title: 'How to Create Widgets',
  category: 'widgets',
  tags: ['creation', 'basics'],
  searchKeywords: ['create', 'new', 'widget', 'add'],
  content: `
    <p>This article explains how to create new widgets...</p>
    <h3>Step by Step</h3>
    <ol>
      <li>First step</li>
      <li>Second step</li>
    </ol>
  `
}
```

## 🔧 Advanced Usage

### Contextual Suggestions

Display contextual help based on user's current page or action:

```tsx
import { HelpContextualSuggestions } from './components/Help';

<HelpContextualSuggestions
  context="widget-creation" // Current context
  userAction="creating chart widget" // What user is doing
  className="my-custom-class"
/>
```

### Help Analytics

Track and analyze help system usage:

```tsx
import { useHelpAnalytics } from './components/Help';

function MyComponent() {
  const analytics = useHelpAnalytics();
  
  // Track custom events
  analytics.track({
    type: 'custom_event',
    customData: 'any data'
  });
  
  // Get usage statistics
  const stats = analytics.getUsageStats();
  
  // Get insights
  const insights = analytics.getInsights();
  
  return <div>...</div>;
}
```

### Custom Help Context

Access help system state anywhere in your app:

```tsx
import { useHelp } from './components/Help';

function MyComponent() {
  const {
    isHelpMode,
    activeTour,
    helpPanelOpen,
    toggleHelpMode,
    startTour,
    toggleHelpPanel
  } = useHelp();
  
  return (
    <div>
      {isHelpMode && <div>Help mode is active!</div>}
      <button onClick={() => startTour('my-tour')}>
        Start Tutorial
      </button>
    </div>
  );
}
```

## ⌨️ Keyboard Shortcuts

- `F1` - Toggle Help Mode
- `Ctrl + Shift + H` - Toggle Help Panel
- `Escape` - Close help panel or exit tours
- `Tab` / `Shift + Tab` - Navigate help elements
- `Enter` - Activate help elements

## 🎨 Styling

The help system uses CSS custom properties for easy theming:

```css
:root {
  --help-primary-color: #007acc;
  --help-primary-dark: #005c99;
  --help-secondary-color: #4CAF50;
  --help-background: #ffffff;
  --help-border: #e0e0e0;
  --help-text: #333333;
  --help-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

Custom CSS classes:

```scss
.help-tooltip-popup {
  // Customize tooltip appearance
}

.help-tour-popup {
  // Customize tour popup appearance
}

.help-panel {
  // Customize help panel appearance
}
```

## 📊 Analytics & Insights

The help system automatically tracks:

- Tooltip views and duration
- Tour starts, completions, and abandonment points
- Help panel usage
- Content views and search queries
- User behavior patterns

Access analytics data:

```tsx
import { helpAnalytics } from './components/Help';

// Get comprehensive statistics
const stats = helpAnalytics.getUsageStats();

// Get actionable insights
const insights = helpAnalytics.getInsights();

// Export data for analysis
const exportData = helpAnalytics.exportData();
```

## 🌐 Accessibility

The help system is fully accessible:

- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Focus management
- ARIA labels and descriptions
- Reduced motion support

## 📱 Responsive Design

- Mobile-first approach
- Touch-friendly interactions
- Responsive layouts
- Optimized for all screen sizes

## 🔧 Configuration Options

```tsx
interface HelpSystemConfig {
  enabled: boolean; // Enable/disable entire help system
  showTooltipsInHelpMode: boolean; // Show all tooltips in help mode
  autoStartTour: string | null; // Auto-start tour on load
  defaultCategory: string; // Default help panel category
  enableKeyboardShortcuts: boolean; // Enable keyboard shortcuts
}
```

## 🧪 Testing

Test help system components:

```tsx
import { render, screen } from '@testing-library/react';
import { HelpSystem, HelpTooltip } from './components/Help';

test('tooltip appears on hover', async () => {
  render(
    <HelpSystem>
      <HelpTooltip id="test" content="Test content">
        <button>Test</button>
      </HelpTooltip>
    </HelpSystem>
  );
  
  // Test tooltip behavior
});
```

## 🚀 Performance

- Lazy loading of help content
- Efficient event handling
- Optimized re-renders
- Small bundle size
- Memory leak prevention

## 🐛 Troubleshooting

### Common Issues

1. **Tooltips not showing**: Ensure the component is wrapped with `HelpSystem`
2. **Tours not working**: Check that target elements have the correct `data-help-id` attributes
3. **Help panel empty**: Verify help content is properly imported
4. **Keyboard shortcuts not working**: Check if `enableKeyboardShortcuts` is true

### Debug Mode

Enable debug logging:

```tsx
// In development
if (process.env.NODE_ENV === 'development') {
  window.helpDebug = true;
}
```

## 📝 Best Practices

1. **Use descriptive help IDs**: Make them meaningful and unique
2. **Keep tooltips concise**: 1-2 sentences max
3. **Structure tours logically**: Follow user workflow
4. **Test on mobile**: Ensure good mobile experience
5. **Monitor analytics**: Use data to improve help content
6. **Update regularly**: Keep help content current
7. **Use consistent language**: Maintain tone and terminology

## 🤝 Contributing

When adding new help content:

1. Add help IDs to components: `data-help-id="unique-id"`
2. Create helpful tooltips with clear, concise content
3. Update tour steps if needed
4. Add relevant help articles
5. Test across different screen sizes
6. Verify accessibility compliance

## 📄 File Structure

```
src/components/Help/
├── index.ts                     # Main exports
├── README.md                    # This documentation
├── HelpSystem.tsx              # Main wrapper component
├── HelpProvider.tsx            # Context provider
├── HelpTooltip.tsx             # Tooltip component
├── HelpTour.tsx                # Tour component  
├── HelpPanel.tsx               # Documentation panel
├── HelpTrigger.tsx             # Help menu trigger
├── HelpContextualSuggestions.tsx # Smart suggestions
├── data/
│   ├── helpContent.ts          # Help articles
│   └── helpTours.ts            # Tour definitions
├── services/
│   └── helpAnalytics.ts        # Analytics service
└── *.scss                      # Styling files
```

## 🔮 Future Enhancements

- Video tutorials integration
- Multi-language support
- Advanced search with filters
- Help content versioning
- Integration with support ticketing
- AI-powered help suggestions
- Voice-guided tours
- Collaborative help editing