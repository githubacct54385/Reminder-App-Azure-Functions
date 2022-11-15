import { AzureFunction, Context } from "@azure/functions";
require("isomorphic-fetch");

const timerTrigger: AzureFunction = async function (
  context: Context,
  myTimer: any
): Promise<void> {
  const timeStamp = new Date().toISOString();

  if (myTimer.isPastDue) {
    context.log("Timer function is running late!");
  }
  // get an auth token
  const authTokenResponse = await fetch(
    `${process.env.Auth0Host}/oauth/token`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: process.env.Auth0ClientId,
        client_secret: process.env.Auth0ClientSecret,
        audience: process.env.Auth0Audience,
      }),
    }
  );

  const authTokenJson = await authTokenResponse.json();
  const accessToken = authTokenJson["access_token"];

  // call the express api to get the due reminders
  const dueRemindersResponse = await fetch(
    `${process.env.ApiHost}/reminders/due-reminders`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );

  const dueRemindersJson = await dueRemindersResponse.json();
  context.log(dueRemindersJson);

  if (dueRemindersJson.success && dueRemindersJson.data.length > 0) {
    const reminderIds: string[] = dueRemindersJson.data.map((p: any) => p.id);
    const sendRemindersResponse = await fetch(
      `${process.env.ApiHost}/reminders/send-due`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reminderIds,
        }),
      }
    );
    const sendRemindersJson = await sendRemindersResponse.json();
    if (sendRemindersJson.success) {
      context.log(
        `successfully sent ${sendRemindersJson.data.length} reminders`
      );
    } else {
      context.log(`failed to send reminders`);
    }
  } else {
    context.log(`no reminders to send or failed to get due reminders`);
  }

  context.log("Timer trigger function ran!", timeStamp);
};

export default timerTrigger;
