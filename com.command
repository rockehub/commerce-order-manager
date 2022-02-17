#!/bin/bash

DIR=~/com/commerce-order-manager
if [ ! -d $DIR ]; then
  # Take action if $DIR exists. #
echo "Installing com files in ${DIR}..."

mkdir ~/com/

cd ~/com/

git clone https://github.com/rockehub/commerce-order-manager.git

fi

DIR2=~/com/commerce-order-manager/node_modules
if [ ! -d $DIR2 ]; then
  cd ~/com/commerce-order-manager/
  echo "Installing dependecies files in ${DIR}..."
  npm install
fi


which -s brew
if [[ $? != 0 ]] ; then
echo "Installing brew files in ${DIR}..."
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
export PATH="/usr/local/opt/python/libexec/bin:$PATH"
else
    brew update
fi

which -s python
if [[ $? != 0 ]] ; then
  echo "Installing python files in ${DIR}..."
brew install python
fi

DIR3=~/com/commerce-order-manager/http/node_modules
if [ ! -d $DIR3 ]; then
 cd ~/com/commerce-order-manager/http
  echo "Installing dependecies files in ${DIR}..."
  npm install
fi

echo "checking for updates ..."
cd ~/com/commerce-order-manager

git pull origin master

echo "starting com"

npm start
