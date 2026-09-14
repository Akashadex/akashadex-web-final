# Universal Responsive Web Development Skill

## Purpose

Build production-quality, responsive, accessible, fast, maintainable websites that work well across phones, tablets, laptops, desktops, and large displays.

This skill is universal. Adapt decisions to the project, page type, content, brand, and technology stack instead of forcing every site into one template.

## Core Principle

Design for **content and users first, devices second**.

Do not design a desktop page and merely shrink it for mobile. Create layouts that reflow naturally across viewport sizes and input methods.

Priorities, in order:
1. Usability and clarity
2. Responsive behavior
3. Accessibility
4. Performance
5. Visual hierarchy and polish
6. Maintainability
7. Device/browser compatibility

---

# 1. Understand the Project Before Building

Identify:
- Site purpose
- Primary users
- Main user journeys
- Page types
- Required navigation
- Content hierarchy
- Brand/style requirements
- Required functionality
- Target browsers/devices if known
- Performance requirements
- Accessibility requirements
- SEO requirements
- Existing design system/components

Before coding, determine the reusable components likely to appear across the site.

Typical components:
- Header
- Navigation
- Mobile navigation/drawer
- Breadcrumbs
- Hero section
- Cards
- Article content
- Tables
- Forms
- Buttons
- Search
- Filters
- Pagination
- Footer
- Modal/dialog
- Toast/notification
- Cookie/consent UI where required

Avoid creating one-off components when the same pattern will appear repeatedly.

---

# 2. Responsive Design Strategy

Use a mobile-first approach unless the project has a strong reason not to.

Start with a usable narrow layout, then progressively enhance it for larger screens.

Do not assume specific device models. Design around **content breakpoints**: change the layout when the content stops fitting comfortably.

Prefer fluid layouts using:
- CSS Grid
- Flexbox
- `%`
- `min()`, `max()`, `clamp()`
- `minmax()`
- `rem`/`em`
- `vw`/`vh` when appropriate
- container queries where useful

Avoid excessive fixed widths.

Avoid building layouts that depend on:
- A single screen resolution
- Exact pixel positioning
- Fixed viewport heights for major content
- Horizontal scrolling unless it is intentional
- JavaScript merely to perform basic responsive layout

Use breakpoints only when the design genuinely needs to change.

---

# 3. Device Coverage

Test layouts conceptually and, where possible, physically across:

### Small phones
Check:
- Narrow widths
- Long titles
- Touch targets
- Navigation
- Image cropping
- Button wrapping
- Form usability
- Horizontal overflow

### Large phones
Check:
- Excessive whitespace
- Card widths
- Navigation spacing
- Readability

### Tablets
Check:
- Two-column layouts
- Navigation transitions
- Grid density
- Image sizing
- Landscape orientation

### Laptops
Check:
- Content width
- Sidebars
- Navigation density
- Article readability
- Large empty areas

### Desktops
Check:
- Maximum content width
- Wide layouts
- Multi-column grids
- Sidebars
- Header balance

### Very large displays
Do not allow content to stretch indefinitely.

Use a sensible `max-width` for reading and major content containers.

---

# 4. Layout System

Create a consistent layout system rather than positioning every section independently.

Recommended conceptual structure:

```text
Viewport
└── Page shell
    ├── Header
    ├── Main container
    │   ├── Hero/content
    │   ├── Primary content
    │   └── Secondary content/sidebar
    └── Footer
```

Use consistent:
- Container widths
- Horizontal gutters
- Vertical rhythm
- Section spacing
- Grid gaps
- Border radii
- Shadows
- Typography scale

Use CSS variables/design tokens for repeated values.

Example categories:
- Colors
- Font sizes
- Font weights
- Spacing
- Radii
- Shadows
- Breakpoints/container sizes
- Transitions

---

# 5. Containers and Content Width

Do not let text span the entire desktop viewport.

Use readable line lengths for:
- Articles
- Documentation
- Long-form guides
- Paragraphs

A common starting point for long-form text is roughly 60–80 characters per line, then adjust based on typography and design.

For general site layouts, use a centered container with fluid side padding and a maximum width.

Example concept:

```css
.container {
  width: min(100% - 2rem, 1200px);
  margin-inline: auto;
}
```

Treat this as a starting pattern, not a mandatory value.

---

# 6. Responsive Typography

Typography must remain readable at every viewport size.

Avoid:
- Tiny mobile text
- Huge desktop headings that overwhelm smaller screens
- Fixed font sizes that create poor hierarchy
- Text that becomes cramped because of forced widths

Prefer fluid type where useful:

```css
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

Use `rem` for scalable typography and spacing where appropriate.

Check:
- Heading wrapping
- Paragraph line length
- Line height
- Font weight
- Contrast
- Link readability
- Button text wrapping
- Navigation labels

Never rely on color alone to communicate meaning.

---

# 7. Responsive Images

Images must adapt to available space and device capability.

Use:
- `width: 100%`
- `height: auto`
- `object-fit` when cropping is intentional
- Appropriate aspect ratios
- `srcset`
- `sizes`
- `<picture>` when art direction or format switching is needed
- Modern formats such as WebP/AVIF when supported by the project

Example:

```html
<img
  src="image-800.webp"
  srcset="image-400.webp 400w, image-800.webp 800w, image-1200.webp 1200w"
  sizes="(max-width: 768px) 100vw, 800px"
  width="1200"
  height="800"
  alt="Descriptive alternative text"
/>
```

Important:
- Provide intrinsic dimensions to reduce layout shifts.
- Do not send unnecessarily huge images to small screens.
- Do not sacrifice important image quality merely to reduce file size.
- Use accurate `alt` text for informative images.
- Use empty `alt=""` for genuinely decorative images.
- Do not put SEO keywords into alt text unnaturally.

For hero/LCP images, prioritize fast loading and avoid inappropriate lazy loading.

Lazy-load images that are genuinely below the initial viewport when appropriate.

---

# 8. Image Cropping and Aspect Ratios

Cards containing images should maintain predictable dimensions.

Use consistent aspect ratios where the content benefits from them.

Example:

```css
.card-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

Do not blindly use `object-fit: cover` for images where cropping can remove important information.

---

# 9. Navigation Bars

Navigation must work on both touch and pointer devices.

Desktop may use:
- Full navigation
- Dropdowns
- Search
- Secondary navigation

Mobile may use:
- Hamburger/menu button
- Drawer
- Full-screen menu
- Compact navigation

Mobile navigation requirements:
- Clearly visible menu control
- Large enough touch target
- Obvious open/close state
- Keyboard accessible
- Focus management where appropriate
- No accidental page scrolling behind an open modal/drawer
- Escape key support where appropriate
- Clear active/current location

Do not simply shrink a desktop navigation until labels overlap.

If navigation contains many items, rethink the information architecture rather than forcing everything into a tiny mobile menu.

---

# 10. Buttons and Interactive Controls

Buttons must work comfortably with fingers, mouse, keyboard, and assistive technology.

Ensure:
- Adequate touch target size
- Clear visual state
- Strong contrast
- Visible focus state
- Disabled state where applicable
- Loading state where applicable
- Error state where applicable
- Success state where applicable

Interactive states should include where relevant:
- Default
- Hover
- Focus
- Active/pressed
- Disabled
- Loading
- Selected

Do not communicate an interactive state only through color.

Do not use a `<div>` as a button when a real `<button>` is appropriate.

Use links for navigation and buttons for actions.

---

# 11. Touch and Input

Assume many users will interact with touch.

Avoid:
- Tiny controls
- Controls packed tightly together
- Hover-only functionality
- Tiny close buttons
- Drag-only interactions
- Precision-dependent interactions

Support pointer and keyboard interaction wherever appropriate.

For forms:
- Use appropriate input types
- Use real labels
- Provide useful autocomplete attributes where appropriate
- Do not rely only on placeholder text
- Make validation understandable
- Preserve entered data when possible
- Make errors easy to locate and fix

---

# 12. Accessibility

Accessibility is a core implementation requirement, not a final cosmetic check.

Use semantic HTML:
- `<header>`
- `<nav>`
- `<main>`
- `<section>`
- `<article>`
- `<aside>`
- `<footer>`
- `<button>`
- `<a>`
- Proper heading hierarchy

Ensure:
- Keyboard navigation
- Visible focus indicators
- Logical focus order
- Sufficient color contrast
- Meaningful link text
- Form labels
- Accessible names for icon buttons
- Screen-reader-friendly states
- Reduced-motion support where appropriate

Use ARIA only when native HTML semantics are insufficient.

Do not add ARIA unnecessarily or incorrectly.

Respect:

```css
@media (prefers-reduced-motion: reduce) {
  /* Reduce or remove non-essential animation */
}
```

---

# 13. Mobile Browser Behavior

Consider real mobile browser constraints:
- Dynamic browser address bars
- Safe areas/notches
- Virtual keyboards
- Orientation changes
- Touch scrolling
- Fixed/sticky elements
- Small viewport heights

Use safe-area handling when required:

```css
padding-bottom: env(safe-area-inset-bottom);
```

Be careful with `100vh`. Consider modern viewport units such as `svh`, `lvh`, and `dvh` where appropriate.

Do not create layouts that become unusable when the mobile keyboard opens.

---

# 14. Responsive Cards and Grids

Cards should naturally adapt.

Prefer:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}
```

But choose grid behavior based on the actual content.

Check:
- Equal or intentional card heights
- Title wrapping
- Image ratios
- Button placement
- Metadata wrapping
- Mobile stacking

Avoid making cards so narrow that their content becomes awkward.

---

# 15. Tables and Data-Dense Content

Tables are difficult on mobile.

Choose the appropriate strategy:
- Responsive horizontal scrolling
- Column prioritization
- Stacked mobile representation
- Card transformation
- Condensed table

Never make important information inaccessible simply because the desktop table does not fit.

If horizontal scrolling is intentional:
- Make it obvious
- Preserve readable columns
- Avoid page-level horizontal overflow

---

# 16. Articles and Long-Form Guides

For article-heavy sites such as Akashadex:

Optimize for reading on narrow screens.

Use:
- Readable content width
- Strong heading hierarchy
- Short paragraphs
- Useful lists
- Tables only where useful
- Responsive images
- Sticky table of contents only when it improves navigation
- Clear article metadata
- Related content
- Back-to-top controls only when genuinely useful

Avoid:
- Huge walls of text
- Overly narrow columns
- Excessive sidebars on mobile
- Ads or widgets that dominate the reading experience
- Fixed elements covering article content

On mobile, secondary content should generally move below the primary article unless there is a strong reason otherwise.

---

# 17. Header and Hero Sections

Headers should establish identity and navigation without consuming excessive mobile screen space.

Hero sections should prioritize:
1. Clear message
2. Relevant visual
3. Primary action
4. Supporting information

Do not make the hero so tall that users must scroll before understanding the page.

For mobile:
- Reduce decorative spacing
- Stack content where necessary
- Resize images intelligently
- Keep the primary CTA visible and understandable

---

# 18. Responsive Footer

The footer should remain useful on every screen.

Desktop can use columns.

Mobile should generally stack or collapse groups cleanly.

Include relevant:
- Navigation
- About information
- Contact
- Legal pages
- Social links
- Copyright
- Product/category links

Do not overload the footer with every possible site link.

---

# 19. Performance

Responsive design is not only visual. Device performance matters.

Optimize:
- Images
- Fonts
- JavaScript
- CSS
- Third-party scripts
- Video
- Animations
- Network requests

Prioritize important content.

Avoid:
- Unnecessary JavaScript for simple CSS behavior
- Huge image downloads
- Excessive animation
- Blocking third-party scripts
- Loading every component immediately

Use code splitting/lazy loading where appropriate for the framework.

Monitor Core Web Vitals and real-user performance when possible.

Pay particular attention to:
- LCP
- CLS
- INP

---

# 20. Fonts

Fonts can strongly affect performance and layout.

Prefer:
- System fonts when appropriate
- Efficient font loading
- Limited font families
- Limited weights
- `font-display` strategies appropriate to the design

Prevent text layout problems caused by late font loading where practical.

Do not use five different font families just because they look interesting.

---

# 21. Animation and Motion

Motion should communicate hierarchy or interaction, not merely decorate everything.

Keep animations:
- Short
- Purposeful
- Interruptible where appropriate
- Responsive to reduced-motion preferences

Avoid large animations that delay interaction or make mobile scrolling unpleasant.

Do not animate layout-heavy properties unnecessarily when transform/opacity can achieve the same effect.

---

# 22. Sticky and Fixed Elements

Use sticky/fixed UI carefully.

Potential examples:
- Header
- Mobile bottom navigation
- Article table of contents
- Floating action button

Ensure fixed elements do not:
- Cover content
- Cover focused controls
- Block keyboard interaction
- Consume most of the mobile viewport

Test with long pages and small viewport heights.

---

# 23. Orientation and Viewport Changes

The site should remain usable when users:
- Rotate a phone
- Resize a desktop browser
- Split-screen a tablet
- Zoom the browser
- Increase text size

Do not assume portrait orientation.

Avoid designs that only work at one viewport width.

---

# 24. Browser and Compatibility Strategy

Support the browsers relevant to the project and its audience.

Prefer progressive enhancement:
- Basic functionality should work without unnecessary advanced features.
- Enhanced features can activate when supported.

Do not add compatibility hacks without evidence that they are needed.

Test common combinations of:
- Chromium browsers
- Safari/WebKit
- Firefox
- Mobile Safari
- Android browsers

---

# 25. SEO-Friendly Development

Responsive implementation should support SEO rather than fight it.

Ensure:
- Important content exists in crawlable HTML
- Navigation uses real links
- Pages have meaningful titles
- Headings represent content hierarchy
- Images have appropriate alt text
- Canonical URLs are correct
- Metadata is present
- Structured data is valid when applicable
- Mobile content is not substantially worse than desktop content

Do not hide essential content from mobile users merely to make the design simpler.

---

# 26. URL and Navigation Architecture

Use clean, predictable routes.

Navigation should communicate site hierarchy.

For content sites, consider structures such as:

```text
/
/guides/
/guides/topic-name/
/articles/
/products/
/about/
```

Do not create unnecessary route depth.

Use breadcrumbs where they help users understand location.

---

# 27. Component Architecture

Build reusable components with clear responsibilities.

Examples:
- `Header`
- `MobileMenu`
- `Container`
- `Button`
- `Card`
- `ArticleCard`
- `ArticleLayout`
- `ResponsiveImage`
- `Breadcrumbs`
- `Footer`

Avoid:
- Giant components doing everything
- Repeated markup
- Hardcoded content inside reusable components
- Styling that only works for one page

Keep content/data separate from presentation when the framework supports it.

---

# 28. Design Tokens

Centralize recurring design values.

Example:

```css
:root {
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --radius-md: 0.75rem;
  --content-width: 1200px;
}
```

Use project-specific naming and values.

This makes global redesigns much easier.

---

# 29. Error, Empty, Loading, and Success States

Every interactive feature should consider its non-happy paths.

Design:
- Loading
- Empty
- Error
- Success
- Disabled
- Offline/network failure where relevant

Make these states responsive too.

Do not let a long error message break a mobile layout.

---

# 30. Forms

Forms must be especially usable on mobile.

Use:
- Full-width inputs where appropriate
- Adequate input height
- Clear labels
- Helpful errors
- Appropriate keyboard types
- Logical grouping
- Autocomplete
- Accessible validation

Do not force users to pinch-zoom into tiny form controls.

---

# 31. Modals, Drawers, Dropdowns

These components need special attention.

Ensure:
- They fit small screens
- They do not overflow the viewport
- Background interaction is controlled appropriately
- Focus is managed correctly
- Escape closes dismissible dialogs where appropriate
- Close controls are obvious
- Content remains scrollable when necessary

On mobile, a desktop-style tiny centered modal may be inferior to a bottom sheet or full-width panel depending on the interaction.

---

# 32. Accessibility + Responsive Zoom

Do not break layouts when users zoom.

Check:
- 200% browser zoom
- Increased text size
- Keyboard-only use
- Focus visibility
- Reflow at narrow widths

Avoid absolute positioning for essential content when normal flow can solve the problem.

---

# 33. Testing Workflow

Before declaring a page complete:

### Structural test
- Does every section have a clear purpose?
- Is semantic HTML correct?
- Are components reusable?

### Mobile test
- Small phone
- Large phone
- Portrait
- Landscape
- Touch interaction

### Tablet test
- Portrait
- Landscape
- Grid transitions

### Desktop test
- Laptop width
- Desktop width
- Large display

### Interaction test
- Mouse
- Touch
- Keyboard
- Focus
- Menus
- Forms
- Modals
- Dropdowns

### Content stress test
Test with:
- Very long title
- Very short title
- Long paragraph
- Long button label
- Missing image
- Huge image
- Multiple cards
- Empty state
- Error state

### Technical test
Check:
- Horizontal overflow
- Broken images
- Console errors
- Network failures
- Layout shifts
- Slow loading
- Accessibility issues
- SEO metadata

---

# 34. Responsive QA Checklist

Before shipping, verify:

- [ ] No unintended horizontal scrolling
- [ ] No clipped text
- [ ] No overlapping components
- [ ] Images scale correctly
- [ ] Images do not distort
- [ ] Image dimensions reduce layout shifts
- [ ] Navigation works on mobile
- [ ] Menu can be opened and closed
- [ ] Buttons are easy to tap
- [ ] Links are easy to tap
- [ ] Focus states are visible
- [ ] Keyboard navigation works
- [ ] Text remains readable
- [ ] Headings wrap naturally
- [ ] Tables have a mobile strategy
- [ ] Cards reflow correctly
- [ ] Forms work with mobile keyboards
- [ ] Modals fit the viewport
- [ ] Sticky elements do not cover content
- [ ] Footer works on mobile
- [ ] Large screens do not create excessive empty space
- [ ] Very wide screens have sensible max-widths
- [ ] Orientation changes do not break layout
- [ ] Browser zoom does not destroy the page
- [ ] Reduced motion is respected
- [ ] Loading/error/empty states work
- [ ] Performance is acceptable
- [ ] SEO-critical content remains accessible

---

# 35. Common Anti-Patterns to Avoid

Never blindly:
- Build desktop first and squeeze it into mobile
- Use fixed pixel widths everywhere
- Use `width: 100vw` when it creates scrollbar problems
- Hide essential content on mobile
- Depend on hover for essential functionality
- Use divs instead of semantic controls
- Use JavaScript for CSS-only responsiveness
- Load massive desktop images on mobile
- Make every section full viewport height
- Use excessive sticky/fixed UI
- Make buttons tiny
- Use placeholder text as the only label
- Create inaccessible custom controls
- Add dozens of breakpoints without need
- Copy the same CSS across many pages
- Use arbitrary negative margins to repair layout problems
- Patch symptoms instead of fixing the underlying layout system

---

# 36. When Building a New Page

Follow this sequence:

1. Understand the page purpose.
2. Identify primary and secondary content.
3. Define the information hierarchy.
4. Identify reusable components.
5. Establish the container and spacing system.
6. Build semantic HTML structure.
7. Implement the mobile layout.
8. Add tablet behavior where needed.
9. Add laptop/desktop enhancements.
10. Implement responsive typography.
11. Implement responsive images.
12. Implement interaction states.
13. Add accessibility behavior.
14. Add loading/error/empty states if applicable.
15. Optimize performance.
16. Verify SEO requirements.
17. Test across viewport sizes.
18. Stress-test with realistic content.
19. Fix underlying layout issues rather than adding hacks.
20. Perform the final QA checklist.

---

# 37. When Editing an Existing Page

Do not rewrite the entire page automatically.

First identify:
- Current layout problems
- Mobile problems
- Desktop problems
- Component duplication
- Accessibility issues
- Performance issues
- Navigation issues
- Image issues
- Typography issues
- Overflow issues
- Broken states

Then prioritize fixes by user impact.

Preserve working functionality unless there is a reason to change it.

---

# 38. Output Behavior for AI-Assisted Development

When asked to create or improve a website/page, reason through:

### A. Page requirements
What does the page need to accomplish?

### B. Responsive plan
How will the layout behave at:
- Small mobile
- Large mobile
- Tablet
- Laptop
- Desktop
- Large desktop

### C. Component plan
Which components should be reusable?

### D. Content plan
What content is required and how should it flow?

### E. Interaction plan
How do navigation, buttons, forms, menus, cards, and dialogs behave?

### F. Accessibility plan
How will keyboard, touch, screen readers, focus, contrast, and reduced motion work?

### G. Performance plan
How will images, fonts, JavaScript, CSS, and third-party resources be handled?

### H. QA plan
What edge cases and viewport sizes need testing?

Do not produce a visually impressive desktop page that fails on mobile.

---

# 39. Technology-Agnostic Rule

This skill applies whether the project uses:
- Plain HTML/CSS/JavaScript
- React
- Next.js
- Vue
- Svelte
- Astro
- Other modern frameworks

Follow the conventions of the chosen stack.

Do not introduce a framework merely because it is familiar.

When a framework provides built-in image optimization, routing, code splitting, or accessibility utilities, use them appropriately rather than recreating them unnecessarily.

---

# 40. Final Quality Standard

A page is not finished merely because it looks good at one screen size.

A finished page should:

**Look good → reflow correctly → remain usable → remain accessible → load efficiently → preserve content → behave correctly → survive real-world content.**

The strongest responsive implementation is usually the one with the simplest underlying layout system and the fewest special-case hacks.

## Golden Rule

**Build once for the web, not separately for “mobile,” “tablet,” and “desktop.”**

Use fluid layouts, semantic structure, responsive media, accessible interaction, progressive enhancement, and sensible constraints so the same page naturally adapts to the device being used.
