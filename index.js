const Command = require('command')
const config = require('./config.json')
const _ = require('lodash')

module.exports = function ClubRewards(dispatch) {
  const command = Command(dispatch)

  const rewards = {
    3: "Dragon's Flame",
    6: "TERA Club Supplies"
  }

  let playerName
  let playerNames = config.names.slice()
  let isReady = false

  dispatch.hook('S_LOGIN', 10, (event) => {
    playerName = event.name
  })

  dispatch.hook('S_LOAD_TOPO', 3, (event) => {
    isReady = false
  })

  dispatch.hook('C_LOAD_TOPO_FIN', 1, (event) => {
    isReady = true
  })

  dispatch.hook('S_PCBANGINVENTORY_DATALIST', 1, (event) => {
    if (!playerNames.includes(playerName) || !isReady) return
    event.inventory.forEach(function(item, index) {
      if (rewards[item.slot] && item.amount == 1) {
        claimRewards(item.slot)
      }
    })
  })

  const claimRewards = _.debounce(function(slot) {
    command.message(' (Club-Rewards) Claiming ' + rewards[slot] + ' from TERA Club bar.')
    dispatch.send('C_PCBANGINVENTORY_USE_SLOT', 1, {
      slot: slot
    })
  }, 1000)
}
