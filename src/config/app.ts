export const appMode = (): ("worker" | "api") => {
    if (process.env.APP_MODE === "worker"){
      return "worker";
    }
    return "api";
  }