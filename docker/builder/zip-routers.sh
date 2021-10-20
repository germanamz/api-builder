#!/bin/bash

cwd=$(pwd)

for router in ./dist/routers/*
do
  cd $router
  routerName="$ROUTERS_PREFIX-$(basename $router)"
  yarn
  zip -r "$cwd/dist/$routerName.zip" .
  sha=$(cat "$cwd/dist/$routerName.zip" | openssl dgst -binary -sha256 | openssl base64)
  echo $sha > "$cwd/dist/$routerName.zip.checksum"
  cd $cwd
done
