---
title: "wayland-bongocat"
description: "a lightweight wayland overlay that displays an animated bongo cat reacting to real-time keyboard input."
date: "2025-8-12"
github: "https://github.com/saatvik333/wayland-bongocat"
tags: ["wayland", "c", "linux", "overlay"]
stack: ["c/c++", "wayland", "cairo", "layer-shell", "inotify", "make"]
---

a cute comapanion for your desktop (^.^) i.e minimal yet customizable, native wayland overlay written in c that renders an animated bongo cat responding to real-time keyboard input. built to be compositor-agnostic, unobtrusive, and extremely lightweight.

## ideation

linux desktops offer deep customization, but most desktop overlays and pets rely on heavy frameworks or operate outside the wayland ecosystem. the goal of this project was to build a purely aesthetic companion that integrates cleanly with modern wayland compositors, remains invisible to focus management, and introduces no meaningful performance overhead.

the emphasis was on simplicity, correctness, and native protocols rather than feature bloat.

## implementation

the application is written entirely in **c** to keep the binary small and resource usage predictable. it creates a non-interactive overlay using the **wayland layer-shell protocol** and **wayland top-level management protocol**, allowing it to stay above normal windows without stealing focus.

keyboard activity is captured by reading events directly from `/dev/input`, enabling low-latency animation triggers without relying on compositor-specific apis. rendering is handled with **cairo**, providing clean, scalable 2d output.

runtime configuration is hot-reloaded using `inotify`, allowing live adjustments to size, position, and behavior without restarting the process.

## key features

- native wayland **layer-shell** overlay (no xwayland or electron)
- real-time animation driven by actual keyboard input
- hot-reloadable configuration
- automatic hiding during fullscreen applications
- multi-monitor and per-output support
- very low resource usage **(~8 mb typical)**

## installation

```bash
# using aur
yay -S bongocat

# from source
git clone https://github.com/saatvik333/wayland-bongocat.git
cd wayland-bongocat
make
```

## helper tool

includes a helper tool (`bongocat-find-devices`) to locate the correct keyboard input device.

```bash
# automated finding
bongocat-find-devices

# interactive mode
bongocat-find-devices -i
```
