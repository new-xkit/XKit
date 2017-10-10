#!/bin/bash
set -e
if [ "$TRAVIS_REPO_SLUG" == "$GH_REPO" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then
  echo -e "Rebuilding extension dist...\n"

  git config --global user.email "travis@travis-ci.org" || true
  git config --global user.name "travis-ci" || true
  git remote set-branches --add origin gh-pages
  git fetch
  git checkout -f -t -b gh-pages origin/gh-pages
  git reset --hard master
  gulp build:extensions
  gulp build:themes
  git add --force Extensions
  git diff --staged --quiet Extensions || {
    git commit -m "Rebuild distribution based on $TRAVIS_COMMIT"
	git push -fq https://"$GH_TOKEN"@github.com/"$GH_REPO" gh-pages > /dev/null
	echo -e "Rebuilt extension dist.\n"
	exit 0
  }
  echo -e "Nothing to commit, extension dist has not changed."

fi
