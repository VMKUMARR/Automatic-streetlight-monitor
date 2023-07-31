<?php

$servername = "localhost";
// Your Database name
$dbname = "id20271125_id20245494_autolight9909";
// Your Database user
$username = "id20271125_id20245494_admin";
// Your Database user password
$password = "Hack@9909703260";

$table = "lights";
$tableLdr = "ldrs";
$tableCoords = 'controller_coords';

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

function isLightExist($id) {
    global $table;
    $conn = makeConnection();

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT * FROM ".$table." WHERE id = ?";
    $query = $conn->prepare($sql);
    $query->bind_param("s", $id);
    if($query->execute()) {
        $result = $query->get_result();
        if(mysqli_num_rows($result) > 0) {
            return true;
        }
    }
    return false;
}

function lightNotUnderProcessing($id) {
        global $table;
    $conn = makeConnection();

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT * FROM ".$table." WHERE id = ? AND (condition_ = 'assigned-for-maintainance' OR condition_ = 'under-maintainance')";
    $query = $conn->prepare($sql);
    $query->bind_param("s", $id);
    if($query->execute()) {
        $result = $query->get_result();
        if(mysqli_num_rows($result) > 0) {
            return false;
        }
    }
    return true;
}

function insertLight($id, $name, $condition, $state, $cid)
{
    global $table;
    $conn = makeConnection();

    $id = test_input($id);
    $name = test_input($name);
    $condition = test_input($condition);
    $state = test_input($state);

    $sql = 'INSERT INTO ' . $table . ' VALUES (?, ?, ?, ?, ?)';
    $query = $conn->prepare($sql);
    $query->bind_param("sssss", $id, $name, $condition, $state, $cid);

    if($query->execute()) {
        echo ("Light inserted successfully");
    } else {
        echo ("Light inserting failed: ". $conn);
    }

    $query->close();
    $conn->close();
}

function getAllLights()
{
    global $table;
    $conn = makeConnection();

    $sql = "SELECT * FROM ".$table;
    if ($result = $conn->query($sql)) {
        if(mysqli_num_rows($result) > 0) {
            $lights = array();
            while($lightData = $result->fetch_assoc()) {
                $light = array(
                    "id" => $lightData['id'],
                    "name" => $lightData['name'],
                    "condition" => $lightData['condition_'],
                    "state" => $lightData['state'],
                    "cid" => $lightData['cid']
                );
                if($light['condition'] == "not-working" || $light['condition'] == "assigned-for-maintainance") {
                    $coords = getCoords($lightData['cid']);
                    if(is_array($coords)) {
                        $light['latitude'] = $coords['latitude'];
                        $light['longitude'] = $coords['longitude'];
                    }
                }
                $lights[] = $light;
            }

            return $lights;
        }
    } else {
        return "Execution error";
    }

    return "No data found";
}


function getLightForController($cid) {
    global $table;
    $conn = makeConnection();

    $sql = "SELECT * FROM ".$table. " WHERE cid=?";
    $query = $conn->prepare($sql);
    $query->bind_param("s", $cid);
    
    if ($query->execute()) {
        $result = $query->get_result();
        if(mysqli_num_rows($result) > 0) {
            $lights = array();
            while($lightData = $result->fetch_assoc()) {
                $light = array(
                    "id" => $lightData['id'],
                    "name" => $lightData['name'],
                    "condition" => $lightData['condition_'],
                    "state" => $lightData['state'],
                    "cid" => $lightData['cid']
                );
                if($light['condition'] == "not-working" || $light['condition'] == "assigned-for-maintainance") {
                    $coords = getCoords($lightData['cid']);
                    if(is_array($coords)) {
                        $light['latitude'] = $coords['latitude'];
                        $light['longitude'] = $coords['longitude'];
                    }
                }
                $lights[] = $light;
            }

            return $lights;
        }
    }

    return "No data found"; 
}

function getLight($id)
{
    global $table;
    $conn = makeConnection();

    $sql = "SELECT * FROM ".$table. " WHERE id=?";
    $query = $conn->prepare($sql);
    $query->bind_param("s", $id);
    
    if ($query->execute()) {
        $result = $query->get_result();
        if(mysqli_num_rows($result) > 0) {
            $lights = array();
            while($lightData = $result->fetch_assoc()) {
                $light = array(
                    "id" => $lightData['id'],
                    "name" => $lightData['name'],
                    "condition" => $lightData['condition_'],
                    "state" => $lightData['state']
                );
                array_push($ligths, $light);
            }

            return $lights;
        }
    }

    return "No data found";
}



function getAssignedWork() {
    global $table;
    $conn = makeConnection();

    $sql = "SELECT * FROM ".$table. " WHERE condition_='assigned-for-maintainance'";
    
    if ($result = mysqli_query($conn, $sql)) {
        if(mysqli_num_rows($result) > 0) {
            $lights = array();
            while($lightData = $result->fetch_assoc()) {
                $light = array(
                    "id" => $lightData['id'],
                    "name" => $lightData['name']
                );
                $lights[] = $light;
            }
            return $lights;
        }
    }

    return "No work assigned";
}

function updateLightName($id, $name)
{
    global $table;
    $conn = makeConnection();

    $id = test_input($id);
    $name = test_input($name);

    $sql = 'UPDATE ' . $table . 'SET name=? WHERE id=?';
    $query = $conn->prepare($sql);
    $query->bind_param("ss", $name, $id);

    if($query->execute()) {
        echo ("Light updated successfully");
    } else {
        echo ("Light update failed");
    }

    $query->close();
    $conn->close();
}

function updateLightState($id, $state)
{
    global $table;
    $conn = makeConnection();

    $id = test_input($id);
    $state = test_input($state);

    $sql = 'UPDATE ' . $table . ' SET state=? WHERE id=?';
    $query = $conn->prepare($sql);
    $query->bind_param("ss", $state, $id);

    if($query->execute()) {
        echo ("Light updated successfully");
    } else {
        echo ("Light update failed");
    }

    $query->close();
    $conn->close();
}


function updateLightCondition($id, $condition)
{
    global $table;
    $conn = makeConnection();

    $id = test_input($id);
    $condition = test_input($condition);

    $sql = 'UPDATE ' . $table . ' SET condition_=? WHERE id=?';
    $query = $conn->prepare($sql);
    $query->bind_param("ss", $condition, $id);

    if($query->execute()) {
        echo ("Light updated successfully");
    } else {
        echo ("Light update failed");
    }

    $query->close();
    $conn->close();
}

function updateLightStateAndCondition($id, $state, $condition)
{
    global $table;
    $conn = makeConnection();

    $id = test_input($id);
    $state = test_input($state);
    $condition = test_input($condition);

    $sql = 'UPDATE ' . $table . ' SET state=?, condition_=? WHERE id=?';
    $query = $conn->prepare($sql);
    $query->bind_param("sss", $state, $condition, $id);

    if($query->execute()) {
        echo ("Light updated successfully");
    } else {
        echo ("Light update failed");
    }

    $query->close();
    $conn->close();
}


function isLdrExist($id) {
    global $tableLdr;
    $conn = makeConnection();

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT * FROM ".$tableLdr." WHERE id = ?";
    $query = $conn->prepare($sql);
    $query->bind_param("s", $id);
    if($query->execute()) {
        $result = $query->get_result();
        if(mysqli_num_rows($result) > 0) {
            return true;
        }
    }
    return false;
}

function insertLdr($id, $name, $condition, $cid)
{
    global $tableLdr;
    $conn = makeConnection();

    $id = test_input($id);
    $name = test_input($name);
    $condition = test_input($condition);

    $sql = 'INSERT INTO ' . $tableLdr . ' VALUES (?, ?, ?, ?)';
    $query = $conn->prepare($sql);
    $query->bind_param("ssss", $id, $name, $condition, $cid);

    if($query->execute()) {
        echo ("Ldr inserted successfully");
    } else {
        echo ("Ldr inserting failed: ". $conn);
    }

    $query->close();
    $conn->close();
}



function updateLdrCondition($id, $condition)
{
    global $tableLdr;
    $conn = makeConnection();

    $id = test_input($id);
    $condition = test_input($condition);

    $sql = 'UPDATE ' . $tableLdr . ' SET condition_=? WHERE id=?';
    $query = $conn->prepare($sql);
    $query->bind_param("ss", $condition, $id);

    if($query->execute()) {
        echo ("Ldr updated successfully");
    } else {
        echo ("Ldr update failed");
    }

    $query->close();
    $conn->close();
}

function getCoords($id) {
    global $tableCoords;
    
    $conn = makeConnection();
    $sql = "SELECT latitude, longitude FROM ". $tableCoords ." WHERE id = ?";
    $query = $conn->prepare($sql);
    $query->bind_param('s', $id);
    
    if($query->execute()) {
        $result = $query->get_result();
        if(mysqli_num_rows($result) > 0 && $row = $result->fetch_assoc()) {
            return (array)$row;
        } else {
            return "";
        }
    } else {
        die("execution error");
    }
}



function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    
    return $data;
}

?>