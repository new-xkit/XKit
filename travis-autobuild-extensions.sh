#!/bin/bash

if [ "$TRAVIS_REPO_SLUG" == "NewXKitBot/XKit" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then
  echo -e "Rebuilding extension dist...\n"

  cd $HOME
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "travis-ci"
  git checkout master &&\
  git pull &&\
  git checkout gh-pages &&\
  git merge master -m "[Travis (BUILD $TRAVIS_BUILD_NUMBER)]Merge master" &&\
  gulp build:extensions &&\
  gulp build:themes &&\
  git add Extensions &&\
  git commit -m "[Travis (BUILD $TRAVIS_BUILD_NUMBER)]Rebuild distribution" &&\
  git push &&\
  git checkout master

  echo -e "Rebuild extension dist.\n"
fi