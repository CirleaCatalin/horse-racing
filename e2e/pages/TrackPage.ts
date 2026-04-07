import { expect, type Page, type Locator } from '@playwright/test'

export class TrackPage {
  readonly overlayIdle: Locator
  readonly overlayCountdown: Locator
  readonly overlayBetween: Locator
  readonly overlayFinished: Locator
  readonly raceLane: Locator

  constructor(private page: Page) {
    this.overlayIdle = page.getByTestId('overlay-idle')
    this.overlayCountdown = page.getByTestId('overlay-countdown')
    this.overlayBetween = page.getByTestId('overlay-between')
    this.overlayFinished = page.getByTestId('overlay-finished')
    this.raceLane = page.getByTestId('race-lane')
  }

  /** On mobile, clicks the track nav to close any open panel overlay. No-op on desktop. */
  async ensureVisible() {
    if (await this.page.locator('.bottom-nav').isVisible()) {
      await this.page.getByTestId('nav-track').click()
      await expect(this.page.locator('.mobile-overlay')).toBeHidden()
    }
  }

  async waitForCountdownEnd(timeout = 10_000) {
    await expect(this.overlayCountdown).toBeHidden({ timeout })
  }

  async waitForBetweenOverlay(timeout = 45_000) {
    await expect(this.overlayBetween).toBeVisible({ timeout })
  }

  async waitForFinished(timeout = 45_000) {
    await expect(this.overlayFinished).toBeVisible({ timeout })
  }

  podiumRows() {
    return this.overlayBetween.locator('.podium-row')
  }

  async clickNextRace() {
    await this.overlayBetween.locator('.next-race-btn').click()
  }
}
