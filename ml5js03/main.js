let capture;
let uNet;
let segmentationImage;
let hawaiiImg;

function preload() {
  uNet = ml5.uNet("face");
  hawaiiImg = loadImage("hawaii.jpg");
}

function setup() {
  createCanvas(320, 240);
  capture = createCapture({ video: true, audio: false });
  capture.size(width, height);
  capture.hide();

  segmentationImage = createImage(width, height);

  uNet.segment(capture, gotResult);
  function gotResult(err, result) {
    segmentationImage = result.backgroundMask;
    uNet.segment(capture, gotResult);
  }
}

function draw() {
  // background(0);
  image(hawaiiImg, 0, 0, width, height);
  text("今日の天気は", 20, 20);

  image(segmentationImage, 0, 0, width, height);
}
