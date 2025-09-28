# Simple-Flashcard-App
A simple flashcard app with a server that communicates with a database and exposes routes to the front end. It also utilizes the Gemini API to generate example sentences to help with studying flashcard terms.

I hosted this app two different ways to learn more about web app hosting and deployment. This is the initial and most primitive version of the app containing both the client and server files, which was dockerized and hosted on a local Ubuntu virtual machine. I created separate repositories containing just the [front end](https://github.com/teena1313/flashcard-app-ftend) and [back end](https://github.com/teena1313/flashcard-app-bcknd) of the app in order to host it on Azure Web Apps (more info below). The separate repositories contain the most updated version of the app. Eventually I would like to make this a functional flashcard application that can help me study French.

## Demo
You can access the cloud-hosted app yourself [here](https://notecard-ftend-faa6dna6dnetgwa6.westus-01.azurewebsites.net/) or watch my [demo video](https://youtu.be/MsdW5I5AijM)! Please note that you have to be very patient upon your first time accessing the webpage.

## Tech Stack
- Front End: Node JS
- Back End Server: Express
  - [Webpack Dev Server](https://webpack.js.org/) is used to bundle the files and provide live-reloading.
- Database: PostgreSQL

## How I dockerized and hosted the app on a local Ubuntu machine
- I created a new Ubuntu virtual machine with the Ubuntu 24.04 ISO image via Proxmox that runs on a personal machine.
- I installed Portainer to help me manage the docker images and containers, following [this tutorial](https://www.cherryservers.com/blog/install-portainer-ubuntu)
- I pulled the compose file from [this github](https://github.com/khezen/compose-postgres) which composes the pgAdmin interface with PostgreSQL, then ran the container stack.
- Using the pgAdmin interface, I created a database for this project. This is the information I used to establish a connection with the PostgreSQL database using node-postgres.
- I set up the Docker / React environment, then wrote Docker files to generate docker images for the front end, back end, and database of the app, and finally a Docker compose file to run and manage all the relevant containers. Here are the tutorials I referenced for setting up my environment and writing the files:
  - https://www.docker.com/blog/how-to-dockerize-react-app/
  - https://github.com/AntonioMaccarini/dockerize-react-node-postgres-nginx-application/tree/master

## How I hosted this app on Cloud
- I created separate repositories to host the front end and the back end of the app on separate Azure Web Apps
  - I ran into a lot of issues trying to connect the hosted front end to my hosted back end because this app is technically not production-ready. I had to make some awkward fixes to the webpack config file, but I was mainly just trying to learn how Azure Web Apps worked so I worked with what I had. A future development to-do is to have a production vs development config.
  - [Microsoft's documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/deploy-react?pivots=github) provided some basic information but was not very helpful, probably because not many people are trying to upload this kind of app to Azure Web Apps.
- I then hosted my PostgreSQL database on AWS since they have a free tiered database available (however, this was a bit misleading since you still have to pay for using a public IPV4 address).
  - Connecting the server to the database was a bit tricky but worked after I added the correct certificate to the repository.
- A pretty noticeable issue with the hosted web app is that it takes a long time for the initial API fetch calls to run, so the initial loading of the decks / cards can take a while. I'm not sure where this issue is stemming from, maybe because the app is still running on a development server?

## How I connected the application to Gemini
This was a lot easier than I though it would be! [Google's Quick Start Guide](https://ai.google.dev/gemini-api/docs/quickstart) was really helpful, basically you just have to run `npm install @google/genai` on the server side, then follow their instruction on how to start an AI client in the code. I chose Gemini since it has a free tier option and I'm not trying to make a production-level application yet. Ideally I would've used Claude for its better word-processing abilities though.
