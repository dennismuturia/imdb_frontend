import { HttpParams } from '@angular/common/http';

export function buildPagingParams(
  page: number,
  pageSize: number,
  name?: string
): HttpParams {
  let params = new HttpParams()
    .set('page', String(page ?? 0))
    .set('page_size', String(pageSize ?? 10));

  const q = (name ?? '').trim();
  if (q.length > 0) params = params.set('name', q);

  return params;
}
