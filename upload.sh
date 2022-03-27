bundle exec jekyll build
git add --all
git commit -m "upload images"
git push
git push `git subtree split --prefix _site master`:gh-pages --force
