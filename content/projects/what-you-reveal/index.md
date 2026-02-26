---
title: "what-you-reveal"
description: "a privacy analysis tool designed to show exactly what information your browser exposes to websites"
date: "2026-02-07"
github: "https://github.com/saatvik333/what-you-reveal"
site: "https://what-you-reveal.vercel.app"
tags: ["browser-fingerprinting", "privacy", "security", "javascript", "vue.js", "web-dev", "ip-checker", "vulnerability-assessment"]
stack: ["vue.js", "vite", "bun", "javascript", "html", "css"]
---

An aggressive privacy mirror and diagnostic utility engineered to demonstrate exactly how much identifiable information your browser implicitly exposes to the web at large. From hardware specifications down to unique rendering artifacts, it visualizes the invisible data trail you leave behind on every single request.

## The Privacy Paradigm

The foundational question behind this project was simple: _"When I click a plain URL, exactly how much telemetry can the host extract before I ever consent to a cookie banner or grant an API permission?"_

Users generally operate under the assumption of baseline anonymity that simply does not exist in modern web architecture. While contemporary browsers have iteratively improved their privacy sandboxing, the complex intersection of hardware queries, standard Web APIs, and network header diagnostics can still be weaponized to generate a highly unique, persistent profile for nearly every user.

The engineering goal of `what-you-reveal` was to demystify this data extraction. It required building a clean, accessible interface that surfaces these highly technical diagnostics, serving simultaneously as a stark educational demonstration and a functional system privacy validator.

## Technical Architecture

The core application is constructed entirely in **Vue.js**, deliberately leveraging its reactive virtual DOM to query and display complex diagnostic data streams in real-time. Critically, the architecture completely eschews heavy backend processing; it relies almost exclusively on disparate client-side APIs to aggressively mine information directly from the user's local browser environment.

The codebase interrogates the **Navigator API** to expose hardware concurrency thread counts and raw device memory capabilities. It probes underlying **WebGL** implementations to extract highly specific GPU renderer telemetry, and executes targeted **WebRTC** connections specifically designed to detect local (STUN/TURN) IP address leaks bypassing standard proxies. 

Furthermore, the engine implements advanced browser fingerprinting techniques—including hidden Canvas drawing algorithms and AudioContext oscillator tests—to autonomously generate unique cryptographic identifiers based uniquely on microscopic variations in how the host machine calculates and renders specific data types.

## Diagnostic Capabilities

- **Deep Fingerprinting:** Analyzes hidden Canvas manipulation, verified AudioContext wave generation, and local font rendering metrics to output highly unique device hashes.
- **Hardware Telemetry:** Accurately detects CPU logical threads, memory caps, real-time battery status hooks, and unmasked GPU vendor/renderer details.
- **Network Penetration:** Surfaces public IP routing, ISP resolution, geo-location approximation, and internal WebRTC leak vulnerabilities.
- **Heuristic Scoring:** Calculates an aggregate privacy rating based on the severity of exposed data vectors combined with the presence of active browser protections.
- **Accessible Insights:** Translates complex JSON blobs and API outputs into a highly readable, structured UI format.

## Live Application

You can execute the diagnostic suite directly against your own browser environment here:

[https://what-you-reveal.vercel.app](https://what-you-reveal.vercel.app)
