#!/bin/sh
cd `dirname $0`

MICROVERSE=${1}
if [ -z ${MICROVERSE} ]
then
    echo "specify the microverse repo dir"
    exit 1;
fi

# build microverse lib

(cd ${MICROVERSE} && npm run build-lib)

# copy it here

HERE=`pwd`
(cd ${MICROVERSE}/dist && INIT_CWD=$HERE node install.js)

# remove unused files

rm -r apiKey.js-example

