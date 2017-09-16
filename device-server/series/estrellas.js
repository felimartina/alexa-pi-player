const youtubeHelper = require('../helpers/youtube-helper')
module.exports = {
  name: 'Las Estrellas',
  // MUST BE IN LOWER CASE
  triggers: ['las estrellas', 'las estreias', 'stars', 'starts', 'estrellas', 'estreias', 'streias'],
  getVideo: (season, episode) => {
    const youtubeListId = 'PLR-KmoQEdAFMEkXdQd6hwOlNyrqRHNyeU&index'
    const regexForTitle = `cap[i|í]tulo[\\s]*(${episode})[\\D]*\\"(.*)\\"` // ie. Las Estrellas - Capítulo 56: "¿Nace una nueva estrella?"
    return youtubeHelper.getVideoFromList(youtubeListId, regexForTitle)
  },
  requiresVPN: true,
  player: require('../players/chrome-player')
}
