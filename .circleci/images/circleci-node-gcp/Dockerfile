FROM circleci/node:10.14.2-browsers

USER root

ENV CCI /home/circleci
ENV GTMP /tmp/gcloud-install
ENV GSDK $CCI/google-cloud-sdk
ENV PATH="${GSDK}/bin:${PATH}"

# do all system lib installation in one-line to optimize layers
RUN curl -sSL https://sdk.cloud.google.com > $GTMP && bash $GTMP --install-dir=$CCI --disable-prompts \
  && rm -rf $GTMP \
  && chmod +x $GSDK/bin/* \
  \
  && chown -Rf circleci:circleci $CCI

# change back to the user in the FROM image
USER circleci
