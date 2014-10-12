help:
	@echo "clean ... remove files that are fetched by make tools"
	@echo "tools ... checkout tools and third party libraries"
	@echo "build ... compile sources and generate chime-*.min.js"

clean:
	rm -rf node_modules bower_components

tools:
	npm install bower
	./node_modules/bower/bin/bower install

build:
	cat \
		compat.js \
		bower_components/tss/js/tss/AudioLooper.js \
		bower_components/tss/js/tss/MasterChannel.js \
		bower_components/tss/js/tss/TssChannel.js \
		bower_components/tss/js/tss/TString.js \
		bower_components/tss/js/tss/TsdPlayer.js \
		bower_components/tss/js/tss/TssCompiler.js \
		api.js | \
	./bower_components/uglify-js/bin/uglifyjs \
		--output chime-0.94.2.min.js
