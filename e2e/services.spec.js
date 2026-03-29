const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

async function loginAsAdmin(page) {
  await page.goto(BASE_URL);
  await page.waitForTimeout(1000);
  await page.locator('button.nav-btn').filter({ hasText: 'Log in' }).click();
  await page.waitForTimeout(500);
  await page.fill('input[type="email"]', 'admin@glowandshine.com');
  await page.fill('input[type="password"]', 'Admin@123');
  await page.locator('button').filter({ hasText: /^Log in$/ }).click();
  await expect(page.locator('text=Services Management').first()).toBeVisible({ timeout: 10000 });
}

async function loginAsClient(page) {
  await page.goto(BASE_URL);
  await page.waitForTimeout(1000);
  await page.locator('button.nav-btn').filter({ hasText: 'Log in' }).click();
  await page.waitForTimeout(500);
  await page.fill('input[type="email"]', 'client@glowandshine.com');
  await page.fill('input[type="password"]', 'Client@123');
  await page.locator('button').filter({ hasText: /^Log in$/ }).click();
  await expect(page.locator('text=YOUR SIGNATURE SHINE IS WAITING').first()).toBeVisible({ timeout: 10000 });
}

// ══════════════════════════════
// FEATURE 1: Authentication
// ══════════════════════════════
test.describe('Authentication', () => {

  test('admin can log in and reaches services dashboard', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.locator('text=Services Management').first()).toBeVisible();
  });

  test('client can log in and reaches client dashboard', async ({ page }) => {
    await loginAsClient(page);
    await expect(page.locator('text=YOUR SIGNATURE SHINE IS WAITING').first()).toBeVisible();
  });

  test('wrong credentials shows error message', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    await page.locator('button.nav-btn').filter({ hasText: 'Log in' }).click();
    await page.waitForTimeout(500);
    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'WrongPass@1');
    await page.locator('button').filter({ hasText: /^Log in$/ }).click();
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('empty login fields show validation errors', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    await page.locator('button.nav-btn').filter({ hasText: 'Log in' }).click();
    await page.waitForTimeout(500);
    await page.locator('button').filter({ hasText: /^Log in$/ }).click();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('invalid email format shows error', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    await page.locator('button.nav-btn').filter({ hasText: 'Log in' }).click();
    await page.waitForTimeout(500);
    await page.fill('input[type="email"]', 'notanemail');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.locator('button').filter({ hasText: /^Log in$/ }).click();
    await expect(page.locator('text=valid email address')).toBeVisible();
  });

  test('logout returns to landing page', async ({ page }) => {
    await loginAsAdmin(page);
    await page.locator('text=Log Out').click();
    await expect(page.locator('h1.title')).toBeVisible();
  });

});

// ══════════════════════════════
// FEATURE 2: CRUD Operations
// ══════════════════════════════
test.describe('Services CRUD', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('services table is visible with correct columns', async ({ page }) => {
    await expect(page.locator('th:has-text("Service")')).toBeVisible();
    await expect(page.locator('th:has-text("Price")')).toBeVisible();
    await expect(page.locator('th:has-text("Duration")')).toBeVisible();
    await expect(page.locator('th:has-text("Actions")')).toBeVisible();
  });

  test('can add a new service', async ({ page }) => {
    await page.locator('button:has-text("Add Service")').click();
    await page.fill('input[placeholder="e.g. Facial"]', 'Test Service');
    await page.fill('input[placeholder="e.g. 50"]', '45');
    await page.fill('input[placeholder="e.g. 60"]', '30');
    await page.fill('textarea', 'A test service description');
    await page.locator('.modal-content button:has-text("Add")').click();
    await expect(page.locator('text=Service added successfully')).toBeVisible();
  });

  test('add service validates empty name', async ({ page }) => {
    await page.locator('button:has-text("Add Service")').click();
    await page.fill('input[placeholder="e.g. 50"]', '45');
    await page.fill('input[placeholder="e.g. 60"]', '30');
    await page.locator('.modal-content button:has-text("Add")').click();
    await expect(page.locator('text=Service name is required')).toBeVisible();
  });

  test('add service validates invalid price', async ({ page }) => {
    await page.locator('button:has-text("Add Service")').click();
    await page.fill('input[placeholder="e.g. Facial"]', 'Valid Name');
    await page.fill('input[placeholder="e.g. 50"]', '-10');
    await page.fill('input[placeholder="e.g. 60"]', '30');
    await page.locator('.modal-content button:has-text("Add")').click();
    await expect(page.locator('text=positive whole number')).toBeVisible();
  });

  test('can edit an existing service', async ({ page }) => {
    await page.locator('button:has-text("Edit")').first().click();
    await page.locator('.modal-content input').first().fill('Updated Facial');
    await page.locator('.modal-content button:has-text("Edit")').click();
    await expect(page.locator('text=Service updated successfully')).toBeVisible();
  });

  test('can delete a service', async ({ page }) => {
    await page.locator('button:has-text("Delete")').first().click();
    await page.locator('.modal-content button:has-text("Delete")').click();
    await expect(page.locator('text=Service deleted')).toBeVisible();
  });

  test('can view service details with triple dot', async ({ page }) => {
    await page.locator('button:has-text("•••")').first().click();
    await expect(page.locator('text=SERVICE DETAILS')).toBeVisible();
  });

  test('search filters services correctly', async ({ page }) => {
    await page.fill('input[placeholder="Search"]', 'Facial');
    await expect(page.locator('tbody tr')).toHaveCount(1);
  });

  test('pagination works correctly', async ({ page }) => {
    await expect(page.locator('text=Showing 4 of 8 services')).toBeVisible();
    await page.locator('button:has-text("2")').click();
    await expect(page.locator('text=Pedicure')).toBeVisible();
  });

});

// ══════════════════════════════
// FEATURE 3: Navigation
// ══════════════════════════════
test.describe('Navigation', () => {

  test('admin can navigate to Statistics page', async ({ page }) => {
    await loginAsAdmin(page);
    await page.locator('text=Statistics').click();
    await expect(page.locator('text=Chart View')).toBeVisible();
    await expect(page.locator('text=Tabular View')).toBeVisible();
  });

  test('statistics chart/tabular toggle works', async ({ page }) => {
    await loginAsAdmin(page);
    await page.locator('text=Statistics').click();
    await page.locator('button:has-text("Tabular View")').click();
    await expect(page.locator('th:has-text("Service Name")')).toBeVisible();
    await page.locator('button:has-text("Chart View")').click();
    await expect(page.locator('text=Services Breakdown by Price')).toBeVisible();
  });

  test('landing page explore button navigates to login', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Explore our website!")').click();
    await expect(page.locator('text=Welcome back!')).toBeVisible();
  });

  test('sign up link on login page works', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    await page.locator('button.nav-btn').filter({ hasText: 'Log in' }).click();
    await page.locator('text=Sign up').click();
    await expect(page.locator('text=Create your account')).toBeVisible();
  });

  test('back to website link works from login', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    await page.locator('button.nav-btn').filter({ hasText: 'Log in' }).click();
    await page.locator('text=Back to website').click();
    await expect(page.locator('h1.title')).toBeVisible();
  });

});

//to start: npx playwright test --headed 