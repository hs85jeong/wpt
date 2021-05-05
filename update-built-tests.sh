#!/usr/bin/env sh
set -ex

conformance-checkers/tools/build.sh
html/canvas/tools/build.sh
infrastructure/assumptions/tools/build.sh
html/tools/build.sh
python3 mimesniff/mime-types/resources/generated-mime-types.py
python3 css/css-ui/tools/appearance-build-webkit-reftests.py
python3 WebIDL/tools/generate-setlike.py
