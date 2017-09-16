'use strict'
const SERIES = require('../series')
exports.web = (args, res, next) => {
  /**
   * Web Player
   * Plays a Serie's episode or Movie using web browser (chrome)
   *
   * body Body Information about the serie or movie that needs to be played
   * no response value expected for this operation
   **/
  console.log(args)
  const playRequest = args.body.value
  // Try to find the serie by the provided name
  const serie = SERIES.find(s => s.triggers.indexOf(playRequest.name.toLowerCase()) >= 0)
  // If serie doesn't exist then return 404
  if (serie == null) { }
  // Get the location or URL of the media file
  serie.getVideo(playRequest.season, playRequest.episode)
    .then(video => {
      serie.player.play(video.url, serie.requiresVPN)
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(video))
    }).catch(err => {
      console.log(`Error while trying to get location for Season: ${serie}, Episode: ${playRequest.episode}`)
    })
}
