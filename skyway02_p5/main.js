function setup() {
  let capture = createCapture({ video: true, audio: false });
  capture.parent("video-area");

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
      let theirVideo = createVideo();
      theirVideo.parent("video-area");
      theirVideo.elt.autoplay = true;
      theirVideo.elt.srcObject = theirStream;
    });
  }
}
function draw() {}
