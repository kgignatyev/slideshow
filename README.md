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

To adjust effects please edit slideshow-ui/src/app/slideshow/slideshow.component.scss

*Note*: to show images longer time need to be adjusted in 2 place (todo: make it in one):
we need to set **$slideDuration** in the slideshow.component.scss file and *slideshow.component.ts*.**animationDurationMilliseconds parameter**. 

