# Franklin Dashboard

Franklin Dashboard allows you to check and manage your Franklin Projects. Have you seen inception? If not, watch it.

## Usage

- You will need a `.env` file in the root of your project that defines the following keys:


    ```
    	GITHUB_CLIENT_ID=<your_github_client_id>    		- App's Github Client ID
    	FRANKLIN_API_URL=<franklin_api_url>    				- Franklin API URL
		BASE_URL=http://localhost:3000 						- App url for e2e testing only
		TEST_USER=example@isl.co 							- Github user for e2e testing only
		TEST_PASS=1234										- Github password for e2e testing only

    ```

- To run Franklin Dashboard with Browser Sync server you need to run

```
npm install
```
 - and then

```
npm run start
```

- or to build, cachebust, and minify all assets use

```
npm run build
```

## Test

To run e2e tests you should run

```
npm test
```

## Deployment

Franklin can automatically bootstrap itself. More on this eventually. Subsequent deploys will all work from Master.
