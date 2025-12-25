---
title: "niri-dotfiles"
description: "a productive, modular niri wayland configuration with dynamic theming and workflow automation."
date: "2025-12-24"
github: "https://github.com/saatvik333/niri-dotfiles"
tags: ["niri", "dotfiles", "linux", "wayland", "shell"]
stack: ["niri", "bash", "waybar", "fish", "rust", "alacritty", "wayland", "gtk", "neovim", "rofi", "mako", "wallust"]
---

a comprehensive, modular configuration setup for the niri wayland window manager, designed to deliver a clean, dynamic, and highly personalized desktop environment with automated theming and productivity-oriented tooling.

## ideation

after switching from hyprland to **niri**, a scrolling tiling wayland compositor written in rust, this project was created to provide a full featured, ready-to-use desktop environment with minimal manual setup. niri’s distinctive infinite horizontal workspace model reimagines tiling workflows, and **niri-dotfiles** centralizes essential components — from system utilities to visual theming, keybindings, and application configurations — into a coherent, reproducible configuration.

the goal was to reduce repetitive setup across machines, unify appearance and behavior system-wide, and leverage automation for dynamic theme adaptation and workflow enhancements.

## implementation

this repository organizes configuration files and automation scripts for niri and associated tools. installation is automated via a script that bootstraps an arch-based system with required packages and dotfiles. core aspects include:

- **modular scripting and automation** for theme orchestration, media controls, system utilities, and workflow helpers  
- **dynamic system-wide theming** using wallust to extract palette colors from wallpapers and apply them across gtk, status bar, terminals, and applications  
- preconfigured components including shell (fish), status bar (waybar), terminals (alacritty/kitty), notification daemon (mako), and launcher (rofi)  
- keybind sets optimized for niri window and workspace management  
- reusable directory structure enabling easy version control and portability  

the install script validates system compatibility, configures a rust toolchain, installs packages (including niri, waybar, and utilities), and deploys the dotfiles to the user environment.

## key features

- clean, gapless minimal aesthetic  
- dynamic theme switching and palette extraction  
- full configuration for common desktop components  
- utility scripts for workflow automation  
- keyboard-centric keybinds for system, media, and window management  
- easily deployable via automated installer  

## requirements

- niri wayland compositor (rust-based, scrollable tiling wm)  
- arch linux or arch-based distribution (recommended for installer)  
- wallust for dynamic theme palette generation  

## installation

to bootstrap a fresh setup on arch linux or an arch-based distro:

```bash
curl -fsSL https://raw.githubusercontent.com/saatvik333/niri-dotfiles/main/install.sh | sh
```

the installer handles package installation, configuration deployment, and environment setup.
