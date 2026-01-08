---
title: Button Component
order: 1
category: "Components"
---

# Button

The `Button` component is used to trigger an action or event, such as submitting a form, opening a dialog, or canceling an action.

## Usage

```jsx
import { Button } from '@bmdrm/ui';

export default function App() {
  return (
    <div className="flex gap-4">
      <Button variant="primary">Click Me</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="destructive" size="sm">Delete</Button>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `primary` \| `secondary` \| `destructive` | `primary` | Visual style of the button |
| `size` | `sm` \| `md` \| `lg` | `md` | Size of the button |
| `isLoading` | `boolean` | `false` | Shows a loading spinner |

## Examples

### Loading State

```jsx
<Button isLoading>Processing...</Button>
```

### With Icons

```jsx
<Button>
  <MailIcon className="mr-2 h-4 w-4" /> Login with Email
</Button>
```
