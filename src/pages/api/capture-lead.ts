// capture-lead.ts - API endpoint for lead capture with Resend integration

import type { APIRoute } from 'astro';

// Force this route to be server-rendered (not pre-rendered as static)
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { name, whatsapp, email, city, message, source, timestamp } = body;

        // Validate input
        if (!name || !whatsapp) {
            console.error('Validation error: Missing name or whatsapp', body);
            return new Response(
                JSON.stringify({ error: 'Nome e WhatsApp são obrigatórios' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // --- Server-side phone validation (last line of defense) ---
        const VALID_DDDS = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99];

        let cleanPhone = whatsapp.replace(/\D/g, '');

        // Strip duplicate 55 prefix: if starts with 5555XX and length > 13 (implying 55 + 55 + 10 digits at least), start stripping
        // If length is 12 or 13, it might be 55 + 10/11 digits (DDD 55)
        if (cleanPhone.length >= 14 && cleanPhone.startsWith('5555')) {
            cleanPhone = cleanPhone.substring(2);
        }

        // Ensure it starts with 55
        if (!cleanPhone.startsWith('55')) {
            cleanPhone = '55' + cleanPhone;
        }

        // Tolerant Validation: 12 to 15 digits allowed (55 + 10..13)
        // 12 digits: 55 + 2 (DDD) + 8 (Landline/Old Mobile)
        // 13 digits: 55 + 2 (DDD) + 9 (Mobile) - STANDARD
        // 14 digits: 55 + 2 (DDD) + 10 (Tolerance +1)
        // 15 digits: 55 + 2 (DDD) + 11 (Tolerance +2)
        if (cleanPhone.length < 12 || cleanPhone.length > 15) {
            console.error(`Phone validation failed: length=${cleanPhone.length}, phone=${cleanPhone}`);
            return new Response(
                JSON.stringify({ error: 'Telefone inválido (verifique DDD e número).' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const ddd = parseInt(cleanPhone.substring(2, 4));
        if (!VALID_DDDS.includes(ddd)) {
            // Soft failure? User wants tolerance.
            // But invalid DDD is usually a typo.
            // Let's Log it but allow it? No, user said "Permita um numero de telefone mais extenso... Nao incentive".
            // He didn't say allow invalid DDDs.
            // However, 55 IS a valid DDD (RS).
            // If DDD is 00 or 99 (invalid), it should block.
            console.error(`Phone validation failed: invalid DDD=${ddd}, phone=${cleanPhone}`);
            return new Response(
                JSON.stringify({ error: 'DDD inválido.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Mobile numbers check is now removed to allow landlines or typos as tolerance
        // if (cleanPhone[4] !== '9') { ... }

        // Use the cleaned phone going forward
        const validatedWhatsapp = cleanPhone;

        // Format timestamp
        const formattedDate = new Date(timestamp).toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            dateStyle: 'short',
            timeStyle: 'short',
        });

        // Send email via Resend
        const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY not configured');
            // Don't fail the request - still return success to user
            return new Response(
                JSON.stringify({ success: true, warning: 'Email não configurado' }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.log(`Sending email for lead: ${name} (${validatedWhatsapp})`);

        const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                // Use Resend test email until domain is verified
                // Change to 'contato@glaucoramos.com' after domain verification
                from: 'Glauco Tributário <contato@glaucoramos.com.br>',
                to: ['advocacia@glaucoramos.com', 'higorrodriguest8@gmail.com'],
                subject: `Novo Lead - ${name} via ${source}`,
                html: `
                    <h2>Novo Lead Capturado!</h2>
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>WhatsApp:</strong> ${validatedWhatsapp}</p>
                    ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
                    ${city ? `<p><strong>Cidade:</strong> ${city}</p>` : ''}
                    ${message ? `<p><strong>Mensagem:</strong> ${message}</p>` : ''}
                    <p><strong>Origem:</strong> ${source}</p>
                    <p><strong>Data/Hora:</strong> ${formattedDate}</p>
                    <hr>
                    <p><em>Lead capturado via site</em></p>
                `,
            }),
        });

        if (!emailResponse.ok) {
            const errorData = await emailResponse.json();
            console.error('Resend API error:', JSON.stringify(errorData));
            // Still return success to user - don't block WhatsApp redirect
        }

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Error in capture-lead endpoint:', error);
        return new Response(
            JSON.stringify({ error: 'Erro interno do servidor' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
