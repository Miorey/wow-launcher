LANGUAGE ?= enUS

run:
	npm run electron:serve

dev_env:
	mkdir -p Data/$(LANGUAGE)

fixtures: clean
	cp -r ./fixtures/client/* .

build:
	 npm run electron:build

http-server:
	http-server -c-1 --cors=Authorization -p 9000 ./fixtures/json_server

clean:
	rm -rf ./Data
	rm -rf ./Interface
	rm -rf ./murloc.mp3
	rm -rf ~/Library/Application\ Support/wow-launcher/storage

rebuild: clean dev_env

create_dist:
	mkdir .\dist_electron\win-unpacked\Data
	mkdir .\dist_electron\win-unpacked\Data\enUS
	cp .\config.json .\dist_electron\win-unpacked\config.json
