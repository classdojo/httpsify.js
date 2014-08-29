var Url = require("url"),
sa      = require("superagent"),
async = require("async"),
hurryup = require("hurryup");

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

  hurryup(function (complete) {
    sa.
    get(okUrl).
    end(function (err, response) {
      if (err || !/^20/.test(String(response.status))) {
        return complete(void 0, false);
      } else {
        return complete(void 0, true);
      }
    });
  }, 1000 * 8).call(void 0, function (err, supportsSSL) {
    complete(!err && supportsSSL);
  });
  
};

if (process.browser) {
  checkSSLSupport = async.memoize(checkSSLSupport);
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
