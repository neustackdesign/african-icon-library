import type { ReactNode } from 'react';

import { DOCUMENTS } from '@/generated/documents';

/**
 * A deliberately small Markdown renderer for repository documents.
 *
 * The licence, contribution guide, changelog and drawing spec live as Markdown
 * files in the repository — that is where contributors read and edit them. The
 * website renders those same files (compiled in by `npm run generate`, so the
 * app never reads outside its own directory) rather than keeping a second copy
 * that can drift, and it does so without pulling in a Markdown dependency whose
 * full feature surface — raw HTML passthrough in particular — this site does
 * not want.
 *
 * Supported: ATX headings, paragraphs, unordered and ordered lists, fenced code
 * blocks, thematic breaks, and inline code / bold / links. Anything else renders
 * as literal text, which is the safe failure.
 */

export function readRepositoryFile(relativePath: string): string | null {
  return DOCUMENTS[relativePath] ?? null;
}

/* ------------------------------------------------------------------ *
 * Inline
 * ------------------------------------------------------------------ */

const INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  INLINE.lastIndex = 0;
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${index++}`;

    if (token.startsWith('`')) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith('**')) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else {
      const separator = token.indexOf('](');
      const label = token.slice(1, separator);
      const href = token.slice(separator + 2, -1);
      const external = /^https?:\/\//.test(href);
      nodes.push(
        <a key={key} href={href} {...(external ? { rel: 'noreferrer noopener' } : {})}>
          {label}
        </a>,
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

/* ------------------------------------------------------------------ *
 * Block
 * ------------------------------------------------------------------ */

export function renderMarkdown(source: string): ReactNode[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];

  let cursor = 0;
  let key = 0;

  const nextKey = () => `md-${key++}`;

  while (cursor < lines.length) {
    const line = lines[cursor];

    if (line.trim() === '') {
      cursor += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const body: string[] = [];
      cursor += 1;
      while (cursor < lines.length && !lines[cursor].startsWith('```')) {
        body.push(lines[cursor]);
        cursor += 1;
      }
      cursor += 1;
      blocks.push(
        <pre className="code-block" key={nextKey()}>
          <code>{body.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    if (/^-{3,}$/.test(line.trim())) {
      blocks.push(<hr key={nextKey()} />);
      cursor += 1;
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const content = renderInline(heading[2], nextKey());
      const Tag = (['h1', 'h2', 'h3', 'h4'] as const)[level - 1];
      blocks.push(<Tag key={nextKey()}>{content}</Tag>);
      cursor += 1;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (cursor < lines.length && /^\s*[-*]\s+/.test(lines[cursor])) {
        items.push(lines[cursor].replace(/^\s*[-*]\s+/, ''));
        cursor += 1;
      }
      blocks.push(
        <ul key={nextKey()}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item, `${nextKey()}-${itemIndex}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (cursor < lines.length && /^\s*\d+\.\s+/.test(lines[cursor])) {
        items.push(lines[cursor].replace(/^\s*\d+\.\s+/, ''));
        cursor += 1;
      }
      blocks.push(
        <ol key={nextKey()}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item, `${nextKey()}-${itemIndex}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraph: string[] = [];
    while (
      cursor < lines.length &&
      lines[cursor].trim() !== '' &&
      !lines[cursor].startsWith('```') &&
      !/^#{1,4}\s/.test(lines[cursor]) &&
      !/^\s*[-*]\s+/.test(lines[cursor]) &&
      !/^\s*\d+\.\s+/.test(lines[cursor]) &&
      !/^-{3,}$/.test(lines[cursor].trim())
    ) {
      paragraph.push(lines[cursor]);
      cursor += 1;
    }
    blocks.push(<p key={nextKey()}>{renderInline(paragraph.join(' '), nextKey())}</p>);
  }

  return blocks;
}

interface DocumentPageProps {
  file: string;
  fallback: string;
}

/** Renders a repository Markdown file, or an honest message when it is missing. */
export function RepositoryDocument({ file, fallback }: DocumentPageProps) {
  const source = readRepositoryFile(file);
  if (source === null) {
    return (
      <div className="empty-state">
        <p>{fallback}</p>
        <p className="mono">{file}</p>
      </div>
    );
  }
  return <div className="prose">{renderMarkdown(source)}</div>;
}
