<?php
    require('light-database.php');
    
    if($_SERVER['REQUEST_METHOD'] == "POST") {
        $data = (array)json_decode(file_get_contents("php://input"));
        $lights = (array)$data['lights'];
        $ldrs = (array)$data['ldrs'];
        
        foreach($lights as $light) {
            $light = (array)$light;
            $id = $light['id'];
            $name = $light['name'];
            $condition = $light['condition'];
            $state = $light['state'] == 1 ? "on" : "off";
            $cid = $light['cid'];
            
            if(!isLightExist($light['id'])) {
                insertLight($id, $name, $condition, $state, $cid);
            } else {
                if(lightNotUnderProcessing($id) || $condition != "not-working") {
                    echo "Updating";
                    updateLightStateAndCondition($id, $state, $condition);
                }
            }
        }
        
        foreach($ldrs as $ldr) {
            $ldr = (array)$ldr;
            $id = $ldr['id'];
            $name = $ldr['name'];
            $condition = $ldr['condition'];
            $cid = $ldr['cid'];
        
            if(!isLdrExist($ldr['id'])) {
                insertLdr($id, $name, $condition, $cid);
            } else {
                updateLdrCondition($id, $condition);
            }
        }
}
if($_SERVER['REQUEST_METHOD'] == "GET") {
    if(isset($_GET['q'])) {
        $query = $_GET['q'];
        switch($query) {
            case 'assigned-work':
                $lights = getAssignedWork();
                if(is_array($lights)) {
                    echo json_encode($lights);
                } else {
                    echo $lights;
                }
                break;
        }
        
    } if(isset($_GET['c'])) {
        $cid = $_GET['c'];
        $lights = getLightForController($cid);
        if(is_array($lights)) {
            echo json_encode($lights);
        } else {
            echo $lights;
        }
    } else {
        $lights = getAllLights();
        if(is_array($lights)) {
            echo json_encode($lights);
        } else {
            echo $lights;
        }
    }
}
?>