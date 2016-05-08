export class CktlTrackingPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('cktl-tracking-app h1')).getText();
  }
}
