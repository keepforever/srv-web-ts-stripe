# to specify a node version
# FROM node:8
# to grab the latest version
FROM node

# Create app directory, removed 'src' from the path to avoid 
# having multiple "src" directories. 
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
# This command copies EVERYTHING, so, we don't want the dist folder 
# nor the node_modules (as they created within the container )
COPY . .

# we need to convert the typescript we wrote our server in to javascript
# this will create the 'dist' directory

# ~~~~~~~~~~~~~~~~~~ FROM HERE ~~~~~~~~~~~~~~~~~~~~~~ #
RUN npm run build
# This is not the most efficient way to build. "Multi-stage builds"
# are considered best practice. 

# having run the 'npm run build' command, we now have a dist folder.
# we want to copy some files into this folder because it serves as 
# our new 'root' directory. So we copy over a couple config files 
# from our source code root into the newly minted 'dist' folder

# copy ormconfig.json to the 'dist' dir
COPY ormconfig.json ./dist/

# do the same thing with the enviornment variables
COPY .env ./dist/

# change the working directory 
WORKDIR ./dist

# ~~~~~~~~~~~~~~~~~~~~~~~~~~ TO HERE ~~~~~~~~~~~~~~ are commands necessary 
# due to typescript. 

# 
EXPOSE 4000

# we could start the server this way:
# CMD [ "npm", "start" ]
# but it's better to use Node directly, so instead: 
CMD node src/index.js
# this works because we reset the WORKDIR to 'dist', so, 
# the 'src/index.js' path is relative to that dist directory. 


################################################################
# the commands below here are meant to be run in the terminal ##
################################################################


# this command builds the image
# the -t flag indicates we are naming the container.  
# what follows the '-t' is the name, in this case, 'stripe-example'
# the '.' at the end of the command tells docker to look for the 
# Dockerfile in the current directory from which you ran 
# the terminal command.  

# $ docker build -t stripe-example .

# next, we need to run the image with the following command
# '-p' flag is to specify a port
# 8001 is the port for our computer to access the container 
# 4000 is the port inside the container. 
# we "EXPOSE 4000" in the dockerfile as well as specifying 4000 in our
# server's index.js file 
# in short, accessing port 8001 on your computer is like accessing 
# port 4000 in the docker container

# $ docker run -p 8001:4000 stripe-example

# NOTE: this command will fail if you do not update the "host" key in
# the ormconfig.json file to "host.docker.internal", which allows our
# container access to the postgres database running OUTSIDE of the 
# container, on our local machine. 

# NOTE: after you update any of your files, you need to rebuild the image
# for the changes to take affect.

# LASTLY: when you run the container, the console output 
# will indicate '...running on 4000', but we have to access
# it at http://localhost:8001/graphql