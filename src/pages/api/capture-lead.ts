// capture-lead.ts - API endpoint for lead capture with Resend integration

import type { APIRoute } from 'astro';

// Force this route to be server-rendered (not pre-rendered as static)
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { name, whatsapp, source, timestamp } = body;

        // Validate input
        if (!name || !whatsapp) {
            return new Response(
                JSON.stringify({ error: 'Nome e WhatsApp são obrigatórios' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

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

        const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                // Use Resend test email until domain is verified
                // Change to 'contato@glaucoramos.com' after domain verification
                from: 'Glauco Tributário <onboarding@resend.dev>',
                to: ['advocacia@glaucoramos.com'],
                subject: `Novo Lead - ${name} via WhatsApp CTA`,
                html: `
                    <h2>Novo Lead Capturado!</h2>
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>WhatsApp:</strong> ${whatsapp}</p>
                    <p><strong>Origem:</strong> ${source}</p>
                    <p><strong>Data/Hora:</strong> ${formattedDate}</p>
                    <hr>
                    <p><em>Lead capturado via modal pré-WhatsApp</em></p>
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
