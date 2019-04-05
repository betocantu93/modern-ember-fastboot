const spiders = [
	/bot/i,
	/spider/i,
	/facebookexternalhit/i,
	/simplepie/i,
	/yahooseeker/i,
	/embedly/i,
	/quora link preview/i,
	/outbrain/i,
	/vkshare/i,
	/monit/i,
	/Pingability/i,
	/Monitoring/i,
	/WinHttpRequest/i,
	/Apache-HttpClient/i,
	/getprismatic.com/i,
	/python-requests/i,
	/Twurly/i,
	/yandex/i,
	/browserproxy/i,
	/crawler/i,
	/Qwantify/i,
	/Yahoo! Slurp/i,
	/pinterest/i,
	/Tumblr\/14.0.835.186/i,
	/Tumblr Agent 14.0/i,
	/LinkedInBot/i,
	/Twitterbot/i,
	/WhatsApp/i
  ]
  
  function isSpider (ua) {
	return spiders.some(function (spider) {
	  return spider.test(ua)
	})
  }
  
  module.exports = {
	isSpider: isSpider,
  
	middleware: function () {
	  return function (req, res, next) {
		  console.log("USER AGENT: ", req.get('user-agent'), "IS SPIDER: ", isSpider(req.get('user-agent')));
		req.isSpider = isSpider.bind(undefined, req.get('user-agent'))
		next()
	  }
	}
  }