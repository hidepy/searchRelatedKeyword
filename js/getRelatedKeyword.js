var STATE = {
	INITIAL: 0,
	CLICKED: 1
};

var rewrite_confirm_msg = "現在検索されている関連キーワード木は上書きされます";
var save_success_msg = "関連キーワード木を保存しました";

//イベントを付与する
function attachEventForKeywordSearch(){

	//検索エリアにイベントを付与
	attachEnterEventToSearchArea();

	//word要素にイベントを付与
	attachClickEventToWordElements();

	//保存ボタンにイベントを付与
	attachClickEventToSaveButton();
}

//動的スタイルを作成する
function loadActiveStyle(){
	var el_style = document.createElement("style");
	//var arr_depth_color = ["#FFFFFF", "#F0F0F0", "#EEEEEE", "#E0E0E0", "#DDDDDD", "#D0D0D0", "#CCCCCC", "#C0C0C0", "#BBBBBB" , "#B0B0B0"];

	el_style.innerHTML = "";

	for(var i = 0; i < 10; i++){
		var style = ".word[depth='" + i + "']{";
		style += "margin-left: " + (i * 6) + "px;";
		//style += "color: " + arr_depth_color[i] + ";";
		style += "} ";

		el_style.innerHTML += style;
	}


	document.head.appendChild(el_style);
}

//検索エリアにEnterイベントを付与
function attachEnterEventToSearchArea(){

	$("#text_rootKeyword").keypress(function(event){
		if(event.which == 13){

			var el_words = document.querySelectorAll(".word");

			if((el_words.length == 0) || confirm(rewrite_confirm_msg)){

				//Enterキーが押下された
				console.log("search start!!");

				var root_keyword = event.target.value;
				var el_root = document.getElementById("word_display_area");			

				el_root.innerHTML = ""; //必ず検索結果は上書きされる

				el_root.setAttribute("data", root_keyword);

				$(el_root).append("<ul></ul>");

				searchRelatedKeyword(root_keyword, el_root);
			}
		}
	});

}

//単語にクリックイベントを付与
function attachClickEventToWordElements(){
	
	$(".word").unbind("click");

	$(".word[state='" + STATE.INITIAL + "']").click(function(event){
		event.stopPropagation();
		$(this).append("<ul></ul>");
		searchRelatedKeyword(event.target.getAttribute("data"), event.target);
		event.target.setAttribute("state", STATE.CLICKED);
	});

	$(this).addClass("searched");
}

//保存ボタンにクリックイベントを付与
function attachClickEventToSaveButton(){

	$("#word_save_button").click(function(event){

		var el_root = document.getElementById("word_display_area").children("ul");

		saveWords(el_root.getAttribute("data"), el_root.innerHTML);

		createSavedKeywordMenu();
	});
}

/* 
key: root名称
value: 
	word
	depth
	state
*/
function saveWords(key, value){
	var keyword_data = JSON.parse(localStorage.getItem("related_keywords"));

	if(keyword_data == null){
		keyword_data = {};
	}

	keyword_data[key] = value;

	localStorage["related_keywords"] = JSON.stringify(keyword_data);

	alert(save_success_msg);
}

function searchRelatedKeyword(keyword, node){

	jQuery.ajax({
		type: "GET",
		url: "callGoogleSuggestAPI.php?word=" + keyword,
		dataType: "xml",
		success: function(data){
			console.log("ajax success!!");
			//console.log(data);

			var el_related_words = data.getElementsByTagName("suggestion");
			var parent_word_val = node.getAttribute("data");

			if(el_related_words && (el_related_words.length > 0)){
				jQuery.each(el_related_words, function(idx, val){

					var word = val.getAttribute("data");

					if(word == parent_word_val){
						return true;
					}

					var parent_depth = Number(node.getAttribute("depth"));

					var el_word = document.createElement("li");
					el_word.setAttribute("data", word);
					el_word.setAttribute("depth", parent_depth + 1);
					el_word.setAttribute("state", STATE.INITIAL);
					el_word.className = "word";
					el_word.innerHTML = word;

					$(node).children().append(el_word);
				});

				attachClickEventToWordElements();
			}
			else{
				//suggestion の件数が0件, 又は, 単に失敗した場合
			}


		},
		error: function(data){
			alert("ajaxで通信エラーが発生しました(" + data + ")");
		}
	});

	//return keyword;
}
