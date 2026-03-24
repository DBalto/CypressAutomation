/**
 * TEMPORARY DIAGNOSTIC TEST
 * Purpose: Inspect the real DOM on the inventory page to determine
 * why [data-test="product_sort_container"] cannot be found by Cypress.
 *
 * This file should be removed once the root cause is identified.
 * Run with: npx cypress run --spec 'cypress/e2e/diagnostics.spec.cy.js'
 */
describe('DOM Diagnostics - Inventory Page Sort Container', () => {
  beforeEach(() => {
    cy.visit('/');
    // Use raw login to avoid any guard assertions interfering with diagnostics
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    // Only wait for URL — we want to inspect the DOM as early as possible
    cy.url().should('include', '/inventory.html');
  });

  // -------------------------------------------------------
  // DIAGNOSTIC 1: Dump all data-test attributes in the DOM
  // This tells us every element that has a data-test attribute
  // and what their values are. If product_sort_container is missing
  // from this list, the element simply does not exist in the DOM.
  // -------------------------------------------------------
  it('DIAG 1: Print all data-test attributes present in the DOM', () => {
    cy.get('body').then(($body) => {
      const elements = $body.find('[data-test]');
      const attrs = [];
      elements.each((i, el) => {
        attrs.push({
          tag: el.tagName,
          dataTest: el.getAttribute('data-test'),
          id: el.id || '(none)',
          class: el.className || '(none)',
          visible: Cypress.dom.isVisible(el),
        });
      });
      cy.log(`Found ${attrs.length} elements with data-test attributes`);
      attrs.forEach((a) => {
        cy.log(
          `[data-test="${a.dataTest}"] | tag: ${a.tag} | id: ${a.id} | visible: ${a.visible}`
        );
      });
      // Also print to the browser console for full detail
      console.table(attrs);
    });
  });

  // -------------------------------------------------------
  // DIAGNOSTIC 2: Search by alternative selectors
  // If the element exists but under a different selector,
  // one of these will find it.
  // -------------------------------------------------------
  it('DIAG 2: Search for sort element by alternative selectors', () => {
    cy.get('body').then(($body) => {
      const selectors = [
        '[data-test="product_sort_container"]',
        'select.product_sort_container',
        'select[class*="sort"]',
        'select[class*="product"]',
        '.product_sort_container',
        '[class*="sort_container"]',
        '[class*="product_sort"]',
        'select',                          // any select element at all
        '[data-test*="sort"]',             // any data-test containing "sort"
        '[data-test*="filter"]',           // maybe it was renamed to filter
        '[data-test*="product"]',          // any data-test containing "product"
        '.inventory_container select',     // select inside inventory container
        '.header_secondary_container select', // select in the header bar
        '.right_component select',         // select in right component
      ];

      selectors.forEach((sel) => {
        const found = $body.find(sel);
        cy.log(
          `Selector: "${sel}" → found: ${found.length} element(s)` +
          (found.length > 0
            ? ` | outerHTML: ${found[0].outerHTML.substring(0, 120)}`
            : '')
        );
      });
    });
  });

  // -------------------------------------------------------
  // DIAGNOSTIC 3: Print the HTML of the products header area
  // This shows us the actual structure around where the sort
  // container should be rendered.
  // -------------------------------------------------------
  it('DIAG 3: Print HTML of the inventory header / toolbar area', () => {
    cy.get('body').then(($body) => {
      const candidates = [
        '.inventory_container',
        '.header_secondary_container',
        '.primary_header',
        '.inventory_list',
        '#header_container',
        '.right_component',
        '[class*="header"]',
        '[class*="toolbar"]',
        '[class*="filter"]',
        '[class*="sort"]',
      ];

      candidates.forEach((sel) => {
        const el = $body.find(sel).first();
        if (el.length > 0) {
          // Print first 300 chars of outerHTML to avoid log flooding
          cy.log(
            `Selector "${sel}" HTML: ${el[0].outerHTML.substring(0, 300)}`
          );
          console.log(`=== ${sel} ===`);
          console.log(el[0].outerHTML);
        } else {
          cy.log(`Selector "${sel}" → NOT FOUND in DOM`);
        }
      });
    });
  });

  // -------------------------------------------------------
  // DIAGNOSTIC 4: Check for iframes
  // If the inventory page renders inside an iframe, Cypress
  // cannot find elements inside it without cy.iframe() or
  // explicit frame switching.
  // -------------------------------------------------------
  it('DIAG 4: Check for iframes on the inventory page', () => {
    cy.get('body').then(($body) => {
      const iframes = $body.find('iframe');
      cy.log(`Number of iframes found: ${iframes.length}`);
      iframes.each((i, frame) => {
        cy.log(
          `iframe[${i}] src="${frame.src}" id="${frame.id}" class="${frame.className}"`
        );
      });
      if (iframes.length === 0) {
        cy.log('No iframes detected — iframe context is NOT the issue');
      }
    });
  });

  // -------------------------------------------------------
  // DIAGNOSTIC 5: Check for shadow DOM
  // If the sort container is inside a shadow root, standard
  // cy.get() cannot pierce it without { includeShadowDom: true }
  // -------------------------------------------------------
  it('DIAG 5: Check for shadow DOM roots on the inventory page', () => {
    cy.get('body').then(($body) => {
      const allElements = $body.find('*');
      const shadowHosts = [];
      allElements.each((i, el) => {
        if (el.shadowRoot) {
          shadowHosts.push({
            tag: el.tagName,
            id: el.id,
            class: el.className,
          });
        }
      });
      cy.log(`Shadow DOM hosts found: ${shadowHosts.length}`);
      shadowHosts.forEach((h) => {
        cy.log(`Shadow host: <${h.tag}> id="${h.id}" class="${h.class}"`);
      });
      if (shadowHosts.length === 0) {
        cy.log('No shadow DOM detected — shadow DOM is NOT the issue');
      }
    });
  });

  // -------------------------------------------------------
  // DIAGNOSTIC 6: Check viewport and app state
  // A collapsed viewport could hide elements or cause the app
  // to render a mobile layout without the sort container.
  // -------------------------------------------------------
  it('DIAG 6: Log viewport size and key app state', () => {
    cy.window().then((win) => {
      cy.log(`Viewport width: ${win.innerWidth}`);
      cy.log(`Viewport height: ${win.innerHeight}`);
      cy.log(`Device pixel ratio: ${win.devicePixelRatio}`);
      cy.log(`Document readyState: ${win.document.readyState}`);
      cy.log(`URL: ${win.location.href}`);

      // Check if React is present and its version
      if (win.React) {
        cy.log(`React version: ${win.React.version}`);
      } else {
        cy.log('React not found on window — may be bundled privately');
      }

      // Check localStorage for any session/cart state that could
      // affect what the inventory page renders
      const keys = Object.keys(win.localStorage);
      cy.log(`localStorage keys: ${keys.join(', ') || '(empty)'}`);
      keys.forEach((k) => {
        cy.log(`localStorage["${k}"] = ${win.localStorage.getItem(k)}`);
      });
    });

    // Confirm the configured viewport matches cypress.config.js
    cy.log(`Cypress viewport: ${Cypress.config('viewportWidth')}x${Cypress.config('viewportHeight')}`);
  });

  // -------------------------------------------------------
  // DIAGNOSTIC 7: Wait for full page stability then re-check
  // This rules out a hydration/re-render timing issue by waiting
  // for the DOM to stop mutating before querying the sort element.
  // -------------------------------------------------------
  it('DIAG 7: Wait for DOM stability then check sort container existence', () => {
    // Wait for products to be present first
    cy.get('.inventory_item').should('have.length.greaterThan', 0);

    // Use a MutationObserver via cy.window() to detect when the DOM
    // has stopped mutating, then check for the sort container
    cy.window().then((win) => {
      return new Cypress.Promise((resolve) => {
        let timer;
        const observer = new win.MutationObserver(() => {
          clearTimeout(timer);
          // If no mutations for 500ms, consider DOM stable
          timer = setTimeout(() => {
            observer.disconnect();
            resolve();
          }, 500);
        });
        observer.observe(win.document.body, {
          childList: true,
          subtree: true,
          attributes: true,
        });
        // Kick off the timer in case DOM is already stable
        timer = setTimeout(() => {
          observer.disconnect();
          resolve();
        }, 500);
      });
    });

    // Now check what exists after DOM is stable
    cy.get('body').then(($body) => {
      const sortEl = $body.find('[data-test="product_sort_container"]');
      const anySelect = $body.find('select');
      cy.log(`After DOM stability — [data-test="product_sort_container"] count: ${sortEl.length}`);
      cy.log(`After DOM stability — any <select> element count: ${anySelect.length}`);
      if (anySelect.length > 0) {
        anySelect.each((i, el) => {
          cy.log(`<select>[${i}] outerHTML: ${el.outerHTML.substring(0, 200)}`);
        });
      }
    });
  });
});
