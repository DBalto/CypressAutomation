# Cypress Demo Test Project

This project contains automated tests using Cypress for various demo sites, including the Sauce Demo site and Telerik Kendo UI for jQuery demo site. These tests are designed to demonstrate basic navigation and interaction with web elements.

## Project Setup

To set up this Cypress project on your local machine, follow the steps below.

### Prerequisites

- [Node.js](https://nodejs.org/) (v12.0.0 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the Repository:**

   Clone this repository to your local machine.

   ```bash
   git clone https://github.com/your-username/cypress-demo-test.git
   cd cypress-demo-test

2. Install Dependencies:

Run the following command to install the necessary npm packages:

  ```bash
  npm install
```
Running the Tests
You can run the tests using Cypress Test Runner or in headless mode.

Using Cypress Test Runner

1. Open Cypress:

Run the following command to open Cypress Test Runner:
  ```bash
  npx cypress open
```
2. Run Tests:

In the Test Runner, click on any of the spec files to run the tests.

Running in Headless Mode
To run all tests in headless mode, use the following command:
  ```bash
  npx cypress run
```

### Test Specifications
This project contains the following test specifications:

1. Sauce Demo Site (sauceDemo.spec.cy.js)
Purpose: Test the login functionality and product display on the Sauce Demo site.
Tests Included:
Log in with valid credentials.
Verify product items are displayed on the inventory page.
Log out successfully.

2. Telerik Kendo UI Demo Site (kendoDemo.spec.cy.js)
Purpose: Test navigation and interaction with demo components on the Telerik Kendo UI for jQuery demo page.
Tests Included:
Navigate to a specific demo page.
Interact with a button component.

3. Custom Demo Site (customDemo.spec.cy.js)
Purpose: Placeholder for additional demo site tests.
Instructions: Modify the file to include tests for any demo site of your choice.

### Customization
To customize the tests for other demo sites, modify the test files in the cypress/integration/ directory. Update the URLs, selectors, and interactions as needed.

### Troubleshooting
If you encounter issues, ensure your environment meets the prerequisites and dependencies are installed correctly. Check the Cypress documentation for additional support: Cypress Documentation
