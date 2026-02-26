---
title: "tabula"
description: "a minimalist and productive new-tab browser extension with widgets and customizable visuals."
date: "2025-10-12"
github: "https://github.com/saatvik333/tabula"
site: "https://addons.mozilla.org/en-US/firefox/addon/saatvik333-tabula/"
tags: ["browser extension", "typescript", "productivity", "web"]
stack: ["typescript", "vite", "github actions", "css", "bun"]
---

A minimalist new-tab browser extension rigorously designed to eliminate digital clutter while surfacing practical, productivity-oriented widgets. It transforms the default browser entry point into a highly customizable, utility-focused dashboard.

## The Problem with New Tabs

The majority of modern browser new-tab experiences prioritize raw load speed but critically lack intentional utility or modular composability. They exist either as blank white screens or overly saturated hubs pushing algorithmic content. 

Tabula was engineered to reclaim this prime digital real estate. The objective was to create a lightweight, extensible workspace that beautifully balances aesthetic minimalism with everyday utility. It needed to provide immediate access to vital tools—like a Pomodoro timer, task lists, and quick searches—without incurring the performance penalties typical of heavier dashboard extensions.

## Architecture and Engineering

The extension is architected entirely in strict **TypeScript**, utilizing modern frontend build pipelines (Vite managed via Bun) leveraging the Web Extensions API for cross-compatibility between Chromium-based browsers and Mozilla Firefox. 

It renders a pristine UI using native web components and standard HTML/CSS. Crucially, all application state is persisted directly to local browser storage. This design decision ensures total offline capability, guarantees extremely fast time-to-interactive (TTI) metrics, and fully respects user privacy by preventing data exfiltration to external servers.

Tabula ships with a modular widget ecosystem natively out of the box. This includes a uniquely styled *"clock-of-clocks"*, a persistent quick-notes pad, a Kanban-lite todo list, localized weather forecasting, a dedicated Pomodoro focus timer, and a daily motivational quote fetcher. 

The DOM is fully interactive, featuring seamless drag-and-drop layout manipulation, comprehensive keyboard navigation support, and granular visual customization handled entirely client-side. Furthermore, the repository is fitted with a fully automated CI/CD pipeline using GitHub Actions that deterministically builds, tests, and packages optimized distribution artifacts for extension marketplaces on every tagged release.

## Capabilities

- **Clock of Clocks:** A unique typographical time display supporting both 12h and 24h formats.
- **Drag-and-Drop Grid:** Fluid, physics-based layout manipulation for all modular widgets.
- **Integrated Tooling:** Built-in Pomodoro timer, task manager, localized weather, and quick-note scratchpad.
- **Privacy-First Search:** Deep integration with configurable, privacy-respecting search providers directly from the new tab.
- **Theming Engine:** Granular control over color palettes with auto-switching Light/Dark modes.
- **Performant & Private:** Near-zero performance footprint and complete offline operational capability.
- **Automated Delivery:** Robust CI/CD pipeline handling building, testing, and marketplace publishing.

## Installation & Deployment

To run the development server locally:

```bash
git clone https://github.com/saatvik333/tabula.git
cd tabula

# Utilize Bun for rapid dependency resolution and building
bun install
bun run build
```

To install as an end-user:

* **Firefox:** Install directly via the official Mozilla Add-ons store listing: [Tabula for Firefox](https://addons.mozilla.org/en-US/firefox/addon/saatvik333-tabula/).
* **Chromium (Chrome/Edge/Brave):** Navigate to `chrome://extensions`, enable "Developer Mode", and select "Load unpacked", pointing to the compiled `./dist` directory.
