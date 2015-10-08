<?php


$access_url = "http://kizasi.jp/kizapi.py?type=rank";

//取得結果をxmlに
$got_xml = file_get_contents($access_url);

//xmlオブジェクトに変換
$obj = simplexml_load_string($got_xml);

//JSONを返却
echo json_encode($obj);
//echo $obj;


?>
