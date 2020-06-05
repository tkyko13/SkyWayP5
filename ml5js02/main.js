let capture;
let poseNet;
let poses = [];

function setup() {
  createCanvas(800, 600);
  capture = createCapture({ video: true, audio: false });
  capture.hide();

  poseNet = ml5.poseNet(capture);
  poseNet.on("pose", (results) => {
    poses = results;
    console.log(poses);
  });
}

//1秒間に60回処理される
function draw() {
  image(capture, 0, 0); //canvasに画像や映像を描画する処理

  // 鼻の位置を取得
  // 他の部位の名前　https://github.com/tensorflow/tfjs-models/blob/master/posenet/README.md#keypoints
  let nosePos = getPartsPosition("nose");

  // 鼻の座標を取得するときはこんな感じで書きます
  console.log("鼻 x座標=" + nosePos.x + ", y座標=" + nosePos.y);

  // 試しに赤鼻に
  fill("#ff0000");
  ellipse(nosePos.x, nosePos.y, 50, 50);
}

function getPartsPosition(partsName) {
  if (poses[0])
    for (let i = 0; i < poses[0].pose.keypoints.length; i++)
      if (poses[0].pose.keypoints[i].part == partsName)
        return poses[0].pose.keypoints[i].position;

  return { x: 0, y: 0 };
}
