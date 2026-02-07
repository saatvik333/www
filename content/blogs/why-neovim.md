---
title: "why i chose neovim (and never looked back)"
description: "after years of switching between editors, i finally found my home in neovim. here's why it works for me and how it changed the way i think about text editing."
date: "2026-02-07"
pinned: false
---

i've used a lot of text editors.  vs code, sublime text, atom, helix, zed, jetbrains ides—the list goes on. each one promised to be the last editor i'd ever need. none of them were. then i saw this guy controlling everything and writing code like a 10x developer and that's how I discovered neovim, and something clicked.

this isn't a post telling you that neovim is objectively better than vs code or that you're doing it wrong if you don't use modal editing. it's about why neovim works for _me_ and the perspective shift that came with adopting it.

## the problem with modern editors

let me be clear: vs code is excellent. it's free, extensible, and works out of the box for almost any language. for most developers, it's the right choice.

but i kept running into the same friction:

1. **resource consumption**: electron isn't light. with a few extensions and a large project, vs code would regularly consume 1-2 gb of ram. me having a potato lappy it's fans would spin up during routine tasks.

2. **the mouse dependency**: point, click, drag. my hands constantly left the keyboard. it sounds minor, but those micro-interruptions add up.

3. **configuration sprawl**: settings.json, extensions, workspaces—managing my editor configuration felt like its own project.

4. **that nagging feeling**: i was using maybe 10% of what these editors offered. all those features created cognitive overhead, even if i wasn't actively using them.

i wanted something lighter. something i could understand completely. something that would meet me where i was and grow with me.

## discovering vim (and bouncing off)

i'd tried vim before. multiple times, actually. each attempt followed the same pattern: struggle through the basics, build some muscle memory, then abandon it when i needed to be productive _right now_.

the problem wasn't vim itself—it was my approach. i was trying to replicate my existing workflow in vim rather than adapting to a new paradigm. of course it felt slower; i was fighting the tool instead of learning from it.

the breakthrough came when i stopped trying to make vim work like vs code and started learning _why_ vim works the way it does.

## modal editing: the paradigm shift

normal editors are always in "insert mode." you type, and characters appear. simple.

vim (and neovim) are different. you spend most of your time in **normal mode**, where keys execute commands instead of inserting text. you enter **insert mode** only when you're actively typing new content.

at first, this seems backwards. but think about what coding actually involves:

- reading and navigating code
- deleting and modifying existing code
- copying and moving blocks
- searching and replacing

typing new code is a small fraction of the work. modal editing optimizes for the reality of what developers actually do.

### the language of vim

vim commands follow a grammar: **verb + modifier + object**.

- `d` is delete (verb)
- `i` means "inside" (modifier)
- `w` means "word" (object)

so `diw` means "delete inside word." want to change the contents of a string? `ci"` — change inside quotes. delete until the next parenthesis? `dt)` — delete to close paren.

once this grammar clicks, you stop memorizing keybindings and start _composing_ actions. it's the difference between remembering menu paths and speaking a language.

```txt
daw  - delete a word (including whitespace)
ci(  - change inside parentheses
yap  - yank (copy) a paragraph
>g   - indent from cursor to end of file
guiw - uppercase inside word
```

## why neovim over vim

vim is the original. neovim is a fork that started in 2014 with a specific goal: modernize the codebase while maintaining compatibility.

the practical differences:

1. **lua configuration**: vim uses vimscript, a domain-specific language that's... quirky. neovim embraces lua, a proper programming language. your config becomes readable, maintainable code.

2. **built-in lsp support**: language server protocol integration out of the box. no hacky workarounds—actual ide features with minimal setup.

3. **better terminal integration**: neovim's terminal emulator is more capable, which matters when your workflow involves running commands constantly.

4. **active development**: the neovim community moves fast. new features, better apis, more plugins.

5. **async by default**: neovim was built with asynchronous operations in mind, so plugins don't block the ui.

![neovim gigachad](/images/blog/why-neovim/nvim-gigachad.jpg)

## my configuration philosophy

when i started with neovim, i made the mistake of copying someone's 1000-line config. it was impressive, but i had no idea what half of it did.

now i follow a different approach:

1. **start minimal**: begin with an empty config and add only what you need.
2. **understand everything**: if a line is in my config, i can explain what it does.
3. **add friction**: when i feel the need for a feature, i live without it for a week. often, i find a built-in solution or realize i don't need it.

my config is about 300 lines of lua (plus plugin configs). it's not minimal enough for purists or fancy enough for rice enthusiasts, but it's _mine_. i understand every piece.

### essential plugins

i keep my plugin list short:

- **lazy.nvim**: plugin manager that lazy-loads everything. fast startup.
- **telescope.nvim**: fuzzy finder for files, buffers, grep, anything.
- **nvim-treesitter**: better syntax highlighting and text objects.
- **nvim-lspconfig**: connects to language servers for autocompletion, go-to-definition, etc.
- **nvim-cmp**: completion engine.
- **gitsigns.nvim**: git integration in the sign column.

that's the core. a few more quality-of-life additions, but nothing i couldn't live without.

## the learning curve is real

i won't pretend the transition was painless. for the first month, i was slower. every task required thought. i had to resist the urge to switch back to vs code "just for this one project."

but here's what i noticed: the friction was _useful_. it forced me to be intentional about my actions. instead of reaching for the mouse thoughtlessly, i had to consider the most efficient way to accomplish a task.

after about six weeks, something shifted. the keybindings became automatic. i stopped thinking about _how_ to edit and focused on _what_ to edit. my hands rarely left the home row.

and my editor startup time? instant. no splash screens, no loading indicators. just a cursor, ready to work.

## beyond efficiency

the efficiency gains are real, but they're not why i stayed. what keeps me in neovim is the relationship i have with my tools.

i _understand_ my editor now. when something doesn't work, i can debug it. when i want a new feature, i can implement it. the editor is not a black box i consume but a tool i actively shape.

there's also a mindfulness aspect. without a mouse, without infinite menus, i'm more present in my work. fewer distractions, fewer context switches. just me, the code, and a blinking cursor.

## should you switch?

maybe. maybe not.

if you're happy with your current editor and productive in it, there's no need to change. the best tool is the one you know.

but if you've ever felt that friction i described—the resource consumption, the mouse dependency, the nagging feeling that there's a better way—neovim might be worth exploring.

start with `vimtutor`. it's built-in and covers the fundamentals in 30 minutes. try it for a week, just for small edits. see if the paradigm resonates.

some people bounce off immediately and never come back. others, like me, find a home. there's no wrong answer—only what works for you.

## resources that helped me

- `:help` — neovim's built-in documentation is excellent. seriously, `help` is your friend.
- [practical vim](https://pragprog.com/titles/dnvim2/practical-vim-second-edition/) by drew neil — the book that made vim click for me.
- [theprimeagen's youtube](https://www.youtube.com/@theprimeagen) — energetic and practical neovim content.
- [kickstart.nvim](https://github.com/nvim-lua/kickstart.nvim) — a sensible starting point if you want to learn by example.
- [neovim subreddit](https://www.reddit.com/r/neovim/) — active community, helpful people.

the journey from "why would anyone use this" to "i can't imagine using anything else" is shorter than you'd think. for me, it started with curiosity and became conviction.

neovim isn't for everyone. but if you're the kind of person who wants to understand your tools deeply, who values efficiency without sacrificing power, and who appreciates software that gets out of your way—give it a shot.

you might never look back.
