#!/bin/sh
cordova clean
cordova-hcp build
cordova build android --release
sleep 1
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../../phone/security/android.keystore ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk pakobots-key
rm ./release/*.apk
cp ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./release
rename s/-unsigned// ./release/*.apk
zipalign -fv 4 ./release/*.apk ./release/final.apk
zipalign -cv 4 ./release/final.apk
