import { TCCTestePage } from './app.po';

describe('tccteste App', () => {
  let page: TCCTestePage;

  beforeEach(() => {
    page = new TCCTestePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
