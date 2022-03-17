for i in ./images/raws/*
do
  full_outfile=./images/fulls/"$(basename "$i")"
  convert "$i" -resize 1024x768 "$full_outfile"
  thumb_outfile=./images/thumbs/"$(basename "$i")"
  convert "$i" -resize 512x256 "$thumb_outfile"
done
git add --all
git commit -m "upload images"
git push origin master
