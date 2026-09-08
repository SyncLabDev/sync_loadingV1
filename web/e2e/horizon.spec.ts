import { expect, test } from '@playwright/test'

test('renders the HORIZON composition and reacts to loading state', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /establishing sync/i })).toBeVisible()
  await expect(page.getByLabel('Horizon development controller')).toBeVisible()
  await page.evaluate(() => window.postMessage({ eventName: 'loadProgress', loadFraction: .72 }, '*'))
  await expect(page.getByLabel('Loading 72 percent')).toBeVisible()
  await expect(page.getByText('INTERFACE', { exact: true }).first()).toBeVisible()
})

test('isolates media failure and completes cleanly', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Fail media' }).click()
  await expect(page.locator('.media-gradient')).toBeVisible()
  await page.getByRole('button', { name: 'Complete' }).click()
  await expect(page.getByText('ENTERING CITY', { exact: true }).last()).toBeVisible()
  await expect(page.locator('.completion-veil')).toHaveCSS('opacity', '1')
  await expect(page.locator('.cinematic-media')).toHaveCSS('opacity', '0.42')
  await expect(page.locator('.horizon-wedge')).toHaveCSS('opacity', '0')
})

test('music controls are keyboard reachable', async ({ page }) => {
  await page.goto('/')
  const player = page.getByLabel('Music player')
  const playControl = page.getByLabel(/Play music|Pause music/)
  await expect(player).toHaveClass(/is-compact/)
  await expect(playControl).toHaveCount(1)
  await playControl.focus()
  await expect(player).toHaveClass(/is-expanded/)
  await expect(playControl).toHaveCount(1)
  await expect(playControl).toBeFocused()
})

test('keeps the cinematic and surrounding copy stable during moment changes', async ({ page }) => {
  await page.goto('/')

  const media = page.locator('.media-layer.is-active .media-asset')
  await expect(media).toHaveCount(1)
  await expect(media).toHaveCSS('animation-name', 'none')

  const moment = page.locator('.sync-moment')
  const location = page.locator('.location-row')
  const beforeMoment = await moment.boundingBox()
  const beforeLocation = await location.boundingBox()

  await page.getByRole('button', { name: 'Next moment' }).click()
  await page.waitForTimeout(400)

  const afterMoment = await moment.boundingBox()
  const afterLocation = await location.boundingBox()
  expect(afterMoment?.height).toBeCloseTo(beforeMoment?.height ?? 0, 1)
  expect(afterLocation?.y).toBeCloseTo(beforeLocation?.y ?? 0, 1)
})

test('matches the production loading composition', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.evaluate(() => window.postMessage({ eventName: 'loadProgress', loadFraction: .67 }, '*'))
  await page.addStyleTag({ content: '.dev-controller { display: none !important; } .audio-mark i { animation: none !important; }' })
  await expect(page).toHaveScreenshot('horizon-loading.png', { animations: 'disabled', caret: 'hide', maxDiffPixelRatio: .01 })
})
