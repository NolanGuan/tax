import { getStructuredDataForPage, type PageKey } from '@/config/seo';

interface StructuredDataProps {
  pageKey?: PageKey;
  data?: Record<string, any> | Array<Record<string, any>>;
  id?: string;
}

export function StructuredData({ pageKey, data, id = 'structured-data' }: StructuredDataProps) {
  const payload: Array<Record<string, any>> = [];

  if (pageKey) {
    payload.push(...getStructuredDataForPage(pageKey));
  }

  if (data) {
    if (Array.isArray(data)) {
      payload.push(...data);
    } else {
      payload.push(data);
    }
  }

  if (payload.length === 0) {
    return null;
  }

  const json = payload.length === 1 ? payload[0] : payload;

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
