<?

 $user_id = $_POST["user_id"];
 $pw = $_POST["pw"];
 $name = $_POST["name"];
 $email = $_POST["email"];
 $memo = $_POST["memo"];

 $connect = mysql_connect("localhost","root","apmsetup");
 mysql_query("set names euckr");
 mysql_select_db("hompi");

 $query  = "select * from member where user_id='$user_id'";
 $result = mysql_query($query,$connect);
 $data =  mysql_fetch_array($result);

 $name = $data[name];


 if($data[user_id]!= $user_id){
  echo "
  <script>
   window.alert('엇; 아이디가 디비에 엄써여');
   history.back(1);
  </script>
  ";
  exit;
 }


 if($data[pw]!= $pw){
  echo "
  <script>
   window.alert('비밀번호를 잘못썼어여ㅋㅋ');
   history.back(1);
  </script>
  ";
  exit;
 }
 
 
 setcookie("hwi",$name,-1,"/");
 $hwi = $_COOKIE['hwi'];
 

 mysql_close($connect);
?>

<script>
 location.href='login_test.php';
</script>