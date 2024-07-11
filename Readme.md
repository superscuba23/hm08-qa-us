# Urban Routes End-to-End Tests

This repository contains automated end-to-end (E2E) tests for the Urban Routes application. The tests are designed to validate the complete process of ordering a taxi, from setting the address to confirming additional items and waiting for the driver information.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Tests](#running-the-tests)
- [Test Structure](#test-structure)
- [Helper Functions](#helper-functions)
- [Page Object Model](#page-object-model)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/urban-routes-e2e-tests.git
   cd urban-routes-e2e-tests
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Tests

To run the end-to-end tests, use the following command:

```bash
npx wdio run wdio.conf.js
```

## Test Structure

The E2E tests are located in the `test/specs` folder. The main test file is `createAnOrder.e2e.js`, which covers the full process of ordering a taxi. The tests include:

- Setting the address
- Selecting the Supportive plan
- Filling in the phone number
- Adding a credit card
- Writing a message for the driver
- Ordering a blanket and handkerchiefs
- Ordering 2 ice creams
- Displaying the car search modal
- (Optional) Waiting for the driver info to appear in the modal

### Example Test

```javascript
const page = require('../../page');
const helper = require('../../helper');

describe('Create an order', () => {
    it('should set the address', async () => {
        await browser.url(`/`);
        await page.fillAddresses('123 Main St', '456 Elm St');
        const fromField = await $(page.fromField);
        const toField = await $(page.toField);
        await expect(fromField).toHaveValue('123 Main St');
        await expect(toField).toHaveValue('456 Elm St');
    });

    // Additional test cases follow...
});
```

## Helper Functions

The `helper` module provides utility functions to assist with the tests:

- `getPhoneNumber(countryCode)`: Generates a random phone number with the specified country code.
- `getElementByText(text)`: Finds an element containing the specified text.

```javascript
module.exports = {
    getPhoneNumber: function(countryCode) {
        const number = Math.floor(1000000000 + Math.random() * 9000000000)
        return `${countryCode}${number}`
    },
    getElementByText: async function(obj) {
        return await $(`div=${obj.toString()}`);
    }
};
```

## Page Object Model

The `page` module contains selectors and functions that interact with the UI components:

```javascript
module.exports = {
    // Inputs
    fromField: '#from',
    toField: '#to',
    phoneNumberField: '#phone',
    codeField: '#code',
    // Buttons
    callATaxiButton: 'button=Call a taxi',
    phoneNumberButton: '//div[starts-with(text(), "Phone number")]',
    nextButton: 'button=Next',
    confirmButton: 'button=Confirm',
    // Modals
    phoneNumberModal: '.modal',
    // Functions
    fillAddresses: async function(from, to) {
        const fromField = await $(this.fromField);
        await fromField.setValue(from);
        const toField = await $(this.toField);
        await toField.setValue(to);
        const callATaxiButton = await $(this.callATaxiButton);
        await callATaxiButton.waitForDisplayed();
        await callATaxiButton.click();
    },
    fillPhoneNumber: async function(phoneNumber) {
        const phoneNumberButton = await $(this.phoneNumberButton);
        await phoneNumberButton.waitForDisplayed();
        await phoneNumberButton.click();
        const phoneNumberModal = await $(this.phoneNumberModal);
        await phoneNumberModal.waitForDisplayed()
        const phoneNumberField = await $(this.phoneNumberField);
        await phoneNumberField.waitForDisplayed();
        await phoneNumberField.setValue(phoneNumber);
    },
    submitPhoneNumber: async function(phoneNumber) {
        await this.fillPhoneNumber(phoneNumber);
        // we are starting interception of request from the moment of method call
        await browser.setupInterceptor();
        await $(this.nextButton).click();
        // we should wait for response
        // eslint-disable-next-line wdio/no-pause
        await browser.pause(2000);
        const codeField = await $(this.codeField);
        // collect all responses
        const requests = await browser.getRequests();
        // use first response
        await expect(requests.length).toBe(1);
        const code = await requests[0].response.body.code;
        await codeField.setValue(code);
        await $(this.confirmButton).click();
    },
};
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

---

This README provides an overview of the test setup, structure, and instructions for running the tests, making it easier for developers to understand and contribute to the project.