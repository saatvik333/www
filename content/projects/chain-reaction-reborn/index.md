---
title: "chain-reaction-reborn"
description: "a polished, modern reimplementation of the classic atomic strategy game with minimax ai."
date: "2026-02-07"
github: "https://github.com/saatvik333/chain-reaction-reborn"
tags: ["flutter", "dart", "chain-reaction", "game-dev", "ai", "cross-platform", "strategy-game", "feature-first-architecture"]
stack: ["flutter", "dart", "riverpod", "go_router", "freezed"]
---

strategic dominance in your pocket. a definitive, cross-platform remit of the classic chain reaction strategy game, featuring a hybrid rendering engine, background-isolated ai, and a rigorous clean architecture implementation.

## ideation

while the original chain reaction concept is timeless, existing implementations suffered from atom placement bug since android 13, poor performance on high-refresh displays, lacks single-player ai, or rigid codebases that under-maintained.

the goal of this project was to engineer the _"perfect"_ version: one that pairs fluid, 120hz animations and particle effects with an underlying architecture robust enough to handle complex minimax calculations without dropping a single frame. it serves as a case study in applying enterprise-grade software engineering principles (domain-driven design) to game development.

## implementation

the application is built with **flutter** and structured around **feature-first clean architecture**, ensuring a strict separation of concerns between the presentation layer, domain logic, and data sources. this decoupling allows the game core to be tested in isolation from the ui.

state management is handled by **riverpod**, utilizing code generation for type-safe providers and dependency injection.

to maintain 60fps+ performance during massive chain reactions, the rendering pipeline is hybrid:

- **the grid**: rendered via `custompainter` to minimize widget tree overhead.
- **projectiles**: handled as efficient overlay widgets for complex bezier curves and shadow effects.

the **ai opponent** runs in a separate background isolate using dart's `compute` function. this prevents the main thread from freezing while the ai performs deep heuristic evaluations using the **minimax algorithm** with alpha-beta pruning.

## key features

- **smart ai**: from random moves to an "extreme" difficulty using depth-limited minimax.
- **hybrid rendering**: custom painters for static elements, optimized widgets for animations.
- **background processing**: heavy computation offloaded to isolates to ensure ui fluidity.
- **cross-platform**: first-class support for android, ios, windows, linux, and macos.
- **local multiplayer**: supports up to 8 players with dynamic state tracking.
- **theming system**: hot-swappable visual themes (earthy, pastel, amoled).

## installation

```bash
# clone the repository
git clone [https://github.com/saatvik333/chain-reaction-reborn.git](https://github.com/saatvik333/chain-reaction-reborn.git)
cd chain-reaction-reborn

# install dependencies
flutter pub get

# run on your preferred device
flutter run
```
