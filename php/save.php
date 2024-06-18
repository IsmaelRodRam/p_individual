#!/usr/bin/php-cgi
<?php
session_start();

$_POST = json_decode(file_get_contents('php://input'), true);

$_SESSION['uuid'] = $_POST['uuid'];
$_SESSION['pairs'] = $_POST['pairs'];
$_SESSION['points'] = $_POST['points'];
$_SESSION['cards'] = $_POST['cards'];
$encodeCards = json_encode($_SESSION['cards']);

$conn = oci_connect('u1988495', 'nazeolul', 'ORCLCDB');
if (!$conn) {
    $e = oci_error();
    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
}

$insert = "INSERT INTO memory_save (uuid, pairs, points, cards) VALUES (:uuid, :pairs, :points, :cards)";
$comanda = oci_parse($conn, $insert);

oci_bind_by_name($comanda, ":uuid", $_SESSION['uuid']);
oci_bind_by_name($comanda, ":pairs", $_SESSION['pairs']);
oci_bind_by_name($comanda, ":points", $_SESSION['points']);
oci_bind_by_name($comanda, ":cards", $encodeCards);

if (oci_execute($comanda)) {
    oci_close($conn);
    echo json_encode(true);
} else {
    $error_message = oci_error($comanda);
    oci_close($conn);
    echo json_encode(['error' => $error_message]);
}
?>
