var delete_confirm_msg = "保存された関連キーワード木を削除します";
var copy_confirm_msg = "保存された関連キーワード木を表示します";


function createSavedKeywordMenu(){

	var el_menu = document.getElementById("saved_keywords_menu");
	el_menu.innerHTML = "";

	var keyword_data = JSON.parse(localStorage.getItem("related_keywords"));

	for(var prop in keyword_data){
		var el_div = document.createElement("div");
		el_div.setAttribute("keyword", prop);

		var el_a = document.createElement("a");
		el_a.className = "mdl-navigation__link saved_keyword_a";
		el_a.innerHTML = prop;

		var el_close_button = document.createElement("button");
		el_close_button.className = "mdl-button mdl-js-button mdl-button--fab delete_saved_keyword";
		//el_close_button.setAttribute("keyword", prop);
		el_close_button.innerHTML = '<i class="material-icons">delete</i>';

		el_div.appendChild(el_a);
		el_div.appendChild(el_close_button);

		el_menu.appendChild(el_div);
	}

	//イベントを付与
	attachEventForSavedKeywordMenu();

}

function attachEventForSavedKeywordMenu(){

	//単語にイベントを付与
	attachEventForSavedWords();

	//削除ボタンにイベントを付与
	attachEventForDeleteButton();

}

function attachEventForSavedWords(){
	$(".saved_keyword_a").unbind("click");

	$(".saved_keyword_a").click(function(event){

		if(confirm(copy_confirm_msg)){
			
			var el_root = document.getElementById("word_display_area");

			var keyword_data = JSON.parse(localStorage.getItem("related_keywords"));

			if(keyword_data == null){
				return;
			}

			var keyword = event.target.parentNode.getAttribute("keyword");

			el_root.innerHTML = keyword_data[keyword];

			document.getElementById("text_rootKeyword").value = keyword;

			//今回追加分のDOMにイベントを再アタッチ
			setTimeout(attachClickEventToWordElements, 500); //クールじゃないが、保存と展開方法からして仕方ない...
		}
	});
}

function attachEventForDeleteButton(){
	$(".delete_saved_keyword").unbind("click");

	$(".delete_saved_keyword").click(function(event){

		if(confirm(delete_confirm_msg)){
			console.log("delete start!!");

			deleteDataFromStorage(event.target.parentNode.getAttribute("keyword"));

			createSavedKeywordMenu(); //メニューの内容をリロード

		}
	});
}

function deleteDataFromStorage(key){
	var keyword_data = JSON.parse(localStorage.getItem("related_keywords"));

	if(keyword_data == null){
		return;
	}

	delete keyword_data[key];

	localStorage["related_keywords"] = JSON.stringify(keyword_data);
}
