# Mybrary Theme 

## Files in vendors folder

Files in vendors forlder are from external. Please install and update via bower.
See files: .bowerrc and bower.json for the definition

Commandline to install is like this:

cd /mnt/workspace/chchweb/sites/default/themes/mybrary
bower install

## Files in css folder

Files in css folder are compiled by less compiling the files in less folder.

Use blow command to install less compiler and watch (you may need su to install global)

First, install nodejs and npm by following
https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager

Then install bower, less and watch globally (need sudo user)

npm install bower --global
npm install less --global
npm install watch --global

You may need to install or update the external libraries (defined in bower.json) 
in vendors folder (don't use sudo user)

cd /mnt/workspace/mybrary/sites/default/themes/mybrary
bower install


Commandline to compile the less to css is like this: (coded in package.json)

cd /mnt/workspace/mybrary/sites/default/themes/mybrary
npm run build:less

Use watch to compile dynamically during development phase:

cd /mnt/workspace/mybrary/sites/default/themes/mybrary
npm run watch:less
