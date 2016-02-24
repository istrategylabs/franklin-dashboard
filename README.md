# Franklin Dashboard

Franklin Dashboard allows you to check and manage your Franklin Projects. 

## Installation

1. Install [docker toolbox](https://www.docker.com/toolbox)
1. Initialize your docker machine system if you have not already: `docker-machine start default`
1. In a new shell run `docker-machine ip default` to find out the IP (`<my-ip>`) of your container
1. Create a .env file at the root of the project. (See below for .env contents)
1. `docker build -t franklin-dashboard .`
1. `docker run -t -p 3000:3000 franklin-dashboard`
1. Visit site at `<my-ip>:3000` to view the deployed site
1. `CTRL+C` will stop the running instance
1. You will also need the above address to configure the franklin-api and you're github application
1. Run commands inside the container like such: `docker run -t franklin-dashboard <your-cmd>`

## Cleanup

1. `docker stop $(docker ps -a -q)`
1. `docker rm $(docker ps -a -q)`
1. `docker rmi franklin-dashboard`

## Config

- You will need a `.env` file in the root of your project that defines the following keys:


    ```
      FRANKLIN_API_URL=<franklin_api_url>   - Franklin API URL
      BASE_URL=http://localhost:3000        - App url for e2e testing only
      TEST_USER=example@isl.co              - Github user for e2e testing only
      TEST_PASS=1234                        - Github password for e2e testing only
    ```

## Without Docker

- To run Franklin Dashboard with Express you need to run the following commands:
- `npm install`
- to build, cachebust, and minify all assets use:
- `npm run build`
- and finally to run the app use:
- `npm run start`


## Test

- To run unit tests you should run `npm test`
- To run e2e tests you should run `gulp e2e`

## Deployment

Subsequent deploys will all work from Master.
