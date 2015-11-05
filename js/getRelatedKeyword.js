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
		style += "margin-left: " + (i * 3) + "px;";
		//style += "color: " + arr_depth_color[i] + ";";
		style += "} ";

		el_style.innerHTML += style;
	}


	document.head.appendChild(el_style);
}

//検索エリアにEnterイベントを付与
function attachEnterEventToSearchArea(){

	/*
	$("#text_rootKeyword").keypress(function(event){
		if(event.which == 13){
			$("#word_display_wrap").fadeOut(800, "swing");

			var el_words = document.querySelectorAll(".word");

			if((el_words.length == 0) || confirm(rewrite_confirm_msg)){

				//Enterキーが押下された
				console.log("search start!!");

				var root_keyword = event.target.value;
				var el_root = document.getElementById("word_display_area");			

				el_root.innerHTML = ""; //必ず検索結果は上書きされる

				el_root.setAttribute("data", root_keyword);

				searchRelatedKeyword(root_keyword, el_root);

				console.log("in attachEnterEventToSearchArea: after searchRelatedKeyword");
			}

			$("#word_display_wrap").fadeIn(800, "swing");

		}
	});	
	*/

	document.getElementById("text_rootKeyword").addEventListener("keydown", function(e){
		if(e.keyCode == "13"){

			//e.preventDefault();

			console.log("enter pressed!!");

			$("#word_display_wrap").fadeOut(100, "swing");

			var el_words = document.querySelectorAll(".word");

			//if((el_words.length == 0) || confirm(rewrite_confirm_msg)){
			{
				e.preventDefault();

				//Enterキーが押下された
				console.log("search start!!");

				var root_keyword = event.target.value;
				var el_root = document.getElementById("word_display_area");			

				el_root.innerHTML = ""; //必ず検索結果は上書きされる

				el_root.setAttribute("data", root_keyword);

				searchRelatedKeyword(root_keyword, el_root);

				console.log("in attachEnterEventToSearchArea: after searchRelatedKeyword");
			}

			$("#word_display_wrap").fadeIn(600, "swing");

			console.log("enter eventfinished");
		}
	});
}

//単語にクリックイベントを付与
function attachClickEventToWordElements(){
	
	$(".word").unbind("click");	

	$(".word[state='" + STATE.INITIAL + "']").click(function(event){
		
		event.stopPropagation();

		// 探索は10層まで
		if(event.target.getAttribute("depth") < 10){
			searchRelatedKeyword(event.target.getAttribute("data"), event.target);
		}
		
		event.target.setAttribute("state", STATE.CLICKED);
		/*
        if( !$(this).hasClass('last_node') ){
			console.log("まだあるよ！", $(this).children());
			$(this).append("＊");
		}
		*/		
		$(this).addClass("searched");

	});

	// 既にクリックされた単語のクリックイベント
	$("li.word[state='" + STATE.CLICKED + "']").click(function(event){
		
		event.stopPropagation();
		$(this).children().slideToggle();

	});

}

//保存ボタンにクリックイベントを付与
function attachClickEventToSaveButton(){

	$("#word_save_button").click(function(event){

		var el_root = document.getElementById("word_display_area");

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
		beforeSend: function(){
			console.log("in beforesend");
			console.log("key: " + keyword + ", node: " + node);
		},
		success: function(data){
			console.log("ajax success!!");
			//console.log(data);

			var el_related_words = data.getElementsByTagName("suggestion");
			var parent_word_val = node.getAttribute("data");

			if(el_related_words && (el_related_words.length > 0)){
				//console.log(el_related_words[0].getAttribute("data"), parent_word_val);
				//探索結果が親と同じワードのみ以外の時、ulを追加
				if(!((el_related_words.length < 2) && ( parent_word_val == el_related_words[0].getAttribute("data")))){
					$(node).append("<ul></ul>");
				}
				else{
					$(node).addClass("last_node");
				}
//$(node).append("<ul></ul>");
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
				$(node).addClass("last_node");
			}


		},
		error: function(data){
			console.log("ajax error...");
			console.log(data);
			alert("ajaxで通信エラーが発生しました(" + JSON.stringify(data) + ")");

		},
		complete: function(data){
			console.log("ajax complete!!");
		}
	});

	//return keyword;
}
