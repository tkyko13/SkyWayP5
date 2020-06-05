async function main() {
  // カメラやマイクの設定
  let localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  // videoタグ内に映像を送り込む
  $("#my-video").get(0).srcObject = localStream;
}

main();

// カメラやマイクの設定
// navigator.mediaDevices
//   .getUserMedia({
//     video: { width: 640, height: 480 },
//     audio: false,
//   })
//   .then(function (stream) {
//     // 「許可」を押し、カメラやマイクの取得に成功したら
//     console.log(stream);
//     $("#my-video").get(0).srcObject = stream;
//     console.log("success2");
//     // localStream = stream;
//   })
//   .catch(function (error) {
//     // Error
//     console.error("mediaDevice.getUserMedia() error:", error);
//     return;
//   });
