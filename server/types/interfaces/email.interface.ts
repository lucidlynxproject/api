export interface EmailMessage {
  from?: string;
  to?: string;
  subject?: string;
  text?: string;
  html?: string;
  template?: string;
  bcc?: string;
  attachments?: Record<string, unknown>[];
  context?: Record<string, unknown>;
}
