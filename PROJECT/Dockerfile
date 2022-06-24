FROM node:14.16

#Install required packages in os(It is recommended to write it as a spell)
RUN apt-get update && apt-get install -y \
    #Because non-root users use root privileges
    sudo \
    #Get tools from internet
    wget 
    #Use vim as an editor
     


#Creating an application directory
RUN mkdir /app
#Use app directory as development directory
WORKDIR /app

#Package in container.json and packate-lock.Make sure that two of json are copied
COPY . .
# package.Install the package described in json.
RUN npm i
RUN npm run buildDev

#installed node_Copy files such as module to the container side.


CMD ["npm", "run", "start"]
