FROM gitpod/workspace-full

USER root

# Install custom tools, runtime, etc. using apt-get
# For example, the command below would install "bastet" - a command line tetris clone:
#
# RUN apt-get update \
#    && apt-get install -y bastet \
#    && apt-get clean && rm -rf /var/cache/apt/* && rm -rf /var/lib/apt/lists/* && rm -rf /tmp/*
#
# More information: https://www.gitpod.io/docs/42_config_docker/
USER gitpod
ENV NODE_VERSION=12.14.0
RUN echo '#!/bin/bash\n\
 source ~/.nvm/nvm-lazy.sh && nvm install $NODE_VERSION && nvm use $NODE_VERSION\n' > nvmInstall.sh
RUN chmod +x nvmInstall.sh
RUN sudo ./nvmInstall.sh
RUN rm -f nvmInstall.sh

USER root
