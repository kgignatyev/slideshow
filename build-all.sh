#!/usr/bin/env bash
#todo: require release version parameter
set -x
set -e
RELEASE=${1}

if [ "$RELEASE" == "" ]; then
  echo RELEASE must be set as first parameter
  exit 1
fi

cd slideshow-ui
mkdir -p dist
rm -fR dist/*
npm install
ng build --prod --deploy-url app/
cd ../images-server
./gradlew clean assemble
cd ..

mkdir -p "dist/slideshow-server"
rm -fR dist/slideshow-server/*
mkdir -p "dist/slideshow-server/slideshow-spa"
cp README.md dist/slideshow-server/
cp -fR slideshow-ui/dist/slideshow-ui/* dist/slideshow-server/slideshow-spa/
cp images-server/app/build/libs/app-all.jar  dist/slideshow-server/slideshow-server.jar
cd dist
tar -czf slideshow-server-$RELEASE.tgz slideshow-server/*




