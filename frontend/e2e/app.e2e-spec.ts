import { FrontendPage } from './app.po';

describe('frontend App', () => {
  let page: FrontendPage;

  beforeEach(() => {
    page = new FrontendPage();
  });

  it('should display message saying ToDo list!', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('ToDo list!');
  });
});
