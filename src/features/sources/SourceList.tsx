interface SourceListProps {
  sources: string[];
  className?: string;
}

function sourceLabel(source: string): string {
  try {
    const url = new URL(source);
    const path = url.pathname === '/' ? '' : url.pathname.replace(/\/$/, '');
    return `${url.hostname.replace(/^www\./, '')}${path}`;
  } catch {
    return source;
  }
}

export function SourceList({ sources, className = 'list-disc space-y-1 pl-5' }: SourceListProps) {
  return (
    <ul className={className}>
      {sources.map((source) => (
        <li key={source}>
          {source.startsWith('https://') ? (
            <a className="text-blue-600 hover:underline" href={source} target="_blank" rel="noreferrer">
              {sourceLabel(source)}
            </a>
          ) : (
            source
          )}
        </li>
      ))}
    </ul>
  );
}
