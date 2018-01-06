// Create certificate
makecert -sr LocalMachine -ss My sha1 -n CN=WebAPI-Token -sky exchange -pe

// Code reference
http://www.codeproject.com/Articles/630986/Cross-Platform-Authentication-With-ASP-NET-Web-API

// Authorization
http://stackoverflow.com/questions/12028604/how-can-i-safely-set-the-user-principal-in-a-custom-webapi-httpmessagehandler