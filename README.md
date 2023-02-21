![Logo](admin/pylontech-serial.png)
# ioBroker.pylontech-serial

[![NPM version](https://img.shields.io/npm/v/iobroker.pylontech-serial.svg)](https://www.npmjs.com/package/iobroker.pylontech-serial)
[![Downloads](https://img.shields.io/npm/dm/iobroker.pylontech-serial.svg)](https://www.npmjs.com/package/iobroker.pylontech-serial)
![Number of Installations](https://iobroker.live/badges/pylontech-serial-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/pylontech-serial-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.pylontech-serial.png?downloads=true)](https://nodei.co/npm/iobroker.pylontech-serial/)


## pylontech-serial adapter for ioBroker

Adapter to read pylontech batteries

### DISCLAIMER

Please make sure that you consider copyrights and trademarks when you use names or logos of a company and add a disclaimer to your README.
You can check other adapters for examples or ask in the developer community. Using a name or logo of a company without permission may cause legal problems for you.

### Getting started

You need a special Serial-Cable Pinout

with
Serial		RJ45
    GND on pin 8
     RX	on pin 3
     TX on pin 6
     
     
### Publishing the adapter
Using GitHub Actions, you can enable automatic releases on npm whenever you push a new git tag that matches the form 
`v<major>.<minor>.<patch>`. We **strongly recommend** that you do. The necessary steps are described in `.github/workflows/test-and-release.yml`.

Since you installed the release script, you can create a new
release simply by calling:
```bash
npm run release
```
To get your adapter released in ioBroker, please refer to the documentation 
of [ioBroker.repositories](https://github.com/ioBroker/ioBroker.repositories#requirements-for-adapter-to-get-added-to-the-latest-repository).


## Changelog
0.0.20 First running Version

## License
MIT License

Copyright (c) 2023 hipposen <hipposen@gmx.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
