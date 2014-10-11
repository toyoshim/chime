all:

	@echo "build    ... compile sources and generate chime-*.min.js"
	@echo "checkout ... checkout proper versions of libraries"
	@echo
	@echo " * build may require node.js v0.8.16+, and UglifyJS"

cat:
	cat \
		compat.js \
		../tss/js/tss/AudioLooper.js \
		../tss/js/tss/MasterChannel.js \
		../tss/js/tss/TssChannel.js \
		../tss/js/tss/TString.js \
		../tss/js/tss/TsdPlayer.js \
		../tss/js/tss/TssCompiler.js \
		chime.js \
		> chime-0.1.cat.js

build:
	closure_compiler \
		--compilation_level ADVANCED_OPTIMIZATIONS \
		--js compat.js \
		--js ../tss/js/tss/AudioLooper.js \
		--js ../tss/js/tss/MasterChannel.js \
		--js ../tss/js/tss/TssChannel.js \
		--js ../tss/js/tss/TString.js \
		--js ../tss/js/tss/TsdPlayer.js \
		--js ../tss/js/tss/TssCompiler.js \
		--js chime.js \
		--js_output_file chime-0.1.min.js

checkout:
	bower install
