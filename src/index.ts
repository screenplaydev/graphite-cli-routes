import * as t from "@screenplaydev/retype";
import { asRouteTree } from "@screenplaydev/retyped-routes";

const API_ROUTES = asRouteTree({
  logCommand: {
    method: "POST",
    url: "/graphite/log-command",
    params: {
      commandName: t.string,
      // Yes, I am aware this is a typo, but we need to leave it for backcompat
      durationMiliSeconds: t.number,
      // email via git
      user: t.string,
      version: t.optional(t.string),
      auth: t.optional(t.string),
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
  traces: {
    method: "POST",
    url: "/graphite/traces",
    params: {
      jsonTraces: t.string,
      cliVersion: t.string,
    },
  },
  submitPullRequests: {
    method: "POST",
    url: "/graphite/submit/pull-requests",
    params: {
      authToken: t.string,
      repoOwner: t.string,
      repoName: t.string,
      prs: t.array(
        t.unionMany([
          t.shape({
            action: t.literals(["create"] as const),
            head: t.string,
            base: t.string,
            title: t.string,
            body: t.optional(t.string),
            draft: t.optional(t.boolean),
          }),
          t.shape({
            action: t.literals(["update"] as const),
            head: t.string,
            base: t.string,
            prNumber: t.number,
          }),
        ])
      ),
    },
    response: {
      prs: t.array(
        t.unionMany([
          t.shape({
            head: t.string,
            prNumber: t.number,
            prURL: t.string,
            status: t.literals(["updated", "created"] as const),
          }),
          t.shape({
            head: t.string,
            error: t.string,
            status: t.literals(["error"] as const),
          }),
        ])
      ),
    },
  },
  pullRequestInfo: {
    // This operation is idempotent - but we're making it a POST to hack around
    // the need to supply an array of PR numbers (which would otherwise need
    // to be serialized and de-serialized in a GET request).
    method: "POST",
    url: "/graphite/pull-requests",
    params: {
      authToken: t.string,
      repoOwner: t.string,
      repoName: t.string,
      prNumbers: t.array(t.number),
    },
    response: {
      prs: t.array(
        t.shape({
          prNumber: t.number,
          title: t.string,
          state: t.literals(["OPEN", "CLOSED", "MERGED"] as const),
          reviewDecision: t.literals([
            "CHANGES_REQUESTED",
            "APPROVED",
            "REVIEW_REQUIRED",
            null,
            undefined,
          ] as const),
          baseRefName: t.string,
          url: t.string,
          isDraft: t.boolean,
        })
      ),
    },
  },
} as const);

export default API_ROUTES;
