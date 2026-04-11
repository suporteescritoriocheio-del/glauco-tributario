// leadCapture.ts - Client-side logic for lead capture modal
// Imports
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/styles';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { getWhatsAppMessage, buildWhatsAppUrl } from '../config/whatsappMessages';

// Declare gtag as global function
declare function gtag(...args: any[]): void;

// Modal elements
const modal = document.getElementById('lead-modal') as HTMLDivElement;
const modalClose = document.getElementById('modal-close') as HTMLButtonElement;
const leadForm = document.getElementById('lead-form') as HTMLFormElement;
const whatsappInput = document.getElementById('lead-whatsapp') as HTMLInputElement;

// Store the WhatsApp URL to redirect to after form submission
let targetWhatsAppUrl = '';

// Track submission count for retry logic
let submissionCount = 0;

// --- localStorage Lead Backup & Recovery System ---
function saveLeadBackup(data: Record<string, any>, status: string) {
    try {
        const leads = JSON.parse(localStorage.getItem('glauco_leads_backup') || '[]');
        const leadEntry = {
            timestamp: new Date().toISOString(),
            page: document.title,
            url: window.location.pathname,
            source: 'modal',
            status,
            data,
            // Add a unique ID for deduplication
            id: `${data.name || ''}_${data.whatsapp || ''}_${Date.now()}`
        };
        leads.push(leadEntry);
        // Keep last 500 entries
        const trimmed = leads.length > 500 ? leads.slice(-500) : leads;
        localStorage.setItem('glauco_leads_backup', JSON.stringify(trimmed));
        console.log('Lead saved to localStorage with status:', status);
    } catch (e) { console.warn('Erro ao salvar backup do lead:', e); }
}

// Save lead in parallel to prevent loss (even before validation)
function saveLeadProactively(data: Record<string, any>) {
    saveLeadBackup(data, 'pending_validation');
    // Also attempt to send via API without waiting for success
    try {
        fetch('/api/capture-lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data.name,
                whatsapp: data.whatsapp,
                source: document.title,
                timestamp: new Date().toISOString(),
            }),
        }).catch(() => {
            // Silently fail - lead is already in localStorage
        });
    } catch (e) {
        // Network error - lead is still in localStorage
    }
}

// Initialize intl-tel-input
let iti: any;
if (whatsappInput) {
    iti = intlTelInput(whatsappInput, {
        initialCountry: "br",
        strictMode: true,
        separateDialCode: true,
        loadUtils: () => import("intl-tel-input/utils"),
        i18n: {
            // Portuguese translations
            searchPlaceholder: "Pesquisar",
            br: "Brasil",
            us: "Estados Unidos",
            // Add others as needed or rely on defaults
        }
    });
}

// Clean phone number for API (remove formatting)
function cleanPhoneNumber(value: string): string {
    return value.replace(/\D/g, ''); // Keep only digits
}

// Show modal function
function showModal(whatsappUrl: string) {
    targetWhatsAppUrl = whatsappUrl;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // Reset form state in case it was used before
    leadForm.style.display = 'block';
    const successMsg = document.getElementById('modal-success-msg');
    if (successMsg) successMsg.remove();
    leadForm.reset();
    submissionCount = 0; // Reset count on new modal open
}

// Hide modal function
function hideModal() {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scroll
    leadForm.reset();

    // Reset view
    leadForm.style.display = 'block';
    const successMsg = document.getElementById('modal-success-msg');
    if (successMsg) successMsg.remove();
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

// Create error element for modal
const modalPhoneError = document.createElement('div');
modalPhoneError.id = 'modal-phone-error';
modalPhoneError.style.color = 'red';
modalPhoneError.style.fontSize = '0.8rem';
modalPhoneError.style.marginTop = '0.25rem';
modalPhoneError.style.display = 'none';
if (whatsappInput && whatsappInput.parentNode) {
    whatsappInput.parentNode.appendChild(modalPhoneError);
}

// Handle form submission
leadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(leadForm);
    const name = formData.get('name') as string;
    const whatsappRaw = formData.get('whatsapp') as string;

    // --- Robust Validation ---
    if (!name) {
        alert('Por favor, preencha seu nome.');
        return;
    }

    // CRITICAL: Save lead immediately, even before validation
    // This ensures we never lose a lead, even if validation fails
    saveLeadProactively({ name, whatsapp: whatsappRaw });

    let phoneIsValid = false;
    let phoneError = '';
    let fullNumber = '';

    // Validate using intl-tel-input + libphonenumber-js
    if (iti) {
        if (!iti.isValidNumber()) {
            phoneError = 'Número de telefone inválido. Verifique o código do país e o número.';
        } else {
            // Get number in E.164 format (e.g., +5511999999999)
            fullNumber = iti.getNumber();

            // Extra validation with libphonenumber-js
            if (!isValidPhoneNumber(fullNumber)) {
                phoneIsValid = false;
                phoneError = 'Número inválido para esta região.';
            } else {
                phoneIsValid = true;
            }
        }
    } else {
        // Fallback if iti failed to load
        if (cleanPhoneNumber(whatsappRaw).length < 10) {
            phoneError = 'Número inválido.';
        } else {
            phoneIsValid = true;
            fullNumber = '55' + cleanPhoneNumber(whatsappRaw);
        }
    }

    if (!phoneIsValid) {
        modalPhoneError.textContent = phoneError;
        modalPhoneError.style.display = 'block';
        modalPhoneError.style.color = 'red';
        whatsappInput.style.borderColor = 'red';
        // Lead already saved, user can correct and retry
        whatsappInput.focus();
        return;
    }

    // Clear error
    modalPhoneError.style.display = 'none';
    whatsappInput.style.borderColor = '';

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
                whatsapp: fullNumber.replace('+', ''), // Send without +
                source: document.title,
                timestamp: new Date().toISOString(),
            }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.success) {
            throw new Error(result?.error || 'Falha ao enviar dados');
        }

        // Track conversion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'send_to': 'AW-11104417748/iB56COGH8eEaENTv_64p'
            });
        }

        submissionCount++;
        saveLeadBackup({ name, whatsapp: fullNumber.replace('+', '') }, 'success');

        // --- Success View ---
        leadForm.style.display = 'none';

        // Conditional Retry Button
        const showRetry = submissionCount < 2;
        const retryBtnHtml = showRetry ? `
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee;">
                <button id="modal-retry-btn" class="btn btn-secondary btn-small" style="width: 100%; font-size: 0.9rem; margin-bottom: 0.5rem;">
                    Corrigir dados / Enviar novamente
                </button>
            </div>
        ` : '';

        const successContainer = document.createElement('div');
        successContainer.id = 'modal-success-msg';
        successContainer.className = 'text-center';
        successContainer.style.padding = '1rem 0';
        successContainer.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3 style="margin-top: 1rem; color: #333; font-size: 1.25rem;">Tudo certo!</h3>
                <p style="color: #666; font-size: 0.9rem;">Clique abaixo para iniciar a conversa.</p>
            </div>
            <a href="${targetWhatsAppUrl}" target="_blank" class="btn btn-primary btn-large" style="background-color: #25D366; border-color: #25D366; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.996 1.804 1.741-1.602zM8.339 4.696c-.249.125-.516.146-.688.169-.427.056-1.009.245-1.396.632-.569.569-1.579 1.58-1.579 3.791s2.607 5.275 4.093 6.76c1.486 1.487 3.659 3.029 5.883 3.029.563 0 1.442-.218 1.995-.873.493-.585.914-1.554.914-2.152 0-.256-.038-.415-.125-.688-.125-.391-2.909-2.071-3.21-2.164-.326-.101-.623-.1-.904.301-.19.268-1.085 1.565-1.385 1.865-.301.301-.58.335-.904.22-.326-.115-2.083-.794-3.568-2.119-1.157-1.033-1.896-2.28-2.179-2.678-.283-.398-.242-.647-.058-.936.467-.735.859-.974 1.258-1.664.125-.218.157-.468.046-.749-.111-.281-1.396-3.896-1.353-3.794z"/>
                </svg>
                FALAR NO WHATSAPP AGORA
            </a>
            ${retryBtnHtml}
            <button id="modal-success-close" class="btn btn-secondary btn-small" style="margin-top: 1rem; width: 100%; font-size: 0.9rem;">Fechar</button>
        `;

        // Append to modal content (parent of form)
        if (leadForm.parentNode) {
            leadForm.parentNode.appendChild(successContainer);

            // Add close listener to the new button
            const closeBtn = document.getElementById('modal-success-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', hideModal);
            }

            // Add retry listener if exists
            if (showRetry) {
                const retryBtn = document.getElementById('modal-retry-btn');
                if (retryBtn) {
                    retryBtn.addEventListener('click', () => {
                        const successMsg = document.getElementById('modal-success-msg');
                        if (successMsg) successMsg.remove();
                        leadForm.style.display = 'block';
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText || 'CONTINUAR PARA O WHATSAPP';
                    });
                }
            }
        }

    } catch (error) {
        console.error('Error capturing lead:', error);
        // Lead is already saved proactively, show error but allow WhatsApp redirect
        alert('Nao foi possivel confirmar o envio do e-mail agora. Redirecionando para o WhatsApp...');

        // Fallback redirect
        setTimeout(() => {
            window.location.href = targetWhatsAppUrl;
        }, 500);
    } finally {
        // Only reset button if we didn't show the success message
        if (leadForm.style.display !== 'none') {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText || 'CONTINUAR PARA O WHATSAPP';
        }
    }
});

// Intercept WhatsApp CTA clicks — EXCEPT floating button (goes direct)
function initWhatsAppInterceptors() {
    const whatsappButtons = document.querySelectorAll('a[href*="whatsapp.com"], a[href*="web.whatsapp"]');
    const phoneNumber = '554391244440'; // Central phone number

    whatsappButtons.forEach((button) => {
        // Floating WhatsApp button → direct to WhatsApp, no modal
        if (button.classList.contains('floating-whatsapp')) {
            button.addEventListener('click', () => {
                // Fire Google Ads conversion before redirect
                if (typeof (window as any).gtag !== 'undefined') {
                    (window as any).gtag('event', 'conversion', {
                        send_to: 'AW-11104417748/iB56COGH8eEaENTv_64p',
                    });
                }
                // Let the default href action proceed (opens WhatsApp)
            });
            return; // Skip modal intercept for this button
        }

        // All other WhatsApp buttons → show modal form
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Get contextual message from the button's text or data attribute
            let message = (button as HTMLAnchorElement).getAttribute('data-message');

            // If no data-message, try to extract from href or use page title
            if (!message) {
                const href = (button as HTMLAnchorElement).href;
                const urlParams = new URL(href).searchParams;
                const textParam = urlParams.get('text');
                message = textParam ? decodeURIComponent(textParam) : getWhatsAppMessage(document.title);
            }

            // Build dynamic WhatsApp URL with consistent phone and contextual message
            const url = buildWhatsAppUrl(phoneNumber, message);
            showModal(url);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhatsAppInterceptors);
} else {
    initWhatsAppInterceptors();
}
