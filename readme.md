**Blob** is a small content tool which builds a page of microblog-like posts with built-in pagination. 

**Installation & Setup**
- Clone the repo and use `./blobs/blob.py` to manage your blobs.
- `blob.py -h`
```
usage: blob.py [-h] [-s] [-p] [-r]

Small local blob mangement cli

options:
  -h, --help   show this help message and exit
  -s, --sync   sync your blobs to the index.json file
  -p, --post   compose a new blob
  -r, --reset  reset all blobs
```
- You can also add blobs manually by creating a `*.blob` file in the `/blobs/` directory.
- Note that blobs will appear in alphabetical order. The python cli currently names each blob with a time signature of year, month, day, hour, minute, and second of the post. 

**Todo**
- [ ] Add support for styled blobs (`innerText` vs `innerHTML`)
- [ ] Make blob-card and overall styling more easily configureable
- [ ] Improve cli
- [ ] Add more accessible conf for pagination (dropdown select? conf file for blobs per page?)
