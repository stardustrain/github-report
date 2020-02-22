## Github report bot

Send weekly data of Github to channel in slack at every Sat 1:00 am.

<div>
<img width=400 src="https://user-images.githubusercontent.com/9318449/75100888-6a8bba00-5617-11ea-9302-574a5a606d1c.png" />
</div>

## Environment

### Development

- typescript 3.7
- axios
- @slack/webhook
- ramda

### Deployment

- Google cloud platform: To use gcloud sdk on cli commmand.

### Execution evironment

- index.js to executing at GCP functions.
- GCP cloud scheduler sending trigger event for run index.js functions at every Sat 1:00 am.
- Environment variable was set in GCP functions.

## Run project

1. Set env variable GITHUB_API_KEY and HOOK_URL.
2. `git clone https://github.com/stardustrain/github-report.git`
3. `cd github-report && npm install && npm run start`

## Deployment

1. Install [gcloud sdk](https://cloud.google.com/sdk/docs/downloads-interactive?hl=ko).
2. Run `gcloud init` command, and select(or create) project.
3. First time, run `npm run build` and executing `gcloud functions deploy sendGithubWeeklyReportWebhook --runtime RUNTIME --trigger-topic TOPIC_NAME --update-env-vars GITHUB_API_KEY=YOUR_KEY,HOOK_URL=YOUR_URL`, cause set to env variable in GCP functions.
4. If success to deploy, use `npm run deploy` command on next deployment.
