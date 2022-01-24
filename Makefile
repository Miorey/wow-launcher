LANGUAGE ?= enUS

run:
	npm run electron:serve

dev_env:
	mkdir -p Data/$(LANGUAGE)

clean:
	rm -rf ./Data/

build:
	 npm run electron:build

