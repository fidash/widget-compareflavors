Flavor Comparator widget
======================

[![GitHub license](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://raw.githubusercontent.com/fidash/widget-compareflavors/master/LICENSE)
[![Support badge](https://img.shields.io/badge/support-askbot-yellowgreen.svg)](http://ask.fiware.org)
[![Build Status](https://build.conwet.fi.upm.es/jenkins/view/FI-Dash/job/Widget%20CompareFlavors/badge/icon)](https://build.conwet.fi.upm.es/jenkins/view/FI-Dash/job/Widget%20CompareFlavors/)

The Flavor Comparator widget is a FIDASH widget that enables you to compare private with public flavors.

Build
-----

Be sure to have installed [Node.js](http://node.js) and [Bower](http://bower.io) in your system. For example, you can install it on Ubuntu and Debian running the following commands:

```bash
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs
sudo apt-get install npm
sudo npm install -g bower
```

Install other npm dependencies by running: (need root because some libraries use applications, check package.json before to be sure)

```bash
npm install
```

For build the widget you need download grunt:

```bash
sudo npm install -g grunt-cli
```

And now, you can use grunt:

```bash
grunt
```

If everything goes well, you will find a wgt file in the `build` folder.

## Settings

- **Flavor Sync URL**: URL of the Flavor Sync server.
- **User**: User for authenticating with the Flavor Sync server.
- **Password**: User for authenticating with the Flavor Sync server.

## Wiring


### Input Endpoints

`N/A`


### Output Endpoints


- **compare**: Send the two flavors to compare when selected.

## Usage


## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2015 CoNWeT

This project is part of [FIWARE](https://www.fiware.org/). This widget is part of FI-Dash component included in FIWARE.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
