const path1 = "channel";
const path2 = "get_movie_info";

if ($request.method != "OPTIONS") {
  if ($request.url.indexOf(path1) != -1) {
    banner();
  } else if ($request.url.indexOf(path2) != -1) {
    movie();
  }
} else {
  $done({});
}

function banner() {
  let obj = JSON.parse($response.body);
  if (obj.data.sections) {
    for (var i = obj.data.sections.length - 1; i >= 0; i--) {
      if (obj.data.sections[i].sectionType === "AD") {
        obj.data.sections.splice(i, 1);
      }
    }
  }
  $done({ body: JSON.stringify(obj) });
}

function movie() {
  let obj = JSON.parse($response.body);
  obj.data.m3u8.openingLength = obj.data.m3u8.startingLength;
  $done({ body: JSON.stringify(obj) });
}