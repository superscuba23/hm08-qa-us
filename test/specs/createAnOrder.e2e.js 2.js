const page = require('../../page');
const helper = require('../../helper');

describe('Create an order', () => {
    it('should set the address', async () => {
        await browser.url(`/`);
        await page.fillAddresses('East 2nd Street, 601', '1300 1st St');
        const fromField = await $(page.fromField);
        const toField = await $(page.toField);
        await expect(fromField).toHaveValue('East 2nd Street, 601');
        await expect(toField).toHaveValue('456 Elm St');
    });

    it('should select the Supportive plan', async () => {
        const supportivePlan = await $('#supportive-plan'); // Replace with the actual selector
        await supportivePlan.click();
        await expect(supportivePlan).toHaveElementClassContaining('selected');
    });

    it('should fill in the phone number', async () => {
        await browser.url(`/`);
        await page.fillAddresses('East 2nd Street, 601', '1300 1st St');
        const phoneNumber = helper.getPhoneNumber("+1");
        await page.submitPhoneNumber(phoneNumber);
        await expect(await helper.getElementByText(phoneNumber)).toBeExisting();
    });

    it('should add a credit card', async () => {
        await browser.url(`/`);
        const addCardButton = await $('#add-card-button'); // Replace with the actual selector
        await addCardButton.click();

        const cardNumberInput = await $('#card-number'); // Replace with the actual selector
        const expiryDateInput = await $('#expiry-date'); // Replace with the actual selector
        const cvvInput = await $('#code'); // Replace with the actual selector

        await cardNumberInput.setValue('4111111111111111');
        await expiryDateInput.setValue('12/25');
        await cvvInput.setValue('123');

        // Simulate losing focus from the CVV field
        await cvvInput.addValue('');
        await browser.keys('Tab');

        const linkButton = await $('#link-button'); // Replace with the actual selector
        await linkButton.waitForEnabled();
        await linkButton.click();
        await expect(linkButton).toBeEnabled();
    });

    it('should write a message for the driver', async () => {
        await browser.url(`/`);
        const messageInput = await $('#driver-message'); // Replace with the actual selector
        await messageInput.setValue('Please be on time!');
        await expect(messageInput).toHaveValue('Please be on time!');
    });

    it('should order a Blanket and handkerchiefs', async () => {
        await browser.url(`/`);
        const blanketCheckbox = await $('#order-blanket'); // Replace with the actual selector
        await blanketCheckbox.click();
        const handkerchiefsCheckbox = await $('#order-handkerchiefs'); // Replace with the actual selector
        await handkerchiefsCheckbox.click();

        await expect(blanketCheckbox).toBeSelected();
        await expect(handkerchiefsCheckbox).toBeSelected();
    });

    it('should order 2 Ice creams', async () => {
        await browser.url(`/`);
        const iceCreamInput = await $('#order-ice-cream'); // Replace with the actual selector
        await iceCreamInput.setValue('2');
        await expect(iceCreamInput).toHaveValue('2');
    });

    it('should display car search modal', async () => {
        await browser.url(`/`);
        const searchCarButton = await $('#search-car'); // Replace with the actual selector
        await searchCarButton.click();

        const carSearchModal = await $('#car-search-modal'); // Replace with the actual selector
        await carSearchModal.waitForDisplayed();
        await expect(carSearchModal).toBeDisplayed();
    });

    it('should wait for the driver info to appear in the modal (optional)', async () => {
        await browser.url(`/`);
        const driverInfo = await $('#driver-info'); // Replace with the actual selector
        await driverInfo.waitForDisplayed({ timeout: 10000 });
        await expect(driverInfo).toBeDisplayed();
    });
});


