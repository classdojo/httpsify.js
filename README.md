Checks a given API endpoint to make sure it's not blocked by a network, and returns either a secure, or unsecure API url.


### Example

```javascript

var httpsify = require("httpsify");

httpsify("/api", "http://api.domain.com/api/", function (url) {
  console.log("https://api.domain.com/api");
});
```


### httpsify(okEndpoint, url, callback)
