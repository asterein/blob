-- Help
local HELP_TEXT = [[
usage: blob.lua [-h] [-s] [-p] [-r]

Small local blob management cli

options:
  -h, --help   show this help message and exit
  -s, --sync   sync your blobs to the index.json file
  -p, --post   compose a new blob
  -r, --reset  reset all blobs
]]

-- Settings
local ENCODING = "utf-8"
local BLOB_MAX = 256

local BLOB_PATH = "/path/to/blobs"

local function syncBlobs()
  -- sync the blob index.json file
  os.remove('index.json')
  local index = io.open('index.json', 'w')
  index:write('[\n')
  index:write('\n]')
  index:close()
  local dir = io.open('ls ' ..BLOB_PATH)
  print(dir)
  --[[for name in dir:lines() do
    if (string.sub(name, string.len(name)-5) == ".blob") then
      print(name)
    end
  end]]
end

local function newBlob()
  -- create a new blob
  print("New blob:\n")
  local blob = io.read("*l")
  local save = true
  if (string.len(blob) > BLOB_MAX) then
    save = false
    print("\nINFO: Blobs cannot be more than " .. BLOB_MAX .. " characters. Your blob will be cut to the following:\n") 
    print(string.sub(blob,1,256))
    io.write("\nProceed? (y/n) ")
    io.flush()
    local continue = string.lower(io.read(1))
    if (continue == "y") then
      save = true
    end
  end
  if save then
    local filename = os.date("%Y%m%d%H%M%S") .. ".blob.lua"
    local file = io.open(filename, "w")
    file:write(blob)
    file:close()
    print("\nINFO: New blob saved.")
  else
    print("\nINFO: Blob deleted.")
  end
end

local function isArgUsed(argPassed, shortArg, fullArg)
  if (argPassed == shortArg or argPassed == fullArg) then
   return true
  end
  return false
end

if isArgUsed(arg[1], "-p", "--post") then
  newBlob()
elseif isArgUsed(arg[1], "-s", "--sync") then
  syncBlobs()
elseif isArgUsed(arg[1], "-h", "--help") then
  print(HELP_TEXT)
else
  print("No args passed. Use -h flag for help.")
end
