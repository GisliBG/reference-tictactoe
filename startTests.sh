#!/bin/bash

npm run test-prod

echo client side testing
cd ./client
CI=true npm run test-prod


