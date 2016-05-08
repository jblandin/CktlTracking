import { CktlTrackingPage } from './app.po';

describe('cktl-tracking App', function() {
  let page: CktlTrackingPage;

  beforeEach(() => {
    page = new CktlTrackingPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('cktl-tracking works!');
  });
});
