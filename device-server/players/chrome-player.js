const execSync = require('child_process').execSync
const exec = require('child_process').exec
const VPN = {
  name: '3XM VPN',
  user: 'felipe.martina',
  pass: 'aloha2017'
}
module.exports.play = (url, requiresVPN) => {
  if (requiresVPN === true) {
    // Connect to the VPN
    execSync(`rasdial "${VPN.name}" ${VPN.user} ${VPN.pass}`)
  } else {
    // Disconnect from the VPN so we speed up the streaming
    execSync(`rasdial "${VPN.name}" /disconnect`)
  }
  // We can execute chrome async...we just needed the vpn connection to be sync'ed
  exec(`start chrome "${url}"`).on('error', (code) => {
    console.log(`Error when trying to play the following URL ${url}`)
  })
}
