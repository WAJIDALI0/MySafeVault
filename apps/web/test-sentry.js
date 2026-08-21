const Sentry = require("@sentry/nextjs");

Sentry.init({
  dsn: "https://505953f86a78de5c1e373e496a0db2e4@o4511949760823296.ingest.us.sentry.io/4511949774192640",
  tracesSampleRate: 1.0,
});

try {
  throw new Error("Direct Node.js Test Error to bypass Next.js!");
} catch (e) {
  Sentry.captureException(e);
}

Sentry.close(2000).then(() => {
  console.log("Error successfully sent to Sentry!");
});
