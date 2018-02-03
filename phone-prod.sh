#!/bin/sh
cordova clean
cordova-hcp build
cordova build android --release
find ./platforms/android/build/outputs/apk/*release* -exec jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../../phone/security/android.keystore {} pakobots-key \;
mkdir -p release
rm ./release/*.apk
find ./platforms/android/build/outputs/apk/*release* -exec cp {} ./release \;
rename s/-unsigned// ./release/*.apk
zipalign -fv 4 ./release/*.apk ./release/final.apk
zipalign -cv 4 ./release/final.apk
