Node-ROFLCOPTER
===============
**Highly Experimental** (not to say temperamental) NodeJS + Xbox 360 Wireless Remote AR Drone controller.

This project is a total rewrite of [drone-joystick](https://www.npmjs.org/package/drone-joystick) without all the SDL nonsense and written specifically for Xbox 360 Wireless remotes.

The author accepts no responsibility for decapitations, mangled family pets or broken light fixtures.


Install instructions
====================
This module can use *any* compatible Joystick device but I would highly recommend the XBox360 Wireless controls as they are the most fun.

1. Setup a joystick. I would recommend the wonderful (http://pingus.seul.org/~grumbel/xboxdrv) to configure your XBox remote into a normal Joystick, otherwise any compatible Joystick should do.
2. `git clone git@github.com:hash-bang/Node-ROFLCOPTER.git`
3. `cd Node-ROFLCOPTER`
4. `npm install` - to include all prerequisites
5. `node ./bin/roflcopter` - to run the damn thing
6. Aaaaaaaaaaaaaaaaagggggggggggggggghhhhhhhhhhhhhhhhh



TODO
====
* Actually accept and do something with command line arguments
* Add fixed rotation guides
* Move rotation controls to D-Pad and fix both joysticks to strafe movement
* Make 'takeoff' controls also retrigger emergency reset
* Change from linear acceleration to logarithmic 
* Fix animation controls so its less... decapitatingly... unpredictable
* Add camera streaming functionality
