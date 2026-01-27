// leadCapture.ts - Client-side logic for lead capture modal

// Declare gtag as global function
declare function gtag(...args: any[]): void;

// Modal elements
const modal = document.getElementById('lead-modal') as HTMLDivElement;
const modalClose = document.getElementById('modal-close') as HTMLButtonElement;
const leadForm = document.getElementById('lead-form') as HTMLFormElement;

// Store the WhatsApp URL to redirect to after form submission
let targetWhatsAppUrl = '';

// Show modal function
function showModal(whatsappUrl: string) {
    targetWhatsAppUrl = whatsappUrl;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

// Hide modal function
function hideModal() {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scroll
    leadForm.reset();
}

// Close modal on button click
modalClose?.addEventListener('click', hideModal);

// Close modal on overlay click (click outside)
modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
        hideModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        hideModal();
    }
});

// Handle form submission
leadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(leadForm);
    const name = formData.get('name') as string;
    const whatsapp = formData.get('whatsapp') as string;

    // Basic validation
    if (!name || !whatsapp) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Disable submit button
    const submitBtn = leadForm.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'ENVIANDO...';

    try {
        // Send lead data to API
        const response = await fetch('/api/capture-lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                whatsapp,
                source: document.title,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            throw new Error('Falha ao enviar dados');
        }

        // Track conversion in Google Ads
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'send_to': 'AW-11104417748/bqfVCO3iwN4ZENTv_64p',
                'value': 1.0,
                'currency': 'BRL'
            });
        }

        // Success - close modal and redirect to WhatsApp
        hideModal();

        // Small delay for better UX
        setTimeout(() => {
            window.location.href = targetWhatsAppUrl;
        }, 300);

    } catch (error) {
        console.error('Error capturing lead:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        });
        alert('Erro ao enviar. Redirecionando para o WhatsApp...');

        // Even on error, redirect to WhatsApp (better UX)
        setTimeout(() => {
            window.location.href = targetWhatsAppUrl;
        }, 500);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText || 'CONTINUAR PARA O WHATSAPP';
    }
});

// Intercept all WhatsApp CTA clicks
document.addEventListener('DOMContentLoaded', () => {
    const whatsappButtons = document.querySelectorAll('a[href*="whatsapp.com"]');

    whatsappButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const url = (button as HTMLAnchorElement).href;
            showModal(url);
        });
    });
});
