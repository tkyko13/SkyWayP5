let myColor;
let myCanvas;
let myStream;

function setup() {
  myCanvas = createCanvas(480, 320);
  myColor = color(random(255), random(255), random(255));
  background(myColor);

  // skywayのインスタンスを作成
  let peer = new Peer({
    key: "51af5899-2541-43dc-acff-95976dccb605",
  });
  // skywayでドメインを許可していれば実行される
  peer.on("open", () => {
    console.log("open! id=" + peer.id);
    createP("Your id: " + peer.id);
  });

  // id入力タグの生成
  let idInput = createInput("");

  // 送信ボタンの生成
  createButton("Call").mousePressed(() => {
    // ボタンが押されたら
    const callId = idInput.value(); //id入力欄の値を取得
    console.log("call! id=" + peer.id);
    const call = peer.call(callId, myStream); //id先を呼び出し
    setEventListener(call);
  });

  // // 相手から呼び出された実行される
  peer.on("call", (call) => {
    console.log("be called!");
    call.answer(myStream); //呼び出し相手に対して返す
    setEventListener(call);
  });

  // 相手の映像を追加処理
  function setEventListener(call) {
    call.on("stream", (theirStream) => {
      console.log("stream!");
      let theirVideo = createVideo();
      // theirVideo.parent("#video-area");
      theirVideo.elt.autoplay = true;
      theirVideo.elt.srcObject = theirStream;
    });
  }
}

function draw() {
  if (mouseIsPressed) {
    ellipse(mouseX, mouseY, 10, 10);
  }
}

let isFirstClick = true;
function mousePressed() {
  if (isFirstClick) {
    // 画面をマウスクリックした後じゃないと実行できない
    myStream = myCanvas.elt.captureStream(frameRate()); // 60
    isFirstClick = false;
  }
}
