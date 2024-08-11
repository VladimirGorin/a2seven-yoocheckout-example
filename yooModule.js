import { YooCheckout } from '@a2seven/yoo-checkout';
import crypto from 'crypto';

/**
 * @typedef {Object} PaymentPayload
 * @property {Object} amount
 * @property {string} amount.value
 * @property {string} amount.currency
 * @property {Object} payment_method_data
 * @property {string} payment_method_data.type
 * @property {Object} confirmation
 * @property {string} confirmation.type
 * @property {string} confirmation.return_url
 */

/**
 * @class YooModule
 */
class YooModule {
    /**
     * @param {number} shopId
     * @param {string} secretKey
     */
    constructor(shopId, secretKey) {
        this.checkout = new YooCheckout({ shopId, secretKey });
    }

    /**
     * Генерирует уникальный идентификатор UUID v4
     * @returns {string} UUID v4
     */
    generateUUID() {
        const bytes = crypto.randomBytes(16);
        // Устанавливаем версию UUID v4 и маску для случайных байтов
        bytes[6] = (bytes[6] & 0x0f) | 0x40; // Устанавливаем версию (4 бит)
        bytes[8] = (bytes[8] & 0x3f) | 0x80; // Устанавливаем вариант (2 бит)

        // Преобразуем в строку в формате UUID
        const hex = bytes.toString('hex');
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }

    /**
     * @param {Object} params
     * @param {string} params.amount
     * @param {string} params.currency
     * @param {string} params.paymentType
     * @param {string} params.returnUrl
     * @param {string} [params.idempotenceKey] - Опциональный параметр. Если не указан, будет сгенерирован новый UUID.
     * @returns {Promise<Object>} The payment response
     */
    async createPayment({
        amount,
        currency,
        paymentType,
        returnUrl,
        idempotenceKey = this.generateUUID() // Используем UUID, если ключ не передан
    }) {
        /** @type {PaymentPayload} */
        const payload = {
            amount: {
                value: amount,
                currency: currency
            },
            payment_method_data: {
                type: paymentType
            },
            confirmation: {
                type: 'redirect',
                return_url: returnUrl
            }
        };

        try {
            return await this.checkout.createPayment(payload, idempotenceKey);
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    }
}

export default YooModule;
