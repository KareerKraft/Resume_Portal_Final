import mongoose from "mongoose";

let retryTimer = null;
let hasLoggedAtlasHint = false;

const getMongoUris = () => {
  const primaryURI = process.env.MONGODB_URI?.trim();
  const fallbackURI =
    process.env.MONGODB_URI_FALLBACK?.trim() ||
    process.env.MONGODB_LOCAL_URI?.trim();

  return { primaryURI, fallbackURI };
};

const getConnectionHelp = (errorMessage) => {
  if (errorMessage.includes("querySrv")) {
    return "MongoDB Atlas DNS lookup failed. Check your internet/DNS, Atlas IP whitelist, or set MONGODB_URI_FALLBACK to a non-SRV URI.";
  }

  if (errorMessage.includes("ECONNREFUSED")) {
    return "MongoDB refused the connection. Verify the cluster is reachable from this machine/network.";
  }

  return "Verify MONGODB_URI, internet access, and Atlas network access settings. You can also set MONGODB_URI_FALLBACK.";
};

const tryConnect = async (mongodbURI, label) => {
  if (!mongodbURI) {
    return false;
  }

  try {
    await mongoose.connect(mongodbURI, {
      serverSelectionTimeoutMS: 5000,
    });

    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }

    console.log(`Database connected successfully${label ? ` (${label})` : ""}`);
    return true;
  } catch (error) {
    console.error(`Database connection failed${label ? ` (${label})` : ""}:`, error.message);
    throw error;
  }
};

const connectDB = async () => {
  const { primaryURI, fallbackURI } = getMongoUris();

  if (!primaryURI && !fallbackURI) {
    console.error("Database connection failed: set MONGODB_URI or MONGODB_URI_FALLBACK in server/.env");
    return false;
  }

  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return true;
  }

  try {
    if (primaryURI) {
      return await tryConnect(primaryURI, "MONGODB_URI");
    }
  } catch (error) {
    if (!hasLoggedAtlasHint) {
      console.log(getConnectionHelp(error.message));
      hasLoggedAtlasHint = true;
    }

    if (fallbackURI) {
      console.log("Trying fallback MongoDB connection string...");

      try {
        return await tryConnect(fallbackURI, "MONGODB_URI_FALLBACK");
      } catch (fallbackError) {
        console.error("Fallback MongoDB connection also failed:", fallbackError.message);
      }
    }

    if (!retryTimer) {
      console.log("Retrying MongoDB connection in 10 seconds...");
      retryTimer = setTimeout(async () => {
        retryTimer = null;
        await connectDB();
      }, 10000);
    }

    return false;
  }
};

export default connectDB;
