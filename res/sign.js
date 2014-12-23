var currentUser = null;

function createUser(id,uname,passwd)
{
	var user = new Object();
	user.id = id;
	user.name = uname;
	user.password = passwd;
	return user;
}

function setUser(username,password)
{
	sendRequest(
		document.URL + "/request",
		"select id,first_name, last_name from accounts where username = '" +
		username + "' and password = '" +
		password + "';",
		function(req)
		{
			if(req.responseText[0] == '[')
			{
				var array;
				eval("array = " + req.responseText + ";");
				document.getElementById("account-info").innerHTML = array[1][1] + " " + array[1][2];
				
				currentUser = createUser(array[1][0],username,password);
			}
			else
			{
				alert(req.responseText);
			}
		}
	);
}

function showCover()
{
	document.getElementById("content-cover").style.display = 'inline-block';
}

function hideCover()
{
	document.getElementById("content-cover").style.display = 'none';
	document.getElementById("sign-prompt").style.display = 'none';
}

function signIn()
{
	if(document.getElementById("sign-username").value.length == 0){showAlert("Username field is empty.");return;}
	if(document.getElementById("sign-password").value.length == 0){showAlert("Password field is empty.");return;}
	
	sendRequest(
		document.URL + "/request",
		"select exists(select 1 from accounts where username = '" +
		document.getElementById("sign-username").value + "' and password = '" +
		document.getElementById("sign-password").value + "');",
		function(req)
		{
			if((/1']]$/).test(req.responseText))
			{
				setUser(document.getElementById("sign-username").value,document.getElementById("sign-password").value);
				hideCover();
			}
			else
			if((/0']]$/).test(req.responseText))
			{
				showAlert("There is no such combination of username and password.");
			}
			else
			{
				alert(req.responseText);
			}
		}
	);
}

function register()
{
	if(document.getElementById("reg-username").value.length == 0){alert("Username field is empty.");return;}
	if(document.getElementById("reg-password_1").value.length == 0){alert("Password field is empty.");return;}
	if(document.getElementById("reg-first_name").value.length == 0){alert("First name field is empty.");return;}
	if(document.getElementById("reg-last_name").value.length == 0){alert("Second name field is empty.");return;}
	if(document.getElementById("reg-password_1").value != document.getElementById("reg-password_2").value)
	{
		showAlert("Passwords don't match.");
		return;
	}
	
	sendRequest(
		document.URL + "/request",
		"insert into accounts(username,password,first_name,last_name) values('" +
		document.getElementById("reg-username").value + "','" +
		document.getElementById("reg-password_1").value + "','" +
		document.getElementById("reg-first_name").value + "','" +
		document.getElementById("reg-last_name").value + "');",
		function(req)
		{
			if(req.responseText == "Done")
			{
				setUser(document.getElementById("reg-username").value,document.getElementById("reg-password_1").value);
				
				currentPage.update();
				hideCover();
				
				document.getElementById("reg-username").value = "";
				document.getElementById("reg-first_name").value = "";
				document.getElementById("reg-last_name").value = "";
			}
			else
			{
				alert(req.responseText);
			}
		}
	);
}
