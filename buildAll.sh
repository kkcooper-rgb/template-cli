#!/bin/sh
h5=$h5,h5exhibitionArea
h5=$h5,h5exhibitorListPage
h5=$h5,h5exhibitionHomePage
#pc
pc=$pc,pcExhibitionHomePage
pc=$pc,gwExhibitList
#custom
custom=$custom,custom
build_name=$1
multi_build_name=`echo $build_name|grep ','`
if [ -n "$multi_build_name" ];then
  multi_build_name=`echo $multi_build_name|sed -e 's/,/\\\|/g'`
fi
build_type=$1
if [ "pc" = "$build_type" ];then
  h5=""
  custom=""
  build_name=""
elif [ "h5" = "$build_type" ]; then
  pc=""
  custom=""
  build_name=""
elif [ "custom" = "$build_type" ]; then
  h5=""
  pc=""
  build_name=""
elif [ "all" = "$build_type" ]; then
  build_name=""
else
  build_type=all
fi
if [ ! -n "$build_name" ];then
  echo build $build_type
  echo $h5 |sed -e 's/,/\n/g'|xargs -r -n 1 npm run 'build:h5'
  echo $pc |sed -e 's/,/\n/g'|xargs -r -n 1 npm run 'build:pc'
  echo $custom |sed -e 's/,/\n/g'|xargs -r -n 1 npm run 'build:custom'
else
  echo build $build_name
  if [ -n "$multi_build_name" ];then
    build_name=${multi_build_name}
  fi
  echo $h5 |sed -e 's/,/\n/g'|grep '^'$build_name'$'|xargs -r -n 1 npm run 'build:h5'
  echo $pc |sed -e 's/,/\n/g'|grep '^'$build_name'$'|xargs -r -n 1 npm run 'build:pc'
  echo $custom |sed -e 's/,/\n/g'|grep '^'$build_name'$'|xargs -r -n 1 npm run 'build:custom'
fi
