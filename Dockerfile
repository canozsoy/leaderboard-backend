FROM node:16.15.0-alpine3.15@sha256:bb776153f81d6e931211e3cadd7eef92c811e7086993b685d1f40242d486b9bb

# UPDATE AND UPGRADE, ADD DUMB-INIT
RUN apk -U upgrade
RUN apk add dumb-init

# SWICH ENVIRONMENT TO PRODUCTION, COPY EVERYTHING TO WORKING DIRECTORY AS NODE USER AND NODE GROUP
ENV NODE_ENV production
WORKDIR /app
COPY --chown=node:node . /app

# INSTALL ONLY PRODUCTION PACKAGES AND SWITCH TO NODE USER
RUN npm ci --only=production
USER node

CMD ["dumb-init", "node", "app.js"]

# SEE https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/ for more info
# see again and again and again and again
