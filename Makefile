LANGUAGE ?= enUS

run:
	npm run electron:serve

dev_env:
	mkdir -p Data/$(LANGUAGE)

fixtures: clean
	cp -r ./fixtures/client/* .


clean:
	rm -rf ./Data/

build:
	 npm run electron:build

