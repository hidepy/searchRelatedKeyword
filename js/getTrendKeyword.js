function searchTrendKeyword(node){

	jQuery.ajax({
		type: "GET",
		url: "callKizasiTrendAPI.php",
		dataType: "json",
		beforeSend: function(data){
			console.log("before send");

		},
		success: function(data){
			console.log("ajax success!!");
			//console.log(data);

			var el_display_area = document.getElementById("trend_display_area");

			console.log(el_display_area);

			if(data && data.channel && data.channel.item){

				console.log("first if clear");

				if(data.channel.item.length && (data.channel.item.length > 0)){

					//表示エリアのクリア
					el_display_area.innerHTML = "";

					for(var i = 0; i < data.channel.item.length; i++){
						var trend_item = data.channel.item[i];

						console.log(trend_item);

						var el_item = document.createElement("div");
						el_item.className = "trend_item";
						el_item.innerHTML = trend_item.title;
						el_item.setAttribute("trend-title", trend_item.title);


						el_display_area.appendChild(el_item);
					}

					setTimeout(attachEventToTrendKeywords, 10);
				}
				else{
					alert("トレンドキーワード情報の取得処理は成功しましたが、結果が0件のようです...");
				}
			}
			else{
				alert("トレンドキーワード情報の取得に失敗しました...");
			}

		},
		error: function(data){
			alert("ajaxで通信エラーが発生しました(" + data + ")");
			console.log(data);
		}
	});

	//return keyword;
}

/* 検索されたトレンドキーワードにクリックイベントを付与する */
function attachEventToTrendKeywords(){
	$(".trend_item").unbind("click");

	$(".trend_item").click(function(event){
		event.stopPropagation();
		
		var el_text_keyword = document.getElementById("text_rootKeyword");
		el_text_keyword.value = event.target.getAttribute("trend-title");
		el_text_keyword.focus();


	});

}