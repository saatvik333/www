---
title: "what-you-reveal"
description: "a privacy analysis tool designed to show exactly what information your browser exposes to websites"
date: "2026-02-07"
github: "https://github.com/saatvik333/what-you-reveal"
site: "https://what-you-reveal.vercel.app"
tags: ["browser-fingerprinting", "privacy", "security", "javascript", "vue.js", "web-dev", "ip-checker", "vulnerability-assessment"]
stack: ["vue.js", "vite", "bun", "javascript", "html", "css"]
---

a minimalistic yet powerful privacy mirror that demonstrates exactly what information your browser exposes to the web. from hardware specifications to unique digital fingerprints, it reveals the invisible trail you leave behind on every site you visit.

## ideation

i had a shower thought 

> _"when i click on a website url, how much information can it get about me without me giving any other permissions or accepting cookies?"_

we often browse the web assuming a level of anonymity that simply doesn't exist. while modern 
browsers have improved privacy protections, the combination of hardware queries, api capabilities, and network information can still create a unique profile for every user.

the goal of this project was to visualize this data in a clean, accessible way—showing users not just technical details, but the reality of browser fingerprinting. it serves as both an educational tool and a system diagnostic utility.

## implementation

the application is built with **vue.js**, leveraging its reactive system to query and display browser data in real-time. it avoids heavy backend processing, relying almost entirely on client-side apis to gather information directly from the user's browser environment.

it utilizes the **navigator api** for hardware concurrency and device memory, **webgl** to expose gpu renderer information, and **webrtc** to detect local ip leakage. complex fingerprinting techniques, such as canvas and audio context fingerprinting, are implemented to generate unique identifiers based on how the browser renders specific data.

## key features

- **comprehensive fingerprinting**: analyzes canvas, verified audio, and font rendering to generate unique device hashes.
- **hardware exposure**: detects cpu threads, memory, battery status, and gpu renderer details.
- **network analysis**: reveals public ip, isp, location, and webrtc leaks.
- **privacy score**: calculates a privacy rating based on exposed data and enabled protections.
- **clean ui**: presents complex technical data in a simple, readable format.

## usage

visit the live site to see your own digital footprint:

[https://what-you-reveal.vercel.app](https://what-you-reveal.vercel.app)
