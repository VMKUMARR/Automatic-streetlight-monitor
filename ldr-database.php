<?php
$servername = "localhost";
// Your Database name
$dbname = "id20271125_id20245494_autolight9909";
// Your Database user
$username = "id20271125_id20245494_admin";
// Your Database user password
$password = "Hack@9909703260";

$table = "ldrs";

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

function isLdrExist($id) {
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

function insertLdr($id, $name, $condition)
{
    global $table;
    $conn = makeConnection();

    $id = test_input($id);
    $name = test_input($name);
    $condition = test_input($condition);

    $sql = 'INSERT INTO ' . $table . ' VALUES (?, ?, ?)';
    $query = $conn->prepare($sql);
    $query->bind_param("sss", $id, $name, $condition);

    if($query->execute()) {
        echo ("Ldr inserted successfully");
    } else {
        echo ("Ldr inserting failed: ". $conn);
    }

    $query->close();
    $conn->close();
}

function getAllLdrs()
{
    global $table;
    $conn = makeConnection();

    $sql = "SELECT * FROM ".$table;
    if ($result = $conn->query($sql)) {
        if(mysqli_num_rows($result) > 0) {
            $ldrs = array();
            while($ldrData = $result->fetch_assoc()) {
                $ldr = array(
                    "id" => $ldrData['id'],
                    "name" => $ldrData['name'],
                    "condition" => $ldrData['condition_']
                );

                $ldrs[] = $ldr;
            }

            return $ldrs;
        }
    }

    return "No data found";
}

function getLdrForController($cid)
{
    global $table;
    $conn = makeConnection();

    
    $sql = "SELECT * FROM ".$table." WHERE cid = ?";
    $query = $conn->prepare($sql);
    $query->bind_param("s", $cid);
    
    if ($query->execute()) {
        $result = $query->get_result();
        if(mysqli_num_rows($result) > 0) {
            $ldrs = array();
            while($ldrData = $result->fetch_assoc()) {
                $ldr = array(
                    "id" => $ldrData['id'],
                    "name" => $ldrData['name'],
                    "condition" => $ldrData['condition_']
                );

                $ldrs[] = $ldr;
            }

            return $ldrs;
        } else {
            return "No data found";
        }
    } else {
        return "Exectuion error";
    }

    
}


function updateLdrCondition($id, $condition)
{
    global $table;
    $conn = makeConnection();

    $id = test_input($id);
    $condition = test_input($condition);

    $sql = 'UPDATE ' . $table . ' SET condition_=? WHERE id=?';
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


function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    
    return $data;
}
?>