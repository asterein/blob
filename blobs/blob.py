import argparse
import os
import time

ENCODING = "utf-8"
BLOB_MAX = 256

def sync_blobs():
  if os.path.exists("index.json"):
    os.remove("index.json")
  index = open("index.json", "w", encoding=ENCODING)
  index.write("[\n")
  for file in sorted([f.lower() for f in os.listdir('.') if ".blob" in f.lower()]):
    index.write(f"\t\"{file}\",\n")
  index.write("\t\"\"\n]")
  index.close()

def new_blob():
  blob = input("New Blob:\n\n")
  save_new = True
  if len(blob) > BLOB_MAX:
    save_new = False
    continue_save = input(
      f"\n\nINFO: Blobs cannot be more than {BLOB_MAX} characters."
      f" Your blob will be cut to the following:\n\n"
      f"{blob[0:256]}\n\nProceed? (y/n) "
    )
    if continue_save.lower() == "y":
      save_new = True
  if save_new:
    file = open(f"{time.strftime('%Y%m%d%H%M%S')}.blob", "w", encoding=ENCODING)
    file.write(blob[0:256])
    file.close()
    sync_blobs()
    print("\n\nINFO: New blob synced.")
  else:
    print("\n\nINFO: Blob deleted.")

def reset_blobs():
  for file in sorted([f.lower() for f in os.listdir('.') if ".blob" in f.lower()]):
    os.remove(file)
  if os.path.exists("index.json"):
    os.remove("index.json")
  index = open("index.json", "w", encoding=ENCODING)
  index.write("[]")
  index.close()

def main():
  parser = argparse.ArgumentParser(description="Small local blob mangement cli")
  parser.add_argument("-s", "--sync", help="sync your blobs to the index.json file", action="store_true")
  parser.add_argument("-p", "--post", help="compose a new blob", action="store_true")
  parser.add_argument("-r", "--reset", help="reset all blobs", action="store_true")

  args = parser.parse_args()

  if args.sync:
    sync_blobs()
  elif args.post:
    new_blob()
  elif args.reset:
    reset_blobs()
  else:
    print("No args passed. Use -h flag for help.")

if __name__=="__main__":
    main()
