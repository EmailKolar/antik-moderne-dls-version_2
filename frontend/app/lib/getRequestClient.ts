import Client, { Environment, Local } from "./client";

const LocalKubernetes = "http://localhost:30002";
const DeployedProdBaseURL = "https://antik-moderne.realkoder.com";

/**
 * Returns the generated Encore request client for either the local or staging environment.
 * If we are running the frontend locally we assume that our Encore backend is also running locally.
 */
const getRequestClient = (token: string | undefined, isSSRFetch?: boolean) => {
  let env: string;
  const VITE_ENV = import.meta.env.VITE_ENV;

  if (isSSRFetch && (VITE_ENV === "local-kubernetes" || VITE_ENV === "selfhost-prod")) {
    env = "http://encore-app:8080";
  } else {
    if (import.meta.env.VITE_ENV === "selfhost-prod") {
      env = DeployedProdBaseURL;
    } else {
      env = import.meta.env.DEV ? Local : import.meta.env.VITE_ENV === "local-kubernetes" ? LocalKubernetes : Environment("staging");
    }
  }

  return new Client(env, {
    auth: { authorization: token || "" },
  });

};

export default getRequestClient;