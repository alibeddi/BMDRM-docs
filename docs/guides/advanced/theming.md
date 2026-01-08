---
title: Advanced Theming
order: 1
category: "Guides"
---

# Advanced Theming

BMDRM features a powerful theming engine built on CSS variables, allowing for runtime updates and complete customization.

## Global Variables

Defining these variables in your `:root` will affect the entire application.

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  
  --radius: 0.5rem;
}
```

## Dark Mode Strategy

We use a class-based strategy (`.dark`).

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}
```

### Extending the Theme

You can extend the theme by adding new properties to your `tailwind.config.js`.

```javascript
theme: {
  extend: {
    colors: {
      brand: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        // ...
        900: '#0c4a6e',
      }
    }
  }
}
```
