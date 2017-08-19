#!/bin/sh
cordova clean
cordova-hcp build
cordova build android --release
find ./platforms/android/build/outputs/apk/*release* -exec jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../security/android.keystore {} apps \;
mkdir -p release
rm release/*.apk
find ./platforms/android/build/outputs/apk/*release* -exec cp {} ./release \;
rename s/-unsigned// ./release/*.apk
