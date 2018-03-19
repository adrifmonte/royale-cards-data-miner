const cheerio = require('cheerio');
const axios = require('axios');

const CARD_BY_ARENA_URL = 'https://www.deckshop.pro/card/by-arena';
const CARD_DETAIL_URL = cardElementHref => `https://www.deckshop.pro${cardElementHref}`;

const scrap = url =>
  new Promise((resolve, reject) => {
    axios.get(url)
      .then(result => {
        console.log(`Accessed ${url}`);
        resolve(cheerio.load(result.data));
      })
      .catch(error => {
        reject({
          message: `Error when fetching ${url}`,
          error
        });
      });
  });

scrap(CARD_BY_ARENA_URL)
  .then($ => Promise.all(
    $('.list-of-cards a')
      .map((i, el) => $(el).attr('href')).get()
      .map(link => scrap(CARD_DETAIL_URL(link)))
  ))
  .then(cardPages =>
    cardPages.map($ => ({
      name: $('h2 > span').eq(0).text().trim(),
      elixir: $('h2  > span').eq(1).text().trim(),
      rarity: $('h2  > span').eq(2).text().trim(),
      arena: $('h2  > span').eq(3).text().trim(),
      attributes: $('table.table.table-inverse').eq(0).find('tbody tr').map((i, el) => ({
        name: $(el).find('th').text().trim(),
        value: $(el).find('td').text().trim()
      })).get(),
      flags: $('#properties + div a').map((i, el) => $(el).text().trim()).get(),
      properties: $('#properties + div + div a').map((i, el) => $(el).text().trim()).get(),
      counters: $('#counters + p + div a').map((i, el) => $(el).attr('href').trim()).get(),
      countered: $('#countered + p + div a').map((i, el) => $(el).attr('href').trim()).get(),
      synergies: $('#synergies + p + div a').map((i, el) => $(el).attr('href').trim()).get()
    }))
  )
  .then(console.log)
  .catch(console.error);
