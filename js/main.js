$.ajax({
	type: 'GET',
    // 取得したいページのアドレス
	url: 'https://hiijii428.github.io/blog/side.html',
	success: function (data) {
		console.log(data);
        document.querySelector("#nav").innerHTML = data;
	}
});
$.ajax({
	type: 'GET',
    // 取得したいページのアドレス
	url: 'https://hiijii428.github.io/blog/header_nav.html',
	success: function (data) {
		console.log(data);
		// 取得したデータをHTMLに挿入
        document.querySelector(".header_nav").innerHTML = data;
	}
});

const sub = document.querySelector("iframe")
function side_iframe_setting() {
    sub.style.width = sub.contentWindow.document.body.scrollWidth + "px";
    sub.style.height = sub.contentWindow.document.body.scrollHeight+25 + "px";
}

function code_title(){
	let elm = document.querySelectorAll("code");
    console.log(elm)
	for(let i=0;i<elm.length;i++){
		let now_elm = elm[i]
		let code_name = now_elm.className.replace("language-","").replace(" hljs","");
        console.log(i,now_elm.classList.value)
		if(code_name){
			if(code_name==="cpp"){code_name="c++";}
			if(code_name==="csharp"){code_name="C#";}
			let code_name_html = "<div class='code_name'>"+code_name+"</div>";
            console.log(code_name_html)
			now_elm.innerHTML = code_name_html;
            //  + now_elm.innerHTML.replace(code_name_html,"");
		}
	}
}
let markdown_str = document.querySelector(".markdown");
markdown_str.innerHTML = marked.parse(markdown_str.innerHTML);
hljs.initHighlightingOnLoad();
code_title();
