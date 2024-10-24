const Queue = require("bull");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const logger = require("../../utils/logger");

// Create a new queue
const videoQueue = new Queue("video processing", {
  redis: {
    host: "redis",
    port: 6379,
  },
});

// Process jobs in the queue
videoQueue.process(async (job, done) => {
  try {
    logger.info("Processing job", job.id);
    const { filePath } = job.data;
    const gifPath = path.join(__dirname, "../../media/gifs");
    // const outputGifPath = filePath.replace("/videos/", "gifs").replace(/\.mp4$/, ".gif");
    // Get the filename from the path
    const filename = path.basename(filePath);
    const outputGifPath = path.join(gifPath, filename.replace(/\.mp4$/, ".gif"));
    // Convert video to GIF using ffmpeg with specified size and FPS
    ffmpeg(filePath)
      .outputOptions([
        "-vf",
        "scale=-1:400", // Set height to 400, width auto-adjusted
        "-r",
        "5", // Set frames per second to 5
      ])
      .output(outputGifPath)
      .on("end", () => {
        logger.info("GIF created successfully");
        done();
      })
      .on("error", (err) => {
        logger.error("Error creating GIF:", err);
        done(new Error("Failed to create GIF"));
      })
      .run();
  } catch (error) {
    done(new Error("Job processing failed"));
  }
});

// Handle failed jobs
videoQueue.on("failed", (job, err) => {
  logger.error(`Job failed with error: ${err.message}`);
  // Optionally, re-add the job to the queue for reprocessing
  job.retry();
});

videoQueue.on("completed", (jobId, result) => {
  logger.info(`Job completed with result: ${result}`);
});

videoQueue.on("progress", (jobId, progress) => {
  logger.info(`Job ${jobId} progress: ${progress}`);
});

videoQueue.on("error", (error) => {
  logger.error(`Error: ${error}`);
});

videoQueue.on("waiting", (jobId) => {
  logger.info(`Job ${jobId} is waiting`);
});

videoQueue.on("active", (jobId, prev) => {
  logger.info(`Job ${jobId} is active, previous state was ${prev}`);
});

videoQueue.on("stalled", (jobId) => {
  logger.info(`Job ${jobId} is stalled`);
});

module.exports = videoQueue;
