# `@haneoka/vega-shell-default`

`@haneoka/vega-shell-default` is Vega's framework-neutral game shell. It adds
an accessible title screen, menu, save/load slots, settings, backlog, gallery,
flowchart, color-mode controls, and a game toolbar. It consumes the
`VEGA_SHELL_CONTROLLER` service created by Vega for each player.

## Build from source

The package uses the unpublished `@haneoka/vega` peer. Build it from a local
Git workspace:

```sh
mkdir vega-shell-workspace
cd vega-shell-workspace
git clone https://github.com/haneoka-gakuen/vega.git packages/vega
git clone https://github.com/haneoka-gakuen/vega-shell-default.git packages/vega-shell-default
```

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - packages/vega
  - packages/vega/packages/*
  - packages/vega-shell-default
linkWorkspacePackages: true
```

Install and build:

```sh
corepack enable
corepack prepare pnpm@11.14.0 --activate
pnpm install
pnpm --filter @haneoka/vega build:core
pnpm --filter @haneoka/vega-shell-default check
```

The package requires Node 20 or newer.

## Smallest complete shell

Pass `vegaDefaultShell` to a Vega engine, then pass shell options to
`createPlayer()`. A UI-slot contribution that requires `VEGA_SHELL_CONTROLLER`
causes Vega to create the controller automatically.

```ts
import { VegaEngine } from "@haneoka/vega/engine";
import { VEGA_ADV_OPCODE } from "@haneoka/vega-protocol/opcodes";
import { vegaDefaultShell } from "@haneoka/vega-shell-default";

const mount = document.querySelector<HTMLElement>("#player");
if (!mount) throw new Error("Add <div id=\"player\"></div> to the page");

const story = {
  vegaProject: { id: "shell-demo", title: "Shell demo" },
  commands: [
    {
      command: VEGA_ADV_OPCODE.Talk,
      targetName: "Guide",
      text: "Open the menu to inspect settings and saves.",
      noWait: true
    }
  ]
};
const engine = new VegaEngine({ plugins: [vegaDefaultShell] });
const handle = await engine.createPlayer({
  mount,
  story,
  shell: {
    projectId: "shell-demo",
    title: "Shell demo",
    initialScreen: "title"
  }
});

const shell = handle.shell;
if (!shell) throw new Error("The default shell did not install");
await shell.start();
console.log(shell.snapshot().screen, shell.snapshot().settings);

await handle.dispose();
await engine.dispose();
```

`shell.start()` resets the narrative position, enters the game screen, applies
settings, and starts player playback. `shell.open("settings")`,
`shell.save("manual-1", "Opening")`, `shell.load("manual-1")`, `shell.quickSave()`,
`shell.quickLoad()`, `shell.toggleAuto()`, and `shell.toggleFastForward()` are
the public navigation and control methods. Subscribe to `shell.subscribe()` to
render an application-owned status surface from `VegaShellSnapshot`.

## Storage and customization

The shell uses `VegaMemorySaveStorage` when no storage is supplied. Browser
players created by Vega use local storage when available; pass an explicit
`VegaSaveStorage` to persist in IndexedDB, a native filesystem, or a server:

```ts
const handle = await engine.createPlayer({
  mount,
  story,
  shell: {
    storage: mySaveStorage,
    projectId: "licensed-release-2026",
    settingsId: "player-settings",
    initialSettings: {
      language: "en",
      uiLanguage: "en",
      reducedMotion: false
    }
  }
});
```

The controller serializes save data with project id, command position, choice
records, narrative state, stage snapshot, audio snapshot, and optional preview
image. The renderer owns stage capture; the shell stores the resulting data.
Provide `onExitRequest` when the host wants a title-screen exit action to call a
desktop or mobile navigation layer.

## Roles and lifetime

Vega owns command execution and the controller service. This package owns the
DOM shell and toolbar UI. A theme can replace the shell's theme contribution or
toolbar slot, while a host can provide `VEGA_SHELL_CONTROLLER` directly through
player services. The shell never selects a renderer or audio device.

Dispose the returned `VegaPlayerHandle` to remove shell DOM, save observers,
execution observers, and player resources. Engine disposal removes the plugin
and any remaining controllers. A host-owned `VegaSaveStorage` remains owned by
the host and should be closed by the host.

## License

The package is available under [MPL-2.0](LICENSE). Preserve
[NOTICE.md](NOTICE.md) and the attribution terms of any renderer, font, icon,
or game asset used by the application.
