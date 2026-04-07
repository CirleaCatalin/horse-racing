import { test, expect } from '@playwright/test'
import { HeaderBar } from './pages/HeaderBar'
import { TrackPage } from './pages/TrackPage'
import { HorsePanelPage } from './pages/HorsePanelPage'
import { SchedulePanelPage } from './pages/SchedulePanelPage'

test.describe('Programme Generation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page loads with 20 horses, idle overlay, and disabled start', async ({
    page,
  }) => {
    const header = new HeaderBar(page)
    const track = new TrackPage(page)

    await expect(track.overlayIdle).toBeVisible()
    await expect(header.generateBtn).toBeVisible()
    await expect(header.startBtn).toBeDisabled()

    // All 20 horses are visible
    const panel = await HorsePanelPage.open(page)
    await expect(panel.horses).toHaveCount(20)
  })

  test('clicking Generate Program populates horses and races', async ({
    page,
  }) => {
    const header = new HeaderBar(page)
    await header.generateProgram()

    // All 20 horses remain in the panel
    const horsePanel = await HorsePanelPage.open(page)
    await expect(horsePanel.horseList).toBeVisible()
    await expect(horsePanel.horses).toHaveCount(20)

    // 6 race cards appear in the programme tab
    const schedule = await SchedulePanelPage.open(page)
    await expect(schedule.tabProgramme).toHaveClass(/active/)
    await expect(schedule.raceCard).toHaveCount(6)

    // Start button becomes enabled
    await expect(header.startBtn).toBeEnabled()
  })
})
