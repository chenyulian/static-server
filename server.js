var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];

if (!port) {
  console.log("请指定端口号，例如：\nnode server.js 8888 ");
  process.exit(1);
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true);
  var pathWithQuery = request.url;
  var queryString = "";
  if (pathWithQuery.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }
  var path = parsedUrl.pathname;
  var query = parsedUrl.query;
  var method = request.method;

  console.log("收到请求，请求路径（带查询参数）为：" + pathWithQuery);

  response.statusCode = 200;

  const fileTypeSet = {
    ".css": "text/css",
    ".js": "text/javascript",
    ".html": "text/html",
    ".json": "application/json",
  };
  const filePath = path === "/" ? "/index.html" : path;
  const suffix = filePath.substring(filePath.lastIndexOf("."));

  response.setHeader("Content-Type", `${fileTypeSet[suffix]};charset=utf-8`);

  let content;
  try {
    content = fs.readFileSync(`public${filePath}`).toString();
  } catch (error) {
    response.statusCode = 404;
    content = "您请求的文件找不到";
  }

  response.write(content);
  response.end();
});

server.listen(port);
console.log("监听 " + port + " 成功\n请用浏览器打开 http://localhost:" + port);
