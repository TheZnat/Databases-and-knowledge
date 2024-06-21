#!/usr/bin/env bash
MY_PATH="$(dirname -- "${BASH_SOURCE[0]}")"
cd $MY_PATH
node app-mysql2-promise.js
