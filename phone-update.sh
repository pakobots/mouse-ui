#!/bin/sh
cordova-hcp build
rsync -avr ./www/ jump:web/kiosk/4101/
ssh -t jump "rsync -avr web/kiosk/4101/ web:/var/www/html/chip/dip/update/"
