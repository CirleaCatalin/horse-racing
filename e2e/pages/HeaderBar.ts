import { expect, type Page, type Locator } from '@playwright/test'

export class HeaderBar {
  readonly generateBtn: Locator
  readonly startBtn: Locator

  constructor(private page: Page) {
    this.generateBtn = page.getByTestId('btn-generate')
    this.startBtn = page.getByTestId('btn-start')
  }

  /** Clicks Generate, waits for Start to become enabled. */
  async generateProgram() {
    await this.generateBtn.click()
    await expect(this.startBtn).toBeEnabled()
  }

  /** Clicks the Start / Resume button. */
  async startRace() {
    await this.startBtn.click()
  }
}
