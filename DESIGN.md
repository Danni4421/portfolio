# Portfolio Design Strategy & System

This document outlines the core design philosophy, visual language, and component architecture for the portfolio application.

## 1. Typography

The typographic hierarchy is designed to evoke a refined, editorial, and intellectual aesthetic—heavily inspired by the Claude (Anthropic) interface.

### Primary Font: **EB Garamond** (Serif)

Used for headings, brand identity, and long-form narrative content to provide an elegant, readable experience.

- **H1**: `3rem` (48px) / Line Height: `1.1` / Letter Spacing: `-0.02em`
- **H2**: `2.25rem` (36px) / Line Height: `1.2` / Letter Spacing: `-0.01em`
- **H3**: `1.5rem` (24px) / Line Height: `1.3` / Letter Spacing: Normal
- **H4**: `1.25rem` (20px) / Line Height: `1.4` / Letter Spacing: Normal
- **Body / Paragraphs**: `1rem` (16px) / Line Height: `1.6` (160%) / Letter Spacing: Normal

### Secondary Font: **Urbanist** (Sans-Serif)

Used for utility text, badges, input fields, and technical UI elements to maintain a clean and modern interface structure alongside the editorial serif.

## 2. Color Palette & Theming

The application fully supports dynamic Light and Dark modes via CSS variables, ensuring high contrast and accessibility.

- **Backgrounds**: Deep, rich contrast. Pure white (`#ffffff`) or subtle off-whites for light mode; near-black (`#0a0a0a` / `zinc-900`) for dark mode.
- **Foreground (Text)**: Muted grays for secondary text (`gray-700` in light, `gray-400` in dark), transitioning to high-contrast black/white for primary headings.
- **Accent Color**: **Vibrant Orange (`#ff5c06`)**. Used sparingly for high-emphasis call-to-actions to draw the eye immediately against the neutral backdrop.

## 3. Interactive Elements

### Primary Action (The "Hire Me" Button)

A highly tactile, premium design implemented natively in the `default` variant of the `Button` component.

- **Background**: `#ff5c06`
- **Typography**: White, Semibold
- **Shape**: Highly rounded (`rounded-2xl` ~ 16px radius)
- **Depth & Texture**: Complex inset shadowing (`shadow-[0_6px_10px_rgba(255,255,255,0.5)_inset,-10px_40px_41px_-4px_rgba(0,0,0,0.01)]`) simulating a physical 3D button.
- **Interaction**: Fast, smooth opacity transition (`hover:opacity-90`) backed by hardware acceleration (`will-change-transform`).

### Navigation & Links

- Text links default to slightly muted colors (`text-gray-700`) to avoid overwhelming the visual hierarchy.
- On hover, they snap to full contrast (`text-black` or `text-white`) accompanied by a subtle underline effect to indicate interactivity.

## 4. Spatial Layout & Backgrounds

- **Responsive Grid Padding**: `px-4` (Mobile) -> `px-16` (Tablet) -> `px-24` (Desktop) to ensure content never stretches uncomfortably wide.
- **Tetris Grid Background**: The global background features a subtle, dynamic grid texture. On mouse movement, cells exhibit a localized "glow" or ripple effect, providing an alive, interactive feeling without distracting from the core content.

## 5. Motion & Animation

- **Smooth Scrolling**: Implemented globally (`scroll-behavior: smooth`) for seamless anchor navigation.
- **Infinite Marquee**: The Tech Stack section utilizes a pure CSS horizontal marquee (`animate-scroll`) that pauses smoothly on hover (`hover:[animation-play-state:paused]`), allowing users to inspect the icons.
- **Loaders**: Immediate HTML/CSS loaders prevent the "White Flash" during the JavaScript bundle evaluation phase, providing instant user feedback.

## 6. Architecture (Feature Sliced Design)

The codebase is structured following Feature Sliced Design (FSD) principles to maintain a clean separation of concerns:

- **`app/`**: Global providers, CSS, and routing entry points.
- **`pages/`**: Routable page components (e.g., `home`, `project-detail`).
- **`widgets/`**: Standalone, composite layout blocks (e.g., `Header`, `ProjectList`, `ContactForm`).
- **`entities/`**: Business logic, API layers (using `Effect-TS`), and UI models for core domains (e.g., `achievement`, `project`, `tech-stack`).
- **`shared/`**: Reusable agnostic pieces (UI kit, utility functions, Supabase client).

_(Note: Data interactions are strictly managed via `Effect` from `effect.website` to guarantee robust error handling and type safety across network boundaries.)_
