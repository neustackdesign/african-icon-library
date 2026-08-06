/**
 * UI thread.
 *
 * Runs in a sandboxed iframe with no network access. It holds no data of its
 * own: everything it shows — icon count, drawn weights, whether this file has
 * been built before — is reported by the sandbox thread, which is the only side
 * that can see the document.
 */

import type { PluginMessage, UiMessage } from './messages';

function send(message: UiMessage): void {
  parent.postMessage({ pluginMessage: message }, '*');
}

/**
 * Looks up an element the UI shell guarantees exists. The `_tag` argument names
 * the expected type at each call site; a missing node is a mistake in
 * `ui.html`, not a runtime condition worth recovering from.
 */
function element<K extends keyof HTMLElementTagNameMap>(
  id: string,
  _tag: K,
): HTMLElementTagNameMap[K] {
  const node = document.getElementById(id);
  if (!node) throw new Error(`missing element #${id}`);
  return node as HTMLElementTagNameMap[K];
}

const lede = element('lede', 'p');
const existing = element('existing', 'section');
const buildButton = element('build', 'button');
const rebuildButton = element('rebuild', 'button');
const progress = element('progress', 'section');
const progressBar = element('progress-bar', 'div');
const progressLabel = element('progress-label', 'div');
const summary = element('summary', 'section');
const summaryFigures = element('summary-figures', 'dl');
const summaryNotes = element('summary-notes', 'ul');
const statusBar = element('status', 'div');

function setStatus(text: string, level: 'info' | 'error'): void {
  statusBar.textContent = text;
  statusBar.dataset.level = level;
}

function setBusy(busy: boolean): void {
  buildButton.disabled = busy;
  rebuildButton.disabled = busy;
}

function figure(term: string, value: string): void {
  const dt = document.createElement('dt');
  dt.textContent = term;
  const dd = document.createElement('dd');
  dd.textContent = value;
  summaryFigures.append(dt, dd);
}

function reportHeight(): void {
  send({ type: 'resize', height: Math.ceil(document.documentElement.scrollHeight) + 8 });
}

buildButton.addEventListener('click', () => {
  setBusy(true);
  progress.hidden = false;
  summary.hidden = true;
  send({ type: 'build', mode: 'fresh' });
});

rebuildButton.addEventListener('click', () => {
  setBusy(true);
  progress.hidden = false;
  summary.hidden = true;
  send({ type: 'build', mode: 'rebuild' });
});

window.addEventListener('message', (event: MessageEvent) => {
  const message = (event.data as { pluginMessage?: PluginMessage } | null)?.pluginMessage;
  if (!message) return;

  switch (message.type) {
    case 'state': {
      const weights = message.weights.length > 0 ? message.weights.join(', ') : 'none';
      lede.textContent = `${message.icons} released icons · ${weights} drawn. One click builds every page, component and Community frame.`;

      if (message.existingBuild) {
        existing.hidden = false;
        existing.textContent =
          `This file already contains a build (version ${message.existingBuild.version}, ` +
          `${message.existingBuild.pages} pages, ${message.existingBuild.builtAt}). ` +
          'Rebuilding removes those pages first so nothing is duplicated.';
        rebuildButton.hidden = false;
        buildButton.disabled = true;
      } else {
        existing.hidden = true;
        rebuildButton.hidden = true;
        buildButton.disabled = false;
      }
      setBusy(false);
      reportHeight();
      return;
    }

    case 'progress': {
      progress.hidden = false;
      const percent = message.total > 0 ? Math.round((message.done / message.total) * 100) : 0;
      progressBar.style.width = `${percent}%`;
      progressLabel.textContent = `${message.done} of ${message.total} — ${message.label}`;
      reportHeight();
      return;
    }

    case 'summary': {
      summary.hidden = false;
      summaryFigures.replaceChildren();
      figure('Pages created', String(message.pages));
      figure('Components created', String(message.components));
      figure('Icons placed', String(message.instances));

      summaryNotes.replaceChildren();
      for (const note of message.notes) {
        const item = document.createElement('li');
        item.textContent = note;
        summaryNotes.append(item);
      }
      reportHeight();
      return;
    }

    case 'status':
      setStatus(message.text, message.level);
      if (message.level === 'error') setBusy(false);
      reportHeight();
      return;
  }
});

send({ type: 'ready' });
reportHeight();
