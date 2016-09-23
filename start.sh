#!/bin/bash -
if ! hostname | grep -i ubuntu > /dev/null; then
	export LD_LIBRARY_PATH=/home/pso/juntaoduan/dataplatform/lib:$LD_LIBRARY_PATH
fi

cd ./authapp

if ! hostname | grep -i ubuntu > /dev/null; then
	nohup python27 main.py -Dauth> authapp.log 2>&1 &
else
	nohup python main.py -Dauth> authapp.log 2>&1 &
fi

echo $! > ../pid
