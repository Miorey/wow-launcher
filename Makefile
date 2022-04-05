LANGUAGE ?= enUS

run:
	npm run electron:serve

dev_env:
	mkdir -p Data/$(LANGUAGE)

fixtures: clean
	mkdir -p ./Data/enUS


clean:
	rm -rf ./Data/

build:
	 npm run electron:build

