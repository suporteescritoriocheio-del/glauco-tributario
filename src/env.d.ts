/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    readonly RESEND_API_KEY?: string;
    readonly RESEND_FROM_EMAIL?: string;
    readonly LEAD_NOTIFICATION_FROM?: string;
    readonly LEAD_NOTIFICATION_TO?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
