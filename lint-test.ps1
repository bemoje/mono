$lib=$args[0]
yarn eslint --fix "libs/$lib/src/**/*.ts" && yarn test "libs/$lib"
