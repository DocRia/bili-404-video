var filter = { urls: ['<all_urls>'] }
var extraInfoSpec = ['responseHeaders']
var urlList = [] // 记录翻过的页码
var monthMap = new Map([
  ['Jan', '01'],
  ['Feb', '02'],
  ['Mar', '03'],
  ['Apr', '04'],
  ['May', '05'],
  ['Jun', '06'],
  ['Jul', '07'],
  ['Aug', '08'],
  ['Sep', '09'],
  ['Oct', '10'],
  ['Nov', '11'],
  ['Dec', '12']
])

async function getCensoredVideoList(url) {
  const response = await fetch(url);
  const jsonData = await response.json();
  for (const video of jsonData.data.medias) {
    if (video.title === '已失效视频') {
      const videoDate = new Date(video.ctime * 1000) // 毫秒
      const dateArr = String(videoDate).split(' ')
      console.log( `${dateArr[3]}-${monthMap.get(dateArr[1])}-${dateArr[2]}`);
      console.log(video.intro);
      console.log(`UP: ${video.upper.name} (${video.upper.mid})`);
      console.log('====================');
    }
  }
}
chrome.webRequest.onCompleted.addListener(function(details){
  if(details.url.indexOf('https://api.bilibili.com/x/v3/fav/resource/list') !== -1) {
    // 每页只请求一次
    if (!urlList.includes(details.url)) {
      urlList.push(details.url)
      getCensoredVideoList(details.url)
    }
  }
}, filter, extraInfoSpec)

console.log('插件已加载')