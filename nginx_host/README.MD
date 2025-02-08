### This is an nginx setup
- nginx is a http and web app server. It's used here as a HTTP server for testing a react.js deployment using webpack to bundle the javascript/typescript/sass/scss.
- the script ```buildDist``` runs webpack using ```webpack.config_build.js``` which puts the build into the active nginx directory ```nginx_host/webPackOut```.
- has nginx ~~windows exe~~, setup files and run scripts. [download the exe; it should not be in github. You can throw away the other files. This example tested with version nginx-1.26.3]
### Warning about NGINX on Windows
- Do not attempt to use git-bash to run the server unix-style! It won't work! Use the commands outlined in nginx-for-windows:  
https://nginx.org/en/docs/windows.html
- I tried running it in git-bash, using ps and kill to restart nginx, but it uses some background mechanism I don't know about. The server continues running after using ps, kill, etc, and editing config files had no effect.
### Commands to run nginx on windows (NOT *nix)
- These commands can get added to git-bash command history with ```source addHist```.  
- start it:  
```start nginx_setup/nginx.exe -c nginx_setup/nginx.conf```
- reload config: 
```nginx_setup/nginx.exe -c nginx_setup/nginx.conf -s reload```
- "ps" it (windows equivalent):  
```tasklist|grep nginx```  
[it will not show up using ps!]
- "kill" it:    
    ```nginx_setup/nginx.exe -c nginx_setup/nginx.conf -s stop```       
    ```nginx_setup/nginx.exe -c nginx_setup/nginx.conf -s quit```
###  Other notes/SNAFU's
- Browser cacheing lead to confusion:   
  use ```curl localhost``` instead. Comes with git-bash.  
- Folders "temp" and "logs" must be present for nginx to run. Their contents should get excluded from git with ```.gitignore```