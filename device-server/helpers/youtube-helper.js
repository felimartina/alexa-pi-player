const rp = require('request-promise')
const PLAYER_API_YOUTUBE_API_KEY = process.env.PLAYER_API_YOUTUBE_API_KEY
const RESULTS_PER_PAGE = 50 // Max allowed by this endpoint is 50 records per page
const YOUTUBE_API_LIST_ITEMS_URL = 'https://content.googleapis.com/youtube/v3/playlistItems?maxResults=###RESULTS_PER_PAGE###&part=snippet&playlistId=###LIST_ID###&key=###YOUTUBE_API_KEY###'

module.exports.getVideoFromList = (listId, titleRegex) => {
  const uri = YOUTUBE_API_LIST_ITEMS_URL
    .replace('###RESULTS_PER_PAGE###', RESULTS_PER_PAGE)
    .replace('###YOUTUBE_API_KEY###', PLAYER_API_YOUTUBE_API_KEY)
    .replace('###LIST_ID###', listId)
  // Read the List and try to find video by the provided regex
  return rp({ uri: uri, json: true }).then(results => {
    if (!results.items || results.items.length <= 0) throw new Error('Youtube list looks empty')
    const regex = new RegExp(titleRegex, 'i')
    const video = results.items.find(v => regex.test(v.snippet.title))
    if (!video) console.log('Video not found...shall we read the next page?') // TODO - Read the whole list, not just the first page
    console.log(video)
    const videoId = video.snippet.resourceId.videoId
    return {
      videoid: videoId,
      url: module.exports.getVideoURL(videoId),
      title: video.snippet.title,
      description: video.snippet.description
    }
  }).catch(err => {
    console.log(err)
    throw new Error('There was an error trying to find the given episode.')
  })
}

module.exports.getVideoURL = (videoId) => {
  const YOUTUBE_VIDEO_URL = 'https://www.youtube.com/embed/###VIDEO_ID###?rel=0&autoplay=1'
  return YOUTUBE_VIDEO_URL.replace('###VIDEO_ID###', videoId)
}
