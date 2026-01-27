export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, whatsapp, source, timestamp } = body;
    if (!name || !whatsapp) {
      return new Response(
        JSON.stringify({ error: "Nome e WhatsApp são obrigatórios" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const formattedDate = new Date(timestamp).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      dateStyle: "short",
      timeStyle: "short"
    });
    const RESEND_API_KEY = undefined                              ;
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: true, warning: "Email não configurado" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "Glauco Tributário <onboarding@resend.dev>",
        // Change to verified domain
        to: ["advocacia@glaucoramos.com"],
        subject: `Novo Lead - ${name} via WhatsApp CTA`,
        html: `
                    <h2>Novo Lead Capturado!</h2>
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>WhatsApp:</strong> ${whatsapp}</p>
                    <p><strong>Origem:</strong> ${source}</p>
                    <p><strong>Data/Hora:</strong> ${formattedDate}</p>
                    <hr>
                    <p><em>Lead capturado via modal pré-WhatsApp</em></p>
                `
      })
    });
    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("Resend API error:", errorData);
    }
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in capture-lead endpoint:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
