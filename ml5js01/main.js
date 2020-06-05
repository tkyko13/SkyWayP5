let capture;

//最初の一回だけ処理される
function setup() {
  createCanvas(800, 600);
  capture = createCapture({ video: true, audio: false });
  capture.hide();
}

//1秒間に60回処理される
function draw() {
  image(capture, 0, 0); //canvasに画像や映像を描画する処理

  let pix = capture.get(100, 100); //動画内のx:100,y:100の位置の色を取得
  fill(pix); //指定された色でグラフィックスを塗りつぶす
  ellipse(100, 100, 50, 50); //canvas内のx:100,y:100の位置に円を描く
}
