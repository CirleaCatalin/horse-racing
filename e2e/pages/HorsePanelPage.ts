import { expect, type Page, type Locator } from '@playwright/test'

export class HorsePanelPage {
  readonly horseList: Locator
  readonly horseDetail: Locator
  readonly horses: Locator

  private constructor(private container: Locator) {
    this.horseList = container.getByTestId('horse-list')
    this.horseDetail = container.getByTestId('horse-detail')
    this.horses = this.horseList.locator('.horse-list li')
  }

  /** Opens the horse panel (handles mobile nav) and returns a scoped instance. */
  static async open(page: Page) {
    let container: Locator
    if (await page.locator('.bottom-nav').isVisible()) {
      await page.getByTestId('nav-horses').click()
      container = page.locator('.mobile-overlay')
      await expect(container).toBeVisible()
    } else {
      container = page.locator('.app-main')
    }
    return new HorsePanelPage(container)
  }

  async selectHorse(index: number) {
    await this.horses.nth(index).click()
    await expect(this.horseDetail).toBeVisible()
  }

  async goBack() {
    await this.horseDetail.locator('.back-btn').click()
    await expect(this.horseList).toBeVisible()
  }

  conditionMeter() {
    return this.horseDetail.locator('.meter')
  }
}
