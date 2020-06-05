async function main() {
  // カメラやマイクの設定
  let localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  // videoタグ内に映像を送り込む
  $("#my-video").get(0).srcObject = localStream;

  // skywayのインスタンスを作成
  let peer = new Peer({
    key: "51af5899-2541-43dc-acff-95976dccb605",
  });

  // skywayでドメインを許可していれば実行される
  peer.on("open", () => {
    console.log("open! id=" + peer.id);
    $("#my-id").text(peer.id);
  });

  // Callボタンを押した時実行される
  $("#make-call").submit((e) => {
    e.preventDefault(); //画面遷移を防ぐ
    const callId = $("#callto-id").val(); //id入力欄の値を取得
    console.log("call! id=" + peer.id);
    const call = peer.call(callId, localStream); //id先を呼び出し
    addVideo(call);
  });

  // 相手から呼び出された実行される
  peer.on("call", (call) => {
    console.log("be called!");
    call.answer(localStream); //呼び出し相手に対して返す
    addVideo(call);
  });

  // 相手の映像を追加処理
  function addVideo(call) {
    call.on("stream", (theirStream) => {
      console.log("stream!");
      $("#their-video").get(0).srcObject = theirStream;
    });
  }
}

main();
