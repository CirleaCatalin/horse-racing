import { test, expect } from '@playwright/test'
import { HeaderBar } from './pages/HeaderBar'
import { TrackPage } from './pages/TrackPage'
import { SchedulePanelPage } from './pages/SchedulePanelPage'

test.describe('Race Lifecycle', () => {
  let header: HeaderBar
  let track: TrackPage

  test.beforeEach(async ({ page }) => {
    await page.goto('/?speed=5')
    header = new HeaderBar(page)
    track = new TrackPage(page)
    await header.generateProgram()
  })

  test('start triggers countdown then horses move', async () => {
    await header.startRace()

    // Countdown overlay appears
    await expect(track.overlayCountdown).toBeVisible()

    // Wait for countdown to finish and race to start
    await track.waitForCountdownEnd()

    // Lanes are visible with horses
    await expect(track.raceLane.first()).toBeVisible()
  })

  test('race completes and shows between-race overlay with podium', async ({
    page,
  }) => {
    await header.startRace()

    // Wait for first race to complete
    await track.waitForBetweenOverlay()

    // Podium shows top 3
    await expect(track.podiumRows()).toHaveCount(3)

    // Results tab shows the completed race
    const schedule = await SchedulePanelPage.open(page)
    await schedule.switchToResults()
    await expect(schedule.resultCard).toHaveCount(1)
  })
})
