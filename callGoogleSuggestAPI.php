<?php

$target_word = $_GET["word"];

if(isset($target_word)){

	$access_url = "http://www.google.com/complete/search?hl=ja&output=toolbar&ie=utf_8&oe=utf_8&q=".urlencode($target_word);

	$got_html = file_get_contents($access_url);

	echo $got_html;
}

//php 5.3では、simplexml_load_file関数は使えない？？
/*
$url = "http://www.google.com/complete/search?hl=ja&output=toolbar&ie=utf_8&oe=utf_8&q=".urlencode("オバマ");
$toplevel = simplexml_load_file($url);        
foreach ($toplevel->CompleteSuggestion as $completeSuggestion) {
    $suggest_word_array[] = $completeSuggestion->suggestion->attributes()->data;
}
*/


?>
