// Lightweight analytics utility for demo instrumentation

export type AnalyticsEvent =
  | 'quick_action_click'
  | 'quote_new_click'
  | 'quote_new_success'
  | 'quote_new_error'
  | 'company_new_click'
  | 'company_new_success'
  | 'company_new_error'
  | 'contact_new_click'
  | 'contact_new_success'
  | 'contact_new_error'
  | 'import_click'
  | 'import_progress'
  | 'import_success'
  | 'import_error'
  | 'flow_cancel';

export interface AnalyticsProps {
  [key: string]: unknown;
}

export function trackEvent(name: AnalyticsEvent, props: AnalyticsProps = {}): void {
  try {
    const payload = {
      name,
      props,
      ts: Date.now(),
    };

    // Console for developer visibility
    // eslint-disable-next-line no-console
    console.info('[analytics]', payload);

    // Persist minimal history for debugging/demo
    if (typeof window !== 'undefined') {
      const key = 'analytics_log';
      const existing = window.localStorage.getItem(key);
      const list: any[] = existing ? JSON.parse(existing) : [];
      list.push(payload);
      // Keep only the last 200 events to avoid unbounded growth
      window.localStorage.setItem(key, JSON.stringify(list.slice(-200)));

      // Emit a DOM event so UI can react if desired
      window.dispatchEvent(new CustomEvent('analytics:event', { detail: payload }));
    }
  } catch {
    // Swallow to avoid breaking UX on analytics failures
  }
}