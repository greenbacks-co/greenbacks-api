.PHONY=install,lint,lint-fix,test,test-full,test-integration

install:
	npm install

lint:
	npm run lint

lint-fix:
	npm run lint-fix

test:
	npm run test

test-full:
	npm run test-full

test-integration:
	npm run test-integration
