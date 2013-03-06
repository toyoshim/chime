chime
=====
Copyright © 2013 Takashi Toyoshima <toyoshim@gmail.com>. See also LICENSE.txt.

Description
-----------
chime is a chip tune like sound library for JavaScript apps.

Dependency
----------
chime depends on [T'SoundSystem	](https://code.google.com/p/tss/) library which provides MML based music system. Also to get minimized version, you need [Closure Compiler](https://developers.google.com/closure/compiler/).

How to build
------------

### Preparation
Checkout source code and dependent libraries.

````
$ git clone git://github.com/toyoshim/chime.git
$ cd chime
$ make clone
$ make checkout
````

If you want to build minimized version, you need to create a shell script file `closure_compiler` containing following lines with executable permission. Please replace <closure-install-path> with proper path to the compiler. Of course, you need Java VM to run it.

````
#!/bin/sh

exec java -jar <closure-install-path>/compiler.jar $*
````

### Build concat version
````
$ make cat
````

### Build complied version

````
$ make build
````