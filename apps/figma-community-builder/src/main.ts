/**
 * Sandbox thread.
 *
 * Owns the document and the decision of whether a build may run at all. The
 * interesting work is in `builder.ts`; this file is the gate in front of it —
 * one build at a time, never on top of an existing one without being told, and
 * never a half-built document because a font was missing.
 */

import { FontLoadError, buildCommunityFile, readMarker } from './builder';
import { isUiMessage, type PluginMessage } from './messages';
import { PLUGIN_WEIGHTS, releasedIcons } from './plan';

const UI_WIDTH = 420;
const UI_MIN_HEIGHT = 460;
const UI_MAX_HEIGHT = 760;

let building = false;

function post(message: PluginMessage): void {
  figma.ui.postMessage(message);
}

function postState(): void {
  const record = readMarker();
  post({
    type: 'state',
    existingBuild: record
      ? { builtAt: record.builtAt, version: record.version, pages: record.pages.length }
      : null,
    icons: releasedIcons.length,
    weights: [...PLUGIN_WEIGHTS],
  });
}

async function run(mode: 'fresh' | 'rebuild'): Promise<void> {
  if (building) {
    post({ type: 'status', level: 'info', text: 'A build is already running.' });
    return;
  }

  if (mode === 'fresh' && readMarker()) {
    post({
      type: 'status',
      level: 'info',
      text: 'This file already contains a build. Choose “Wipe and rebuild” to replace it.',
    });
    postState();
    return;
  }

  building = true;
  post({ type: 'status', level: 'info', text: 'Building…' });

  try {
    const summary = await buildCommunityFile((done, total, label) => {
      post({ type: 'progress', done, total, label });
    });

    post({
      type: 'summary',
      pages: summary.pages,
      components: summary.components,
      instances: summary.instances,
      notes: summary.notes,
    });
    post({
      type: 'status',
      level: 'info',
      text: `Done — ${summary.pages} pages, ${summary.components} components, ${summary.instances} instances placed.`,
    });
    figma.notify(
      `Community file built: ${summary.components} components across ${summary.pages} pages.`,
    );
  } catch (error) {
    // A font failure is the one error worth naming precisely: it is recoverable
    // by the user, and it happens before any node exists, so the document is
    // exactly as they left it.
    const message =
      error instanceof FontLoadError
        ? error.message
        : `The build stopped: ${(error as Error)?.message ?? 'unknown error'}`;
    post({ type: 'status', level: 'error', text: message });
    try {
      figma.notify(message, { error: true, timeout: 8000 });
    } catch {
      /* notification refused; the UI still shows the message */
    }
  } finally {
    building = false;
    postState();
  }
}

/* ------------------------------------------------------------------ *
 * Wiring
 * ------------------------------------------------------------------ */

figma.showUI(__html__, { width: UI_WIDTH, height: UI_MIN_HEIGHT, themeColors: true });

figma.ui.onmessage = async (message: unknown): Promise<void> => {
  if (!isUiMessage(message)) return;

  switch (message.type) {
    case 'ready':
      postState();
      return;
    case 'resize': {
      const height = Math.min(UI_MAX_HEIGHT, Math.max(UI_MIN_HEIGHT, Math.round(message.height)));
      figma.ui.resize(UI_WIDTH, height);
      return;
    }
    case 'build':
      await run(message.mode);
      return;
  }
};
