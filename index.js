const Command = require('command')
const config = require('./config.json')

module.exports = function ClubRewards(dispatch) {
  const command = Command(dispatch)

  let playerNames = config.names.slice()
  let delay = config.delay
  let flame = false
  let supply = false

  dispatch.hook('S_LOGIN', 9, event => {
    if (playerNames.includes(event.name)) {
      checkRewards()
      claimRewards()
    }
  })

  function checkRewards() {
    dispatch.hookOnce('S_PCBANGINVENTORY_DATALIST', 1, event => {
      if (event.inventory[3].amount == 1) {
        flame = true
      } else {
        flame = false
      }
      if (event.inventory[6].amount == 1) {
        supply = true
      } else {
        supply = false
      }
    })
  }

  function claimRewards() {
    dispatch.hookOnce('C_LOAD_TOPO_FIN', 1, event => {
      setTimeout(function() {
        if (flame) {
          command.message(' (Club-Rewards) Claiming Dragon\'s Flame from TERA Club bar.')
          dispatch.toServer('C_PCBANGINVENTORY_USE_SLOT', 1, {
            slot: 3
          })
        } else {
          command.message(' (Club-Rewards) Dragon\'s Flame has been claimed already.')
        }
        if (supply) {
          command.message(' (Club-Rewards) Claiming TERA Supplies from TERA Club bar.')
          dispatch.toServer('C_PCBANGINVENTORY_USE_SLOT', 1, {
            slot: 6
          })
        } else {
          command.message(' (Club-Rewards) TERA Club Supplies has been claimed already.')
        }
      }, delay)
    })
  }
}
