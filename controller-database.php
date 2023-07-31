<?php
$servername = "localhost";
// Your Database name
$dbname = "id20271125_id20245494_autolight9909";
// Your Database user
$username = "id20271125_id20245494_admin";
// Your Database user password
$password = "Hack@9909703260";

$table = 'controller_coords';


function makeConnection()
{
    global $servername, $username, $password, $dbname;

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;
}

function getCoords($id) {
    global $table;
    
    $conn = makeConnection();
    $sql = "SELECT latitude, longitude FROM ". $table ." WHERE id = ?";
    $query = $conn->prepare($sql);
    $query->bind_param('s', $id);
    
    echo "params binding done";
    if($query->execute()) {
        $result = $query->get_result();
        if(mysqli_num_rows($result) > 0 && $row = $result->fetch_assoc()) {
            echo json_encode($row);
        }
    } else {
        die("execution error");
    }
}


function getAllControllers()
{
    global $table;
    $conn = makeConnection();

    $sql = "SELECT * FROM ".$table;
    if ($result = $conn->query($sql)) {
        if(mysqli_num_rows($result) > 0) {
            $controllers = array();
            while($controllerData = $result->fetch_assoc()) {
                $light = array(
                    "id" => $controllerData['id'],
                    "name" => $controllerData['name']
                );
                $controllers[] = $controller;
            }

            return $controllers;
        }
    } else {
        return "Execution error";
    }

    return "No data found";
}


?>