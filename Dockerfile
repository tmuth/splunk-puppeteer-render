FROM knyttan/puppeteer

# docker rm /splunk-puppeteer
# docker build -t spl-puppeteer  --build-arg CACHE_BUST=$(date +%s) .
# docker run -it --name splunk-puppeteer --mount type=bind,source="/Users/tmuth/Downloads/puppeteer-out",target=/app/shared --cap-add=SYS_ADMIN spl-puppeteer

ARG CACHE_BUST
USER root
RUN mv /etc/apt/sources.list.d/google-chrome-unstable.list /etc/apt/sources.list.d/google-chrome-unstable.list.bak
RUN apt-get update
#RUN apt-get install apt-transport-https
#RUN apt-get install apt-transport-https ca-certificates


RUN apt-get install -yq --ignore-missing \
    gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
    libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 \
    libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
    fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget vim

USER pptr
RUN mkdir /app/shared