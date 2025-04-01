# 作っているモノの紹介

最近作っているものを紹介したいと思います。

## 目で見る教科書 study - app

目で見て、直感的にわかるサブ教科書のようなものです。  
比例グラフや、フィボナッチ数列、積分の仕組み、パイコネ変換など、最近は「面白そうだな〜」というものを中心に作っています。  
~~全然、簡素なものしかできてませんが~~

反比例グラフ  
![グラフ写真](./2025-03-31/study_app_img.png)  
とか、

積分の仕組み  
![積分写真](./2025-03-31/study_app_img2.png)  
などです。

プログラム、プレビューは github にあげているので、よかったら見てください。

[プレビューリンク https://hiijii428.github.io/study_app](https://hiijii428.github.io/study_app)

機能?：

- いろいろグラフ表示
- 簡単なシュミュレーション
- ミニゲーム？
- TODO リスト
- 音楽プレイヤー

使用している js

- math.html グラフ描画 :
  - Chart.js
- todo.html TODO リスト :
  - Muuri.js
  - Web-anmations.js
  - Hammer.js
- 一部
  - Jquery

## ESP32 と ILI9341 のニュース電光掲示板

WiFi が使えるマイコンと ILI9341 ドライバー 2.8 インチ TFT 液晶を使ったヤホーニュースと NHK ニュースの電光掲示板。  
主に、mgo-tec さんのプログラムを使用しました。  
参考にしたサイト:

- [M5Stack と ESP32 のボタンで記事を選択できる Yahoo News 電光掲示板 天気予報 Watch](https://www.mgo-tec.com/blog-entry-select-box-news-m5stack-esp32.html)
- [ESP32 の Wi-Fi アクセスポイントをスマホで選択できるようにしてみた
  ](https://www.mgo-tec.com/blog-entry-esp32-wifi-ap-selector-arduino.html)

**mgo-tec さん、ありがとう！ [mgo-tec さんのブログ](https://www.mgo-tec.com)**

AE-KIT45-KEYPAD4X3 を使い、ボタンで、ニュースの見方を変えれるようにしています。  
また、WIFI 設定は、SD カードに保存し、WIFI が繋がらなかったら、スマホから WIFI 設定できるようにしました。  
WIFI が繋がったら、loop 関数を呼び出し実行というふうにしました。

<details>
<summary>
<span style="background-color:#8fa;padding:5px;border-radius:5px;">余談: arduinoIDE の loop 関数は、単体で呼び出しただけでもループすることを発見！</span>
</summary>
よく、
<pre><code>
void setup(){
    /*起動時に実行する関数*/
}
void loop(){
    /*ずーとループする関数*/
}
</code></pre>

を C 言語で表すと

<pre><code>
void main(){
    setup();
    while(true){
        loop();
    }
}
</code></pre>

とよく言われるが、実際は、

<pre><code>
void loop(){
/*    while(true){      /*ここに隠しwhileがあるのでは？*/
        Serial.println("Hello!");
        delay(1000);
/*    }*/
}
</code></pre>

なのかな？

</details>

起動したとこ  
<img src="./2025-03-31/news_esp32_display_top.JPG" alt="ディスプレイ TOPの画像" width="50%">

ボタン１：ニュースをスクロールで  
<img src="./2025-03-31/news_esp32_display_1.JPG" alt="ディスプレイ スクロールの画像" width="50%">

ボタン２：ニュースをリスト表示  
<img src="./2025-03-31/news_esp32_display_list.JPG" alt="ディスプレイ リストの画像" width="50%">

ボタン３：ニュースの詳細を見る(NHK のみ) タイトルはスクロール  
<img src="./2025-03-31/news_esp32_display_description.JPG" alt="ディスプレイ ニュース詳細の画像" width="50%">

というふうになります。
github にはあげてませんが、気が向いたらあげるかな？

### おわりに

ここまでみてくれてありがとうございます。
まだまだ初心者ですし、github などのツールも使いたてで作品数も少ないですが、応援してくれたら幸いです。

お問い合わせなどは、[フォーム](http://localhost:5500/blog/form.html)から。
