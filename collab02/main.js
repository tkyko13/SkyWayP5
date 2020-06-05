let capture;
let theirVideo;
let uNet;
let mySegmentImg;
let thSegmentImg;
let hawaiiImg;

function preload() {
  uNet = ml5.uNet("face");
  hawaiiImg = loadImage("hawaii.jpg");
}

function setup() {
  createCanvas(640, 480); //canvas作成

  //自分用カメラ設定と背景透過画像の取得
  capture = createCapture({ video: { width: 640, height: 480 }, audio: false });
  capture.hide(); //キャンバスで描くので非表示
  mySegmentImg = createImage(640, 480);
  uNet.segment(capture, gotResult);
  function gotResult(err, result) {
    if (result) {
      mySegmentImg = result.backgroundMask;
    }
    uNet.segment(capture, gotResult);
  }

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
    console.log("call! id=" + callId);
    const call = peer.call(callId, capture.elt.srcObject); //id先を呼び出し
    addVideo(call);
  });

  // // 相手から呼び出された実行される
  peer.on("call", (call) => {
    console.log("be called!");
    call.answer(capture.elt.srcObject); //呼び出し相手に対して返す
    addVideo(call);
  });

  // 相手の映像を追加処理
  function addVideo(call) {
    call.on("stream", (theirStream) => {
      console.log("stream!");
      //相手のビデオを作成
      theirVideo = createVideo();
      theirVideo.elt.autoplay = true;
      theirVideo.elt.srcObject = theirStream;
      theirVideo.hide(); //キャンバスで描くので非表示

      //相手ビデオから背景透過画像の取得
      thSegmentImg = createImage(640, 480);
      uNet.segment(theirVideo, gotResult);
      function gotResult(err, result) {
        if (result) {
          thSegmentImg = result.backgroundMask;
        }
        uNet.segment(theirVideo, gotResult);
      }
    });
  }
}

function draw() {
  // background(255);
  image(hawaiiImg, 0, 0, 640, 480);
  //それぞれもしビデオの準備ができていたらキャンバスに半分の大きさで描く
  image(mySegmentImg, mouseX, mouseY, 320, 240);
  if (thSegmentImg) image(thSegmentImg, 0, 0, 320, 240);
}
