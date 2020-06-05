let capture;
let theirVideo;
let poses = [];
let theirPoses = [];

function setup() {
  createCanvas(640, 240); //canvas作成

  //自分用カメラ設定と姿勢検出
  capture = createCapture({ video: { width: 640, height: 480 }, audio: false });
  capture.hide(); //キャンバスで描くので非表示
  ml5.poseNet(capture).on("pose", (results) => {
    poses = results;
  });

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
      //相手のビデオを作成
      theirVideo = createVideo();
      theirVideo.elt.autoplay = true;
      theirVideo.elt.srcObject = theirStream;
      theirVideo.hide(); //キャンバスで描くので非表示

      //相手のビデオから姿勢検出
      ml5.poseNet(theirVideo).on("pose", (results) => {
        theirPoses = results;
      });
    });
  }
}

function draw() {
  //それぞれもしビデオの準備ができていたらキャンバスに半分の大きさで描く
  if (capture) image(capture, 0, 0, 320, 240);
  if (theirVideo) image(theirVideo, 320, 0, 320, 240);

  // 自分の鼻の位置を取得
  let myNosePos = getPartsPosition(poses, "nose");
  //相手の鼻の位置を取得
  let thNosePos = getPartsPosition(theirPoses, "nose");

  // 線で結ぶ
  // 半分の大きさにしたので、座標も半分に
  strokeWeight(10); //線の太さ
  stroke(0, 255, 0); //線の色 R,G,B
  line(
    myNosePos.x / 2,
    myNosePos.y / 2,
    thNosePos.x / 2 + 320,
    thNosePos.y / 2
  );
}

// 指定された名前の部位の座標を取得できる
function getPartsPosition(poses, partsName) {
  if (poses[0])
    for (let i = 0; i < poses[0].pose.keypoints.length; i++)
      if (poses[0].pose.keypoints[i].part == partsName)
        return poses[0].pose.keypoints[i].position;

  return { x: 0, y: 0 };
}
