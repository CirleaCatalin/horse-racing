import { test, expect } from '@playwright/test'
import { HeaderBar } from './pages/HeaderBar'
import { TrackPage } from './pages/TrackPage'
import { SchedulePanelPage } from './pages/SchedulePanelPage'

test.describe('Full 6-Race Programme', () => {
  test('runs all 6 races to completion', async ({ page }) => {
    test.setTimeout(300_000) // 6 races with countdowns can take a while

    await page.goto('/?speed=5')
    const header = new HeaderBar(page)
    const track = new TrackPage(page)

    await header.generateProgram()
    await header.startRace()

    // Run through all 6 races
    for (let i = 1; i <= 6; i++) {
      if (i < 6) {
        await track.waitForBetweenOverlay()
        await track.ensureVisible()
        await track.clickNextRace()
      }
    }

    // After the last race, the "Programme Complete" overlay appears
    await track.waitForFinished()
    await expect(track.overlayFinished).toContainText('Programme Complete')

    // Results tab shows all 6 completed races
    const schedule = await SchedulePanelPage.open(page)
    await schedule.switchToResults()
    await expect(schedule.resultCard).toHaveCount(6)
  })
})
