import YooModule from "./yooModule.js";
import crypto from "crypto"

const SHOP_ID = 435080;
const SECRET_KEY = "test_rKFyjZqLMjCXQEiBPGnq_qyV6JqqtiXRFSW0AlCpHgI";

const yooController = new YooModule(SHOP_ID, SECRET_KEY);

(async function() {
    try {
        const result = await yooController.createPayment({
            amount: '100.00',
            currency: 'RUB',
            paymentType: 'bank_card',
            returnUrl: 'test'
        });
        console.log(result);
    } catch (error) {
        console.error('Payment creation failed:', error);
    }
})();
