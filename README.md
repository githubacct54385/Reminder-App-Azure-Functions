# Reminder-App-Azure-Functions

# Overview
Code for a cron job which checks for due reminders and triggers an api to send those reminders.

# Environment Variables for local development
Please create a `local.settings.json` file in the reminder-app-azf directory with the following environment variables
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "YOUR_STORAGE_ACCOUNT",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "Auth0Host": "AUTH0_DOMAIN",
    "Auth0ClientId": "AUTH0_CLIENT_ID",
    "Auth0ClientSecret": "AUTH0_CLIENT_SECRET",
    "Auth0Audience": "AUTH0_CLIENT_AUDIENCE",
    "ApiHost": "YOUR_REMINDER_API_HOST"
  }
}

```

# How to run
Open in VS Code and press F5
