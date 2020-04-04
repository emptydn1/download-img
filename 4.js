const fs = require("fs");
const archiver = require("archiver");
const path = require("path");

const source = path.join(__dirname, "img-ununneee");
// create a file to stream archive data to.
let stream = fs.createWriteStream(__dirname + "/exp.zip");
let archive = archiver("zip", {
  zlib: { level: 9 } // Sets the compression level.
});

archive.pipe(stream);

archive.directory(source, false);

//connect to output

stream.on("close", function() {
  console.log(archive.pointer() + " total bytes");
  console.log(
    "archiver has been finalized and the output file descriptor has closed."
  );
});

archive.finalize();
