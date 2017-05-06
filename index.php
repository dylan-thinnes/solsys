<!DOCTYPE html>
<html>
<head>
	<title>SolSys Factors - 
<?php
$number = (string) intval($_GET["number"]);
echo $number;
?>
	</title>
</head>
<body>
<?php
/*$cHandle = curl_init();
curl_setopt($cHandle, CURLOPT_URL, "http://factordb.com/api?query=" . $number);
curl_setopt($cHandle, CURLOPT_RETURNTRANSFER, 1);
$output = curl_exec($cHandle);
echo $output;
curl_close($cHandle);*/
$factors = shell_exec("msieve -q " . $number);
echo $factors;
?>
</body>
</html>