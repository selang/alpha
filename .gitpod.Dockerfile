FROM gitpod/workspace-full

# change node version
USER gitpod
ENV NODE_VERSION=12.14.0
RUN bash -c "source ~/.nvm/nvm-lazy.sh && nvm install $NODE_VERSION"
ENV PATH=/home/gitpod/.nvm/versions/node/v${NODE_VERSION}/bin:$PATH

USER root
