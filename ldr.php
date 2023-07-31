<?php
require('ldr-database.php');

if($_SERVER['REQUEST_METHOD'] == "POST") {
    $ldrs = (array)json_decode(file_get_contents("php://input"));
        foreach($ldrs as $ldr) {
            $ldr = (array)$ldr;
            $id = $ldr['id'];
            $name = $ldr['name'];
            $condition = $ldr['condition'];
        
            if(!isLdrExist($ldr['id'])) {
                insertLdr($id, $name, $condition);
            } else {
                updateLdrCondition($id, $condition);
            }
        }
}
if($_SERVER['REQUEST_METHOD'] == "GET") {
    if(isset($_GET['c'])) {
        $cid = $_GET['c'];
        $ldrs = getLdrForController($cid);
            
        if(is_array($ldrs)){
            echo json_encode($ldrs);
        } else {
            echo $ldrs;
        }
    } else {
        $lights = getAllLdrs();
        if(is_array($lights)) {
            echo json_encode($lights);
        } else {
            echo $lights;
        }
    }
}
?>