                  __  __  ___  _   _ ____ _____ _____ ____
                |  \/  |/ _ \| \ | / ___|_   _| ____|  _ \
                | |\/| | | | |  \| \___ \ | | |  _| | |_) |
                | |  | | |_| | |\  |___) || | | |___|  _ <
                |_|  |_|\___/|_| \_|____/ |_| |_____|_| \_\

                      [MONgodb Shell in your TERminal]

A minimalist MongoDB shell using the mongodb node driver supporting TypeScript,
syntax hilighting and more.

Features
========

* TypeScript support
* Syntax hilighting
* Just the driver's connected client with no further magic
* Easily manage and share development environment setups
* Decouple script writing from execution
* Automatic TypeScript support for your scripts in your IDE
* Fast!

Install
=======

```
npm install -g monster-term
```

Connect and start a REPL
========================

```
monster mongodb://127.0.0.1:27017/
```

Init a workspace
================

```
mkdir ~/src/my-scripts
cd ~/src/my-scripts
monster init
```

Alternatively in case you're working on monster itself and you have the code
checked out locally, you can:

```
~/src/monster$ npm link
```

```
~/src/my-scripts$ monster init --link
```

Start a new script
==================

```
monster touch my-script.ts
```

Edit it in vscode
=================

```
code my-script.ts
```

Manage and use environments
===========================

## Start an environment specified in monster.conf.json

```
monster dev start
```

## Connect and open a REPL for that environment

```
monster dev
```

## Run your script against it

```
monster dev run my-script.ts
```

## Run your script against an arbitrary different server

```
monster mongodb://127.0.0.1:27017/ run my-script.ts
```

Useful once you've tested your script locally and you want to run it against a
staging or production environment.

## Stop your environment again


```
monster dev stop
```

Update
======

If you install a newer version of monster, update the version in your workspace to match so that the types match:

```
monster update
```

Help
====

```
monster help
```

Tips
====

Your workspace's config and scripts are just files. Commit them to git and share them with your team.