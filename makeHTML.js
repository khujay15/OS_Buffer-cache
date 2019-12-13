var Palette = [
  "#ff0000",
  "#ff7f00",
  "#ffff00",
  "#00ff00",
  "#0000ff",
  "#4B0082",
  "#8b00ff",
  "#008080",
  "#808080",
  "#800000",
  "#FF7F50",
  "#FFA500",
  "#6B8E23"
];
function Message(Msg) {
  document.getElementById("RequestTable").innerHTML =
    document.getElementById("RequestTable").innerHTML +
    "<div>" +
    String(Msg) +
    "</div>";
}
function DrawBuffer(TotalBlock, FreeList, mod) {
  var ModArray = new Array();
  for (var m = 0; m < mod; m++) ModArray[m] = new Array();

  for (var i in TotalBlock) {
    idx = TotalBlock[i].number % mod;
    ModArray[idx].push(TotalBlock[i]);
  }

  var HTML = " ";
  for (var i in ModArray) {
    var head =
      '<div style="display: flex; flex-direction: row">' +
      '<span style="display:flex;justify-content:center;align-items:center;height: 100px; width: 150px;font-size:30px;border: 1px solid black;background-color:' +
      Palette[i] +
      ';">Mod ' +
      String(i) +
      "</span>";
    var body =
      '<div style="display:flex; flex-direction: row; align-items:center; justify-content:space-between; height:100px; width: 500px; margin-left: 100px; " >';
    for (var b in ModArray[i]) {
      if (ModArray[i][b].state == "DELAY") {
        body =
          body +
          '<span style="display:flex;width:60px;height:60px;justify-content:center;align-items:center;font-size:30px;border: 1px solid orange">' +
          String(ModArray[i][b].number) +
          '<span style="font-size: 10px">' +
          String(ModArray[i][b].state) +
          "</span> </span>";

        continue;
      }
      if (ModArray[i][b].state == "WRITE") {
        body =
          body +
          '<span style="display:flex;width:60px;height:60px;justify-content:center;align-items:center;font-size:30px;border: 1px solid #FF1493;background-color:#FF1493">' +
          String(ModArray[i][b].number) +
          '<span style="font-size: 10px">' +
          String(ModArray[i][b].state) +
          "</span> </span>";

        continue;
      }
      if (ModArray[i][b].state == "BUSY") {
        body =
          body +
          '<span style="display:flex;width:60px;height:60px;justify-content:center;align-items:center;font-size:30px;border: 1px solid #6B8E23;background-color:#6B8E23">' +
          String(ModArray[i][b].number) +
          '<span style="font-size: 10px">' +
          String(ModArray[i][b].state) +
          "</span> </span>";

        continue;
      }
      if (ModArray[i][b].state == "READ") {
        body =
          body +
          '<span style="display:flex;width:60px;height:60px;justify-content:center;align-items:center;font-size:30px;border: 1px solid black">' +
          String(ModArray[i][b].number) +
          '<span style="font-size: 10px">' +
          String(ModArray[i][b].state) +
          "</span> </span>";

        continue;
      }

      body =
        body +
        '<span style="display:flex;width:60px;height:60px;justify-content:center;align-items:center;font-size:30px;border: 1px solid black">' +
        String(ModArray[i][b].number) +
        "</span>";
    }
    body = body + "</div>";
    HTML = HTML + head + body + "</div>";
  }
  var freelist = '<div style="margin-top: 20px"> FreeList : [';

  for (var i in FreeList) {
    freelist = freelist + String(FreeList[i]) + ", ";
  }
  freelist = freelist + "]</div>";

  document.getElementById("BufferTable").innerHTML = HTML + freelist;
}
