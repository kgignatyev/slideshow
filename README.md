This project implements slideshow server and client
---

client is an Angular application
and server is very simple KTor server that provides client with a random image on demand


Build
---

    ./build-all.sh


Run
---

    cd dist
    java -Dphotos-root=<root directory of images>  -jar slideshow-server.jar

in the browser visit http://localhost:8080/app, to change server port start app as

    java -Dphotos-root=<root directory of images> -Dport=7070  -jar slideshow-server.jar



Customization
---
there is a modal dialog to adjust slide duration, for deeper changes
 effects can be set in slideshow-ui/src/app/slideshow/slideshow.component.scss

Last Images
---

Cmd+l opens a modal dialog with the list of last images, by clicking on image it will be displayed again, or 
it can be deleted. This moves image to the peer directory fo root that has _deleted suffix, and subdirectory
structure is retained
