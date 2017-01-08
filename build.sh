#!/bin/bash
NODE_ENV=online /home/tiger/bytedance_fe/git/webpack-wrapper-common/bin/tt-wb.js

mkdir -p ./output_f/
cp -rf ./output/* ./output_f/