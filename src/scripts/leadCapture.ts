// leadCapture.ts - Client-side logic for lead capture modal
// Imports
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/styles';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

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
    const whatsapp = cleanPhoneNumber(whatsappRaw);

    // --- Robust Validation ---
    if (!name) {
        alert('Por favor, preencha seu nome.');
        return;
    }

    let phoneIsValid = false;
    let phoneError = '';
    let fullNumber = '';

    // Validate using intl-tel-input + libphonenumber-js
    if (iti) {
        if (!iti.isValidNumber()) {
            // Basic check failed, now use strict check from libphonenumber-js to be sure and get detailed error
            // Actually iti.isValidNumber() uses utils.js if loaded.
            // Let's also check strict parsing to be double sure about mobile/fixed lines if needed,
            // but keeping it simple first.
            phoneError = 'Número de telefone inválido. Verifique o código do país e o número.';
        } else {
            // Get number in E.164 format (e.g., +5511999999999)
            fullNumber = iti.getNumber();

            // Extra validation with libphonenumber-js to ensure it's a mobile number if that's critical?
            // The user mentioned "Sabe que ... não existem celulares começando com...".
            // libphonenumber-js does this.
            if (!isValidPhoneNumber(fullNumber)) {
                phoneIsValid = false;
                phoneError = 'Número inválido para esta região.';
            } else {
                phoneIsValid = true;
                // Optionally check if it's mobile using parsePhoneNumber(fullNumber).getType() === 'MOBILE'
                // but some businesses use WhatsApp on landlines too.
                // Default to just valid number.
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
        // focus
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

        if (!response.ok) {
            throw new Error('Falha ao enviar dados');
        }

        // Track conversion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'send_to': 'AW-11104417748/iB56COGH8eEaENTv_64p'
            });
        }

        submissionCount++; // Increment count

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
        // Alert is okay here as fallback
        alert('Erro ao enviar. Redirecionando para o WhatsApp...');

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
