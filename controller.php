<?php
require ('controller-database.php');
if($_SERVER['REQUEST_METHOD'] == 'GET') {
    $junctions = getAllControllers();
    if(is_array($junctions)) {
        echo json_encode($juntions);
    } else {
        echo $junctions;
    }
}
?>