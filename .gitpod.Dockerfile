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
RUN echo '#!/bin/bash\n\
 .nvm/nvm.sh && nvm install 12.13 && npm install -g yarn\n' > nvmInstall.sh
RUN chmod +x nvmInstall.sh
RUN ./nvmInstall.sh
RUN rm -f nvmInstall.sh

USER root
