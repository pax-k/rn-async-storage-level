rm -rf dist && \
    yarn parcel build && \
    echo "import { TextEncoder, TextDecoder } from 'text-encoding'" | cat - dist/main.js > temp && mv temp dist/main.js && \
    yarn browserify