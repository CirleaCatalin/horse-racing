import { test, expect } from '@playwright/test'
import { HeaderBar } from './pages/HeaderBar'
import { HorsePanelPage } from './pages/HorsePanelPage'

test.describe('Horse Panel Interaction', () => {
  let header: HeaderBar
  let panel: HorsePanelPage

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    header = new HeaderBar(page)
    await header.generateProgram()
    panel = await HorsePanelPage.open(page)
    await expect(panel.horseList).toBeVisible()
  })

  test('horse list shows all 20 horses', async () => {
    await expect(panel.horses).toHaveCount(20)

    // Count badge visible
    await expect(panel.horseList).toContainText('20')
  })

  test('clicking a horse shows detail view with condition meter', async () => {
    await panel.selectHorse(0)
    await expect(panel.horseDetail).toBeVisible()
    await expect(panel.conditionMeter()).toBeVisible()
  })

  test('clicking back returns to list view', async () => {
    await panel.selectHorse(0)
    await expect(panel.horseDetail).toBeVisible()

    await panel.goBack()
    await expect(panel.horseList).toBeVisible()
  })
})
