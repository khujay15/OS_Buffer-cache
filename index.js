var Block;
var TotalBlock = new Array();
for (var i = 0; i < 20; i++) {
  TotalBlock.push({ number: i, state: "FREE" });
}

var freeList = new Array();
for (var i = 0; i < 20; i++) {
  freeList.push(i);
}

DrawBuffer(TotalBlock, freeList, 4);

document.addEventListener("change", function e() {
  DrawBuffer(TotalBlock, freeList, 4);
});

var myEvent = new CustomEvent("change");
// 시간 1초마다 출력
function printTime() {
  var clock = document.getElementById("clock");
  var now = new Date();
  clock.innerHTML =
    now.getHours() + "시 " + now.getMinutes() + "분 " + now.getSeconds() + "초";

  setTimeout("printTime()", 1000);
}
window.onload = function() {
  printTime();
};

var CreateButton = document.getElementById("requestBlock");
CreateButton.addEventListener("click", main);
var timeId = setInterval(OtherProcess, 7000);

function main(event) {
  var targetBlock = Number(document.getElementById("BlockIdx").value);
  if (targetBlock == -1) {
    clearInterval(timeId);
    return;
  }
  getblk(targetBlock);
}

function getblk(targetBlock, recursive) {
  var tgtIdx = -1;
  for (var i in TotalBlock) {
    if (TotalBlock[i].number == targetBlock) {
      tgtIdx = i;
      break;
    }
  }
  if (tgtIdx > -1) {
    /* Secenario #5 */
    if (
      TotalBlock[tgtIdx].state == "BUSY" ||
      TotalBlock[tgtIdx].state == "WRITE"
    ) {
      Message("Scenario #5 REQUEST BLOCK IS " + TotalBlock[tgtIdx].state);
      return;
      //waiting
    }
    /* Secenario #1 */
    Message("Scenario #1 START READING FREE BLOCK");
    var beforeState = TotalBlock[tgtIdx].state;
    TotalBlock[tgtIdx].state = "READ";

    setTimeout(function() {
      if (beforeState == "DELAY") TotalBlock[tgtIdx].state = "DELAY";
      else TotalBlock[tgtIdx].state = "FREE";
      if (freeList.findIndex(x => x === TotalBlock[tgtIdx].number) < 0)
        freeList.push(TotalBlock[tgtIdx].number);
      Message("Scenario #1 END READING FREE BLOCK");
      DrawBuffer(TotalBlock, freeList, 4);
    }, 1000);
  } else {
    /* Secenario #4 */
    if (freeList.length == 0) {
      Message("Scenario #4 NO FREE LIST AVAILABLE");
      return;
    }

    var freeIdx = TotalBlock.findIndex(x => x.number === Number(freeList[0]));
    /* Secenario #3 */
    if (TotalBlock[freeIdx].state == "DELAY") {
      Message("Scenario #3 WRITE BACK MARKED BLOCK ");
      for (var i in TotalBlock) {
        if (TotalBlock[i].state == "DELAY") {
          freeList.splice(freeList.indexOf(TotalBlock[i].number), 1);
          TotalBlock[i].state = "WRITE";
        }
      }
      if (freeList.length > 0) getblk(targetBlock, true);
      setTimeout(function() {
        for (var i in TotalBlock) {
          if (TotalBlock[i].state == "WRITE") {
            TotalBlock[i].state = "FREE";
            freeList.push(TotalBlock[i].number);
          }
        }
        Message("Scenario #3 WRITE END MARKED BLOCK ");

        DrawBuffer(TotalBlock, freeList, 4);
      }, 2000);
    } else if (TotalBlock[freeIdx].state == "FREE") {
      /* Secenario #2 */
      if (recursive) Message(" ㄴ>  NEW BLOCK: " + String(targetBlock));
      else Message("Scenario #2 NEW BLOCK: " + String(targetBlock));
      TotalBlock[freeIdx].number = targetBlock;
      freeList[0] = targetBlock;
    }
  }
  DrawBuffer(TotalBlock, freeList, 4);
}

function OtherProcess() {
  for (var i in TotalBlock) {
    if (TotalBlock[i].state == "BUSY") TotalBlock[i].state = "FREE";
  }

  var num = Math.floor(Math.random() * 27) + 3;
  if (num >= 20) num = 20;

  for (var i = 0; i < num; i++) {
    if (TotalBlock[i].state == "FREE") TotalBlock[i].state = "BUSY";
  }

  var delayIdx = Math.floor(Math.random() * num);
  TotalBlock[delayIdx].state = "DELAY";

  var tmp = new Array();
  for (var i in TotalBlock) {
    if (TotalBlock[i].state == "FREE" || TotalBlock[i].state == "DELAY")
      tmp.push(TotalBlock[i].number);
  }
  freeList = tmp;

  DrawBuffer(TotalBlock, freeList, 4);
}
