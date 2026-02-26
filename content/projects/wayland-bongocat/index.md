---
title: "wayland-bongocat"
description: "a lightweight wayland overlay that displays an animated bongo cat reacting to real-time keyboard input."
date: "2025-8-12"
github: "https://github.com/saatvik333/wayland-bongocat"
site: "https://aur.archlinux.org/packages/bongocat"
tags: ["wayland", "c", "linux", "overlay"]
stack: ["c/c++", "wayland", "cairo", "layer-shell", "inotify", "make"]
---

A highly optimized, compositor-agnostic Wayland overlay written entirely in C. It renders an animated, customizable "Bongo Cat" companion that reacts synchronously to real-time keyboard input.

## The Engineering Challenge

While Linux desktops boast incredible customization depth, most "desktop pet" or overlay applications rely heavily on bloated frameworks (like Electron) or legacy X11 APIs that simply do not operate correctly within the modern Wayland ecosystem.

The core engineering objective of this project was to construct a purely aesthetic companion that interacts natively with modern Wayland compositors, remains entirely invisible to window focus management, and introduces effectively zero performance overhead to the host system. The emphasis was strictly maintained on architectural simplicity, memory safety, and native protocols over feature bloat.

## Implementation Details

The application is written strictly in **C** to guarantee a microscopic binary footprint and highly predictable resource utilization. It establishes a completely non-interactive overlay leveraging both the **Wayland Layer-Shell** protocol and the **Wayland Top-Level Management** protocol. This specific combination guarantees the overlay floats persistently above standard windows without ever stealing input focus or aggressively trapping the mouse.

To achieve imperceptible latency, keyboard activity is intercepted by reading raw input events directly from `/dev/input`, completely bypassing compositor-specific APIs. The visual rendering pipeline utilizes **Cairo**, providing crisp, scalable 2D outputs that redraw only precisely when an input event alters the animation state.

Furthermore, runtime configuration is hot-reloadable. The daemon utilizes `inotify` to monitor its config files, allowing users to make live, zero-downtime adjustments to the overlay's size, screen position, and behavioral parameters without ever restarting the host process.

## Capabilities

- **Native Integration:** Pure Wayland **Layer-Shell** overlay (strictly no XWayland or heavy web-view dependencies).
- **Synchronous Input:** Real-time animation logic driven by low-level kernel input events.
- **Dynamic Configuration:** Non-blocking `inotify` hooks for hot-reloading visual configurations.
- **Context Aware:** Automatic visibility toggling when fullscreen applications are detected.
- **Scalable Architecture:** Built-in multi-monitor routing and per-output coordinate support.
- **Micro-Footprint:** Extremely frugal resource allocation (typically idling at **~8 MB** RAM).

## Installation

```bash
# Arch Linux (Via AUR Helper)
yay -S bongocat

# Compilation from Source
git clone https://github.com/saatvik333/wayland-bongocat.git
cd wayland-bongocat
make
```

## System Utilities

The repository ships with an integrated CLI helper tool (`bongocat-find-devices`) engineered to automatically locate and bind the correct kernel keyboard input device descriptor.

```bash
# Automated heuristic device binding
bongocat-find-devices

# Manual interactive selection mode
bongocat-find-devices -i
```
