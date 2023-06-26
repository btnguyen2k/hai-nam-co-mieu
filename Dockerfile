## Sample build command:
# docker build --rm -t hainamcomieu:local .
FROM node:18-alpine AS builder_fe
RUN mkdir /build
RUN apk add jq sed
COPY . /build
RUN cd /build \
    && export APP_NAME=`jq -r '.name' appinfo.json` \
    && export APP_SHORTNAME=`jq -r '.shortname' appinfo.json` \
    && export APP_INITIAL=`jq -r '.initial' appinfo.json` \
    && export APP_VERSION=`jq -r '.version' appinfo.json` \
    && export APP_DESC=`jq -r '.description' appinfo.json` \
    && echo "Building fe..." \
    && cd /build/fe \
    && rm -rf .env \
    && rm -rf dist node_modules \
    && sed -i s/#{pageTitle}/"$APP_NAME v$APP_VERSION"/g public/index.html \
    && sed -i s/#{appName}/"$APP_NAME"/g public/index.html \
    && sed -i s/#{appInitial}/"$APP_INITIAL"/g public/index.html \
    && sed -i s/#{appShortname}/"$APP_SHORTNAME"/g public/index.html \
    && sed -i s/#{appDescription}/"$APP_DESC"/g public/index.html \
    && sed -i s/#{appVersion}/"$APP_VERSION"/g public/index.html \
    && sed -i s/#{appName}/"$APP_NAME"/g src/_shared/config.json \
    && sed -i s/#{appInitial}/"$APP_INITIAL"/g src/_shared/config.json \
    && sed -i s/#{appShortname}/"$APP_SHORTNAME"/g src/_shared/config.json \
    && sed -i s/#{appDescription}/"$APP_DESC"/g src/_shared/config.json \
    && sed -i s/#{appVersion}/"$APP_VERSION"/g src/_shared/config.json \
    && npm install && npm run build

FROM golang:1.19-alpine AS builder_docs
RUN mkdir /build
COPY . /build
RUN cd /build \
    && go install github.com/btnguyen2k/docms/docli@cli-v0.3.1.3 \
    && docli build --purge --src dosrc --out dodata

FROM btnguyen2k/docmsruntime:latest as docmsruntime
LABEL maintainer="Thanh Nguyen"
COPY --from=builder_fe /build/fe/dist/tpl-upconstruction /app/frontend/upconstruction
COPY --from=builder_docs /build/dodata /app/dodata
WORKDIR /app
EXPOSE 8000
CMD ["/app/main"]
