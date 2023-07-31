<?php
$authenticationFailed = false;
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $servername = "localhost";
    // Your Database name
    $dbname = "id20271125_id20245494_autolight9909";
    // Your Database user
    $username = "id20271125_id20245494_admin";
    // Your Database user password
    $db_password = "Hack@9909703260";

    $table = $_POST['user-type']."s";
    
    if($table != "engineers" && $table != "officials") {
        die("invalid user type");
    }
  $email = $_POST["email"];
  $password = $_POST["password"];
  // Connect to the database
  $db = new mysqli($servername, $username, $db_password, $dbname);
  if ($db->connect_error) {
    die("Connection failed: " . $db->connect_error);
  }
  // Check if the email and password match a record in the database
  $stmt = $db->prepare("SELECT * FROM ".$table." WHERE email = ? AND password = ?");
  $stmt->bind_param("ss", $email, $password);
  $stmt->execute();
  $result = $stmt->get_result();
  if ($result->num_rows > 0) {
    header("Location: https://light9909.000webhostapp.com/".$table."_dashboard.html");
    exit;
  } else {
    global $authenticationFailed;
    $authenticationFailed = true;
  }
  $stmt->close();
  $db->close();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w==" crossorigin="anonymous" referrerpolicy="no-referrer"
    />
    <link rel="stylesheet" type="text/css" href="login_style.css">

</head>

<body>
    <form action="" method="post">
        <div class="container">
            <div class="form signup">
                <h2>Login</h2>
                <select style="padding-left: 13px; padding-right: 13px;" id="user-type" name="user-type">
                    <option value="official">Official</option>
                    <option value="engineer">Engineer</option>
                </select>
                <div class="inputbox">
                    <input type="text" name="email" required="required">
                    <span>Email</span>
                    <i class="fa-regular fa-envelope"></i>
                </div>
                <div class="inputbox">
                    <input type="password" name="password" required="required">
                    <span>password</span>
                    <i class="fa-solid fa-lock"></i>
                </div>
                <?php
                if ($authenticationFailed) {
                    echo '<p style="color:red;">Authentication failed. Please try again.</p>';
                }
                ?>
                <div class="inputbox">
                    <input type="submit" value="Login" onclick="">
                </div>
            </div>
        </div>
    </form>
    <script src="login_script.js"></script>
</body>

</html>