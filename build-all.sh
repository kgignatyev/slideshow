#!/usr/bin/env bash

set -x
set -e

cd slideshow-ui
mkdir -p dist
rm -fR dist/*
npm install
ng build --prod --deploy-url app/
cd ../images-server
./gradlew clean assemble
cd ..

mkdir -p "dist"
rm -fR dist/*
mkdir -p "dist/slideshow-spa"

cp -fR slideshow-ui/dist/slideshow-ui/* dist/slideshow-spa/
cp images-server/app/build/libs/app-all.jar  dist/slideshow-server.jar




