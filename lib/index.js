var Url = require("url"),
sa      = require("superagent"),
memoize = require("memoize");

/**
 */

module.exports = function (okUrl, reqUrl, complete) {
  var urls = fixUrls(okUrl, reqUrl);
  checkSSLSupport(urls.okUrl, function (useSSL) {
    complete(urls.reqUrl.replace(/^https?/, useSSL ? "https" : "http"), useSSL);
  });
};

/**
 */

var checkSSLSupport = function (okUrl, complete) {
  sa.
  get(okUrl).
  end(function (err, response) {
    if (err || !/^20/.test(String(response.status))) {
      return complete(false);
    } else {
      return complete(true);
    }
  });
};

if (process.browser) {
  checkSSLSupport = memoize(checkSSLSupport);
}

/**
 */

function fixUrls (okUrl, reqUrl) {

  var okUrlParts = Url.parse(okUrl),
  reqUrlParts    = Url.parse(reqUrl);

  // make it ssl - need the check
  okUrlParts.protocol = "https:"

  // sync them up
  for (var key in okUrlParts) {
    okUrlParts[key] = okUrlParts[key] || reqUrlParts[key];
    reqUrlParts[key] = reqUrlParts[key] || okUrlParts[key];
  }

  okUrlParts.query = okUrlParts.hash = okUrlParts.search = void 0;

  return {
    okUrl: Url.format(okUrlParts),
    reqUrl: Url.format(reqUrlParts)
  };
}