/* global fixture test */
const { Selector } = require('testcafe');

fixture `Follow cards`
  .page `https://www.deckshop.pro/card/by-arena`;

test('card list', async t => {
  const cards = Selector('.list-of-cards a');
  const cardLinks = [];

  for (let index = 0; index < await cards.count; index++) {
    const cardLink = await cards.nth(index).getAttribute('href');
    cardLinks.push(cardLink);
  }

  for (let index = 0; index < cardLinks.length; index++) {
    const cardLink = await cardLinks[index];
    await t.navigateTo(`https://www.deckshop.pro${cardLink}`);
    const elixir = await Selector('h2 .elixir').with({ boundTestRun: t }).textContent;
    console.log(`${cardLink}: ${elixir}`);
  }

  await t.expect(cardLinks.length).eql(82);
});
