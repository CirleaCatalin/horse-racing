import { expect, type Page, type Locator } from '@playwright/test'

export class SchedulePanelPage {
  readonly tabProgramme: Locator
  readonly tabResults: Locator
  readonly raceCard: Locator
  readonly resultCard: Locator

  private constructor(private container: Locator) {
    this.tabProgramme = container.getByTestId('tab-programme')
    this.tabResults = container.getByTestId('tab-results')
    this.raceCard = container.getByTestId('race-card')
    this.resultCard = container.getByTestId('result-card')
  }

  /** Opens the schedule panel (handles mobile nav) and returns a scoped instance. */
  static async open(page: Page) {
    let container: Locator
    if (await page.locator('.bottom-nav').isVisible()) {
      await page.getByTestId('nav-schedule').click()
      container = page.locator('.mobile-overlay')
      await expect(container).toBeVisible()
    } else {
      container = page.locator('.app-main')
    }
    return new SchedulePanelPage(container)
  }

  async switchToResults() {
    await this.tabResults.click()
  }

  async switchToProgramme() {
    await this.tabProgramme.click()
  }
}
