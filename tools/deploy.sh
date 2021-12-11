#!/bin/bash

set -e

yarn deploy-build
tar -cJvf app-build.tar.xz build
rsync -avhP app-build.tar.xz root@r.idiv.cf:/root/db/app-build.tar.xz
ssh root@r.idiv.cf "bash /root/db/extract-app-build.sh"
