import cron from "node-cron";

const task = (): void => {
    console.log("Running a scheduled task at: ", new Date());
}

// cron.schedule("* * * * *", task); --> run at every min
cron.schedule("* * * * * *", task); // --> run at every second