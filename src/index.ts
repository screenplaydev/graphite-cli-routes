import * as t from "@screenplaydev/retype";
import { asRouteTree } from "@screenplaydev/retyped-routes";

const API_ROUTES = asRouteTree({
  logCommand: {
    method: "POST",
    url: "/graphite/log-command",
    params: {
      commandName: t.string,
      durationMiliSeconds: t.number,
      user: t.string,
      version: t.optional(t.string),
      err: t.optional(
        t.shape({
          name: t.string,
          message: t.string,
          stackTrace: t.string,
          debugContext: t.optional(t.string),
        })
      ),
    },
  },
  upgradePrompt: {
    method: "GET",
    url: "/graphite/upgrade",
    queryParams: {
      user: t.string,
      currentVersion: t.string,
    },
    response: {
      prompt: t.optional(
        t.shape({
          message: t.string,
          blocking: t.boolean,
        })
      ),
    },
  },
  feedback: {
    method: "POST",
    url: "/graphite/feedback",
    params: {
      user: t.string,
      message: t.string,
      debugContext: t.optional(t.string),
    },
  },
} as const);

export default API_ROUTES;
