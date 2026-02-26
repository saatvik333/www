---
title: "niri-dotfiles"
description: "a productive, modular niri wayland configuration with dynamic theming and workflow automation."
date: "2025-12-24"
github: "https://github.com/saatvik333/niri-dotfiles"
tags: ["niri", "dotfiles", "linux", "wayland", "shell"]
stack: ["niri", "bash", "waybar", "fish", "rust", "alacritty", "wayland", "gtk", "neovim", "rofi", "mako", "wallust"]
---

A fully featured, highly modular, and aesthetically tuned configuration repository for Niri, the scrollable tiling Wayland window manager.

## The Paradigm Shift

After extensively daily-driving Hyprland, I migrated my primary workspace to **Niri**. Written in Rust, Niri introduces a uniquely compelling infinite horizontal workspace model that fundamentally reimagines traditional tiling window management workflows.

However, moving to a new compositor meant rebuilding my environment from scratch. **niri-dotfiles** was engineered to solve this. I centralized all the essential components—ranging from core system utilities to visual theming, customized keybindings, and application-specific configurations—into a single, reproducible architecture. 

The core engineering objective was clear: drastically reduce the repetitive friction of setting up fresh machines, unify the appearance and behavior across the entire system, and leverage heavy automation to support dynamic theme adaptation and power-user workflow enhancements.

## Implementation Details

This repository is more than just a collection of config files; it's a bootstrapped environment. Installation is driven by a custom shell script that immediately provisions an Arch-based system with the mandatory packages and deploys the dotfiles gracefully.

Key architectural pillars of the setup include:

- **Theme Orchestration:** Automated scripts handle dynamic system-side theming using `wallust` to extract color palettes directly from wallpapers, instantly pushing those color schemes down to GTK, the Waybar status bar, Alacritty/Kitty terminals, and rofi launchers.
- **Preconfigured Environment:** Out-of-the-box integrations for the `fish` shell, `mako` notification daemon, and an entirely customized Neovim setup.
- **Workflow Automation:** Modular shell scripting manages media controls, system utilities, and daily workflow helpers without bloated dependencies.
- **Niri-Optimized Binds:** A meticulous set of keyboard-centric keybinds specifically designed to exploit Niri's horizontal scrolling mechanics alongside system and media management.

The installation script itself is built with failure resilience in mind. It validates system compatibility, configures the necessary Rust toolchains, installs Niri and its dependencies, and safely symlinks the configuration directory structure.

## Setup Requirements

- Niri Wayland compositor
- Arch Linux or an Arch-based distribution (highly recommended for the automated installer)
- `wallust` (for dynamic procedural theme generation)

## Deployment

To bootstrap a fresh setup on an Arch Linux installation, simply execute the remote install script:

```bash
curl -fsSL https://raw.githubusercontent.com/saatvik333/niri-dotfiles/main/install.sh | sh
```

The installer will autonomously manage package resolution, configuration deployment, and environment sanitization.
