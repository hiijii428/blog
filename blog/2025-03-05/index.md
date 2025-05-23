## Ollama で家に AI を設置する

パソコンでの機械学習にハマっていた頃に、Ollama というツールがあることを知ったので、書き記しておきます。

### Ollama とは？

簡単に言うと、対話型 AI（チャット GPT とかのあれ）をパソコンにインストールできるツールです。

- メリット
  - パソコン内にインストールするため、情報漏洩のリスクがない
  - 自分でモデルの変更などのカスタムができる
- デメリット
  - 使用するパソコンのスペックによって性能の差が出る。

### 環境

- PC : raspberry pi 4
- RAM : 4GB
- IP adress : 192.168.11.2

### Ollama のインストール

[Ollama のダウンロードページ](https://ollama.com/download)からインストール

- Linux
  `curl -fsSL https://ollama.com/install.sh | sh`を実行
- Mac
  zip をダウンロード
- windows
  Exe ファイルをダウンロードして実行

### Ollama を使ってみよう！

1. [Ollama のモデル検索のページ](https://ollama.com/search)から試したいモデルを選びます。
2. パソコンからターミナル（windows はコマンドプロンプト）を開き、`ollama run [モデル名] ` を実行したら
3. すると、モデルのダウンロードが始まり、ダウンロードが終わると、会話プロンプトが表示されて、会話することができます。
   例：`ollama run qwen2.5-coder:1.5b`の実行結果
   ![](./2025-03-05/ollama_prompt_test.png)

### Ollama のちょっと工夫した使い方 1 - API

Ollama には API があって、アプリや、別のパソコンから使用することができます。
API を使ってみましょう！
ターミナルで以下を実行してください。

```
curl http://localhost:11434/api/generate -X POST -d '{
    "model": "モデル名",
    "prompt": "こんにちは！"
}'
```

実行すると、JSON データがいくつも届きます。
このなかには

- 生成に使用したモデル名
- 送信した時間
- 本文（文節ごとに送られる）
  などのデータが入っています
  詳しくは[github の api.md](https://github.com/ollama/ollama/blob/main/docs/api.md)に記載してあります。

python を用いると、データを自由自在に表示することができます。以下は、JSON データから本文を抜き出し、表示するプログラムです。
`pip install ollama`

```
import ollama
stream = ollama.chat(
    model='モデル名',
    messages=[{'role': 'user', 'content': 'こんにちは！'}],
    stream=True,
)
for chunk in stream:
    print(chunk['message']['content'], end='', flush=True)
```

また、API は POST 通信なので python の requests でも使用することができます。

### Ollama のちょっと工夫した使い方 2 API を外部から使う

ollama の API は、ローカルネットワークの別の端末から呼び出すことができます。
ただ、初期設定では、外部アクセスはできないようになっているので、設定を変更します。
`sudo systemctl edit ollama`
などで、ollama の設定ファイルに以下を記述します。

```
[Service]
Environment="OLLAMA_HOST=0.0.0.0"
Environment="OLLAMA_ORIGINS=*"
```

この 3 行を記述することで、外部から**11434 ポート**でアクセスすることができます。
またファイヤーウォールを設定している場合は、11434 ポートを開放しましょう。
`bash sudo ufw allow 11434`
これで API サーバーを立てて外部からも使えるようになりました！
私の場合は、apache2 で WEB サーバーを立てて、自作ウェブ ollama を使用しています。

<!-- <img src="./2025-03-05/ollama_client.png" width="100%"> -->

![](./2025-03-05/ollama_client.png)  
誰にでも使ってほしいので、ここにコードを載せておきます。
使用する際は、コードに、出典元を記載してくれると嬉しいです。

<details><summary>html</summary>
    <pre><code>
        &lt;script src=&quot;https://js.cybozu.com/markedjs/v4.0.12/marked.min.js&quot;&gt;&lt;/script&gt;
        &lt;script src=&quot;https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js&quot;&gt;&lt;/script&gt;
        &lt;link rel=&quot;stylesheet&quot; href=&quot;https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css&quot;&gt;
        &lt;script src=&quot;https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js&quot;&gt;&lt;/script&gt;
        <div class="top_div">
            <h1 class="h1_title">Web版Ollama AI</h1>
            <p>OllamaというAIをWEBでも使ってみよう！</p>
            <div id="server-status" >AIサーバーステータス:確認中...</div>
        </div>
        <div class="information">
            <p>画面下の入力欄からAIにメッセージや質問を送ってみましょう。</p>
        </div>
        <div class="form">
            <form onsubmit="click_send();event.preventDefault(); sendQuestion();" id="form">
            <textarea class="input" type="text" size="40px" id="question" placeholder="AIに質問をしてみよう！ enterで送信" required></textarea>
            <button type="submit" onclick ="" id ="send_button" >↑</button><br>
            <a id='file_download' class='download_button' download='ollama_AI.txt' href="" charset="utf-8" hreflang="ja">save</a>
            <label for="models">AI変更:
            <select id="models" name="models">
            <!--jsでモデルを追加-->
            </select></label>
        </form>
        </div>
        <div id="prompt">
        </div>
        <!--
        作成者Hiijii428
        https://github.com/hiijii428
        -->

</code></pre>

</details>
<details><summary>css</summary>
<pre><code>
    body {
        font-family: sans-serif;
    }
    hr{
        border: 1px solid #888;
    }
    .h1_title{
        margin-top:3px;
    }
    .response , .you{
        border: 0.5px;
        border-style: solid;
        padding:10px;
        padding-left: 15px;
        margin:10px;
    }
    .response{
        width:60%;
        border-radius: 0px 20px 20px 20px;
        background-color:#fdbdff;
        border-color: #fa6bff;
    }
    .you{
        width:40%;
        border-radius: 20px 0px 20px 20px;
        border-color:#0e62ff;
        background-color: #7091ff;
        margin-right: 0;
        margin-left: auto;
    }
    .top_div{
        width:99%;
        min-height:100px;
        background-color:#048;
        color:#fff;
        border-radius: 10px;
        padding: 5px;
    }
    .input{
        width: 85%;
        border-radius: 10px;
        border-color: rgb(97, 165, 255);
        border-style: solid;
        background-color: rgb(196, 233, 255);
        padding-block: 10px;
        padding-inline: 5px;
        margin-inline: auto;
    }
    button{
        border-radius: 10px;
        border-color:#0e62ff;
        border-style: solid;
        background-color: #7091ff;
        padding-block: 5px;
        padding-inline: 5px;
        color:#000;
    }
    form{width: 99%;}
    .form{
        text-align: center;
        position: fixed;
        bottom:10px;
        width: 99%;
        border-color:#aaa;
        border-radius:10px;
    }
    .input:disabled ,button:disabled{
        background-color:#888;
        border-color:#333;
        color:#000;
        opacity:1;
    }
    .information{
        width: 99%;
        text-align: center;
        background-color: #ccc;
        border-radius: 10px;
        padding: 2px;
    }
    .information p{
        margin:0px;
    }
    .download_button{
        background-color: rgb(0, 128, 255);
        color: #fff;
        border-radius: 5px;
        text-decoration: none;
    }
    code{
        border-radius: 5px;
        background-color: #133;
        color: #fff;
        padding: 3px 1.5px;
        margin: 3px;
    }
    pre code{
        border-radius: 10px;
    }
    .code_name{
        color: #fff;
        background-color: #5e6060;
        border-radius: 0px 0px 5px 5px;
        padding: 5px 10px;
        margin: 0px 5px 5px 5px;
        Width: fit-content;
        position: relative;
        top: -15px;
    }

    ::-webkit-scrollbar-track {
    background-color: #5e6060;
    }
    ::-webkit-scrollbar-thumb {
    background: none;
    }
    /*
    作成者Hiijii428
    https://github.com/hiijii428
    */

</code></pre>

</details>
<details><summary>javascript</summary>
<pre><code>
    var server_home ='サーバーのURL';
    var api_model ='gemma2:2b';

    function digit2(num){
        return ("000"+num).slice(-2);
    }

    file_download.onclick = () => {
        let old_you = document.getElementsByClassName("you")[0];
        old_you = old_you.textContet;
        console.log("old_you="+old_you)
        var dd = new Date();
        var YYYY = dd.getFullYear();
        var MM = digit2(dd.getMonth()+1);
        var DD = digit2(dd.getDate());
        var hh = digit2(dd.getHours());
        var mm = digit2(dd.getMinutes());
        var ss = digit2(dd.getSeconds());
        let file_name = YYYY+"-"+MM+"-"+DD+"--"+hh+"-"+mm+"-"+ss;
    //	file_name=old_you;
        let content_date = YYYY+"/"+MM+"/"+DD+" "+hh+":"+mm+":"+ss
        let filename_input = window.prompt("ファイルの名前を入力してください。 (入力内容-ollama_AI.txt)",file_name);
        if(!filename_input){filename_input = file_name;}
        file_download.download = filename_input+"-ollama_AI.txt";
        // blob オブジェクトを生成
        var blob = new Blob([content_date+"\n\n"+file_copy_message], {type:'text/plain'});
        // download の href に object url を設定
        file_download.href = window.URL.createObjectURL(blob);

    };


    //二重送信対策(サーバーの気持ちになって)
    function click_send(){
        let send_b = document.getElementById('send_button');
        send_b.disabled =true;
        let send_i = document.getElementById('question');
        send_i.disabled =true;
    }
    function all_responced(){
        let send_b = document.getElementById('send_button');
        send_b.disabled =false;
        let send_i = document.getElementById('question');
        send_i.disabled =false;
    }

    //server check
    async function checkServerStatus() {
        const statusDiv = document.getElementById('server-status');
        try {
            const response = await fetch(server_home);
            if (response) {
                statusDiv.innerText = 'AIサーバステータス：起動中';
                model_select();
            } else {
                statusDiv.innerText = 'AIサーバステータス：サーバ接続失敗';
                if (server_home ==="http://iijima-vaio-server.local:11434/"){
                    server_home="http://192.168.11.60:11434/";
                    checkServerStatus();
                }
            }
        } catch (error) {
            statusDiv.innerText = 'AIサーバステータス：サーバの接続エラー';
            if (server_home ==="http://iijima-vaio-server.local:11434/"){
                    server_home="http://192.168.11.60:11434/";
                    checkServerStatus();
            }
        }
    }
    function s2hms(s_time){
        h = Math.floor(s_time/(60*60));
        m = Math.floor(s_time/60)-60*h;
        s = Math.floor(s_time-(60*60*h)-(m*60));
        return String(h)+"時間"+String(m)+"分"+String(s)+"秒";
    }
    function code_title(){
        let elm = document.getElementsByTagName("code");
        for(let i=0;i<elm.length;i++){
            let now_elm = elm[i]
            let code_name = now_elm.className.replace("language-","").replace(" hljs","");
            if(code_name){
                if(code_name==="cpp"){code_name="c++";}
                if(code_name==="csharp"){code_name="C#";}
                let code_name_html = "<div class='code_name'>"+code_name+"</div>";
                now_elm.innerHTML = code_name_html + now_elm.innerHTML.replace(code_name_html,"");
            }
        }
    }
    let model_list;
    let html="";
    default_model="gemma2:2b"
    function model_select(){
    console.log("server_home="+server_home)
        $.ajax({
            type: 'GET',
            url: server_home+"api/tags",
            success: function(data) {
                console.log(data);
                model_list=data
                model_list = model_list["models"];
                for(let m=0;m<model_list.length;m++){
                    var tool=""
                    let model = model_list[m]["name"]
                    let size = String((model_list[m]["size"]/1000000000).toFixed(2))+"GB"
                    console.log(model+"("+size+")")
                    if (model==default_model){tool="selected"}
                    html+="<option value=\'"+model+"\' "+tool+">"+model+"</option>";
                    document.getElementById("models").innerHTML=html;
                }
            }
        });
    }
    var message_content=[]
    var file_copy_message=""
    message_content.push({role: "system",content: "あなたは親切なアシスタントです。日本語で答えてくれます。"})
    function bottom_scroll(){
        var elm = document.documentElement;
        // scrollHeight ページの高さ clientHeight ブラウザの高さ
        var bottom = elm.scrollHeight - elm.clientHeight;
        //console.log(bottom)
        window.scroll(0, bottom);
    }


    //send question
    async function sendQuestion() {
        api_model = document.getElementById("models").value
        // sv-SEロケールはYYYY-MM-DD形式の日付文字列を戻す
        var now = new Date().toLocaleDateString('sv-SE')
        file_download.download = now+"-ollama_AI.txt"
        // blob オブジェクトを生成
        var blob = new Blob([file_copy_message], { type: 'text/plain' });
        // download の href に object url を設定
        file_download.href = window.URL.createObjectURL(blob);


        //id名にnowがあるものを現在のプロンプトとするため、id名を一括削除
        const old_you = document.getElementsByClassName("you");
        for(let i = 0; i < old_you.length; i++) {
            old_you[i].id=""
        }
        const old_response = document.getElementsByClassName("response");
        for(let i = 0; i < old_response.length; i++) {
            old_response[i].id=""
        }
        //新しくメッセージdivを作成
        const prompt = document.getElementById("prompt");
        const new_you = document.createElement("div");
        new_you.id="now_you"
        new_you.classList.add('you');
        prompt.appendChild(new_you)

        const new_response = document.createElement("div");
        new_response.id="now_response"
        new_response.classList.add('response');
        prompt.appendChild(new_response)


        let question = document.getElementById('question').value;
        const you = document.getElementById('now_you');
        you.innerText = question;
        file_copy_message+="\n-------------------\nあなた:\n"+question+"\n-------------------\n";
        const responseDiv = document.getElementById('now_response');
        responseDiv.innerHTML = '<p>考え中...</p>';
        bottom_scroll();
        message_content.push({role: "user",content: question})
        console.log(message_content)
        try {
            const response = await fetch(server_home + 'api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    model: api_model,
                    messages: message_content,
                })
            });
            if (!response.ok) {
                throw new Error('レスポンスがありません');
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let result = '';
            let done = false;
            responseDiv.innerText = ''; //レスポンス領域を削除
            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                result += decoder.decode(value, { stream: true });
                // Split the stream data by new lines to get individual JSON objects
                const parts = result.split('\n').filter(part => part.trim());
                str = "";
                for (let part of parts) {
                    try {
                        const jsonResponse = JSON.parse(part);
                        //一文字づつ返ってくるので、表示用のレスポンスを作成
                        var html="";
                        if (jsonResponse.message) {
                            str += jsonResponse.message["content"];
                            str.replace(" - ","-");
                            str.replace("- ","\n-");
                            html = marked.parse(str);
                            //console.log(html);
                            responseDiv.innerHTML = html;
                            hljs.initHighlightingOnLoad();
                            bottom_scroll();
                        }
                        if (jsonResponse.done) {
                            hljs.initHighlightingOnLoad();
                            message_content.push({role: "assistant",content: str})
                            file_copy_message+="\n-------------------\n\nAI:モデル名:"+api_model+"\n\n"+str+"\n-------------------\n";

                            let total_time = s2hms(jsonResponse["total_duration"]/1000000000);	//total
                            let load_time = s2hms(jsonResponse["load_duration"]/1000000000);	//model load
                            let prompt_time = s2hms(jsonResponse["prompt_eval_duration"]/1000000000);	//prompt load
                            let eval_time = jsonResponse["eval_duration"]/1000000000;	//prompt eval
                            let eval_count_token = jsonResponse["eval_count"];
                            let s_eval = (eval_count_token/eval_time).toFixed(3);
                            eval_time=s2hms(eval_time)
                            html+="<br><br>合計時間:"+total_time+"<br>　AI読み込み:"+load_time+"<br>　文章読み込み:"+prompt_time+"<br>　文章生成:"+eval_time+"<br>"+String(s_eval)+"トークン/秒";
                            //console.log(str)
                            responseDiv.innerHTML=html;
                            done = true;
                            bottom_scroll();
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }
                responseDiv.innerHTML = html;
                hljs.initHighlightingOnLoad();
                bottom_scroll();
                code_title();
            }
            all_responced();
        } catch (error) {
            responseDiv.innerHTML += '<br>エラー: ' + error.message;
            all_responced();
        }
    }

    checkServerStatus();
    /*
    作成者Hiijii428
    https://github.com/hiijii428
    */

</code></pre>

</details>

上記コードを作るのに参考にしたサイト
[https://tansunohazama.sakura.ne.jp/wordpress/%e3%80%90api%e3%80%91%e3%83%ad%e3%83%bc%e3%82%ab%e3%83%abollama%e7%94%a8%e3%81%ae%e3%83%95%e3%83%ad%e3%83%b3%e3%83%88%e3%83%9a%e3%83%bc%e3%82%b8%e4%bd%9c%e6%88%90/](https://tansunohazama.sakura.ne.jp/wordpress/%e3%80%90api%e3%80%91%e3%83%ad%e3%83%bc%e3%82%ab%e3%83%abollama%e7%94%a8%e3%81%ae%e3%83%95%e3%83%ad%e3%83%b3%e3%83%88%e3%83%9a%e3%83%bc%e3%82%b8%e4%bd%9c%e6%88%90/)  
[https://www.nxted.co.jp/blog/blog_detail?id=1](https://www.nxted.co.jp/blog/blog_detail?id=1)  
[https://qiita.com/tadnakam/items/99088d78512a20e75ff3](https://qiita.com/tadnakam/items/99088d78512a20e75ff3)

### まとめ

- アカウントとかなくても AI を使える
- Ollama でパソコンに AI をつくることができる
- 情報漏洩がないため安心
- API サーバーを立てて外部から AI を使うことができる。
  **結構便利！**
