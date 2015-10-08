function searchTrendKeyword(node){

	jQuery.ajax({
		type: "GET",
		url: "http://kizasi.jp/kizapi.py?type=rank",
		dataType: "xml",
		success: function(data){
			console.log("ajax success!!");
			//console.log(data);

			/*var el_related_words = data.getElementsByTagName("suggestion");
			var parent_word_val = node.getAttribute("data");

			if(el_related_words && (el_related_words.length > 0)){
				jQuery.each(el_related_words, function(idx, val){

					var word = val.getAttribute("data");

					if(word == parent_word_val){
						return true;
					}

					var parent_depth = Number(node.getAttribute("depth"));

					var el_word = document.createElement("div");
					el_word.setAttribute("data", word);
					el_word.setAttribute("depth", parent_depth + 1);
					el_word.setAttribute("state", STATE.INITIAL);
					el_word.className = "word";
					el_word.innerHTML = word;

					node.appendChild(el_word);
				});

				attachClickEventToWordElements();
			}
			else{
				//suggestion の件数が0件, 又は, 単に失敗した場合
			}
*/

		},
		error: function(data){
			alert("ajaxで通信エラーが発生しました(" + data + ")");
		}
	});

	//return keyword;
}
