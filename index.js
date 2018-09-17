const config = require('./config.json');
const _ = require('lodash');

module.exports = function ClubRewards(mod) {
  const rewards = {
    2: "Dragon's Flame",
    5: "TERA Club Supplies",
  };

  let playerNames = config.names.slice();
  let isReady = false;

  mod.game.on('enter_loading_screen', () => {
    isReady = false;
  });

  mod.game.on('leave_loading_screen', () => {
    isReady = true;
  });

  mod.hook('S_PCBANGINVENTORY_DATALIST', 1, event => {
    if (!playerNames.includes(mod.game.me.name) || !isReady) return;
    event.inventory.forEach(function(item, index) {
      if (rewards[item.slot] && item.amount == 1) {
        claimRewards(item.slot);
      }
    });
  });

  const claimRewards = _.debounce(function(slot) {
    mod.command.message('Claiming ' + rewards[slot] + ' from TERA Club bar.');
    mod.send('C_PCBANGINVENTORY_USE_SLOT', 1, {
      slot: slot
    });
  }, 1000);
}
