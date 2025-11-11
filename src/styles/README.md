# Styles Directory

This directory contains shared CSS resources used across the application.

## Files

### `common.module.css`

Reusable CSS module classes for common UI patterns.

**Purpose**: Provides consistent, reusable styles for buttons, form controls, feedback messages, cards, and utility classes.

**Usage Example**:

```tsx
import commonStyles from '@/styles/common.module.css';

function MyComponent() {
  return (
    <div className={commonStyles.card}>
      <h2 className={commonStyles.cardHeader}>Title</h2>
      <div className={commonStyles.cardBody}>
        <input
          type="text"
          className={commonStyles.textInput}
          placeholder="Enter text"
        />
        <button className={commonStyles.primaryButton}>
          Submit
        </button>
      </div>
    </div>
  );
}
```

**Available Styles**:

- **Buttons**: `primaryButton`, `secondaryButton`, `successButton`, `warningButton`
- **Form Controls**: `textInput`, `textArea`, `select`
- **Feedback Messages**: `successMessage`, `errorMessage`, `warningMessage`, `infoMessage`
- **Cards**: `card`, `cardHeader`, `cardBody`
- **Loading**: `loadingContainer`, `loadingText`
- **Utilities**: `textCenter`, `textLeft`, `textRight`, `marginTop*`, `marginBottom*`, `fullWidth`, `hidden`, `visuallyHidden`

**Best Practices**:

1. Use common styles for new components to maintain consistency
2. Compose with component-specific styles when needed:
   ```tsx
   <button className={`${commonStyles.primaryButton} ${styles.myCustomButton}`}>
     Click me
   </button>
   ```
3. Prefer common styles over duplicating patterns in component CSS

### `static-seo.css`

Static styles for SEO content that loads before React.

**Purpose**: Ensures search engine crawlers and no-JS browsers see properly styled content.

**Key Features**:

- Loads synchronously in `<head>` before JavaScript
- Uses CSS variables with fallbacks for compatibility
- Styles `#static-content` div for SEO/no-JS scenarios
- Excluded from stylelint color rules (fallbacks are intentional)

**When to Modify**: Only when changing the static SEO content structure in `index.html`.

## Adding New Shared Styles

When adding new shared patterns:

1. **Evaluate reusability**: Is this pattern used in 3+ places?
2. **Add to common.module.css**: Group with related styles
3. **Document in comments**: Explain purpose and usage
4. **Test stylelint**: Run `npm run stylelint` to verify
5. **Update this README**: Add to the "Available Styles" list

## Integration with CSS Variables

All styles in this directory use CSS variables defined in `src/index.css`. This ensures:

- Consistent theming (light/dark mode support)
- Easy customization
- Maintainable color palette
- Semantic naming

## Stylelint Configuration

Files in this directory follow project-wide stylelint rules with exceptions:

- `static-seo.css`: Allows hex colors (needed for fallbacks)
- `*.module.css`: Standard CSS Modules rules apply
