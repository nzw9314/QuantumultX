let obj = JSON.parse($response.body);
if (obj.data.sections) {
  for (var i = obj.data.sections.length - 1; i >= 0; i--) {
    if (obj.data.sections[i].sectionType == "AD") {
      obj.data.sections.splice(i, 1);
    }
  }
}
$done({ body: JSON.stringify(obj) });