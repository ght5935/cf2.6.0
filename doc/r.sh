#!/bin/bash

DIR="$( cd "$( dirname "$0"  )" && pwd  )"
DIST_PATH="/Users/tom/develop/cfprod_project/cfAdmin2_5_1/src/main/webapp/cf"

date

cd ../
npm run build

cp -r dist/* ${DIST_PATH}/
rm ${DIST_PATH}/login.html
rm ${DIST_PATH}/index.html

date
