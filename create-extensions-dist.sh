#!/bin/bash
git checkout master &&\
git pull &&\
git checkout gh-pages &&\
git merge master -m "Merge master" &&\
gulp build:extensions &&\
gulp build:themes &&\
git add Extensions &&\
git commit -m "Rebuild distribution" &&\
git push &&\
git checkout master
