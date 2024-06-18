#!/usr/bin/php-cgi
<?php
session_start();

$ret = new stdClass();
$conn = oci_connect('u1988495', 'nazeolul', 'ORCLCDB');
$consulta = "SELECT pairs, points, cards FROM memory_save";
$comanda = oci_parse($conn, $consulta);

oci_execute($comanda);

if ($fila = oci_fetch_array($comanda, OCI_ASSOC + OCI_RETURN_NULLS)) {
    $ret->pairs = $fila['PAIRS'];
    $ret->points = $fila['POINTS'];
    $ret->cards = json_decode($fila['CARDS']);
}

oci_close($conn);

echo json_encode($ret);
?>
