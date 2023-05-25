npm version patch && \
    bash build.sh && \
    rm -rf to-npm && \
    mkdir -p to-npm/dist
    cp dist/* to-npm/dist && \
    cp package.json to-npm && \
    cd to-npm && npm pack && \
    git add . && \
    git commit -m "release $(npm pkg get version | tr -d '\"')" && \
    git push && \
    git push origin v$(npm pkg get version | tr -d '"')
    gh release create v$(npm pkg get version | tr -d '"') --generate-notes ./*.tgz && \
    npm publish --access public --tag v$(npm pkg get version | tr -d '"')
