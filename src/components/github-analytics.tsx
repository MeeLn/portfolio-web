"use client";

import { useEffect, useState } from "react";
import { projects } from "@/data/projects";

type ContributionDay = { date: string; count: number; level: number };
type ContributionPayload = { contributions?: ContributionDay[] };
type Repo = { language: string | null };
type GitHubState = {
  status: "loading" | "live" | "partial" | "unavailable";
  repoCount: number | null;
  languages: [string, number][];
  contributions: ContributionDay[];
};

const initial: GitHubState = {
  status: "loading",
  repoCount: null,
  languages: [],
  contributions: [],
};

export default function GitHubAnalytics() {
  const [data, setData] = useState(initial);

  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      const headers = { Accept: "application/vnd.github+json" };
      let repoCount: number | null = null;
      let languages: [string, number][] = [];
      let contributions: ContributionDay[] = [];
      let received = 0;
      const profileTask = fetch("https://api.github.com/users/MeeLn", {
        headers,
        signal: controller.signal,
      }).then(async (response) => {
        if (!response.ok) throw new Error("GitHub profile unavailable");
        const body: unknown = await response.json();
        if (
          typeof body !== "object" ||
          body === null ||
          !("public_repos" in body) ||
          typeof body.public_repos !== "number"
        )
          throw new Error("GitHub profile response invalid");
        repoCount = body.public_repos;
        received += 1;
      });
      const repositoriesTask = fetch(
        "https://api.github.com/users/MeeLn/repos?per_page=100&sort=updated",
        { headers, signal: controller.signal },
      ).then(async (response) => {
        if (!response.ok) throw new Error("GitHub repositories unavailable");
        const body: unknown = await response.json();
        if (!Array.isArray(body))
          throw new Error("Repository response invalid");
        const repos = body as Repo[];
        const counts = new Map<string, number>();
        repos.forEach((repo) => {
          if (repo.language)
            counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
        });
        const total = [...counts.values()].reduce(
          (sum, count) => sum + count,
          0,
        );
        languages = [...counts.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, count]) => [name, total ? count / total : 0]);
        received += 1;
      });
      const contributionsTask = fetch(
        "https://github-contributions-api.jogruber.de/v4/MeeLn?y=last",
        { headers: { Accept: "application/json" }, signal: controller.signal },
      ).then(async (response) => {
        if (!response.ok) throw new Error("Contribution data unavailable");
        const body = (await response.json()) as ContributionPayload;
        if (!Array.isArray(body.contributions))
          throw new Error("Contribution data invalid");
        contributions = body.contributions.filter(
          (day) =>
            typeof day.date === "string" &&
            typeof day.count === "number" &&
            Number.isFinite(day.count) &&
            typeof day.level === "number",
        );
        received += 1;
      });
      await Promise.allSettled([
        profileTask,
        repositoriesTask,
        contributionsTask,
      ]);
      if (!controller.signal.aborted) {
        setData({
          status:
            received === 3 ? "live" : received > 0 ? "partial" : "unavailable",
          repoCount,
          languages,
          contributions,
        });
      }
    })();
    return () => controller.abort();
  }, []);

  const contributionTotal = data.contributions.reduce(
    (sum, day) => sum + day.count,
    0,
  );
  const weeks: ContributionDay[][] = [];
  data.contributions.forEach((day, index) => {
    const week = Math.floor(index / 7);
    weeks[week] ??= [];
    weeks[week].push(day);
  });
  const stateText = {
    loading: "CONNECTING TO GITHUB",
    live: "CONNECTION ESTABLISHED",
    partial: "PARTIAL DATA FEED",
    unavailable: "PROFILE LINK READY",
  }[data.status];

  return (
    <div className="analytics-console">
      <div className="analytics-head">
        <span>
          <i className={data.status === "live" ? "online" : ""} />
          {stateText}
        </span>
        <span>github.com / MeeLn</span>
      </div>
      <div className="analytics-main">
        <span className="eyebrow">PUBLIC REPOSITORIES</span>
        <strong>
          {data.repoCount === null
            ? "—"
            : String(data.repoCount).padStart(2, "0")}
        </strong>
        <p>
          {data.status === "loading"
            ? "Fetching public profile data…"
            : data.repoCount === null
              ? "Live profile data unavailable · open GitHub directly"
              : "Live public profile data · GitHub REST API"}
        </p>
      </div>
      <div className="github-detail-grid">
        <section className="github-panel" aria-labelledby="contribution-title">
          <div className="github-panel-head">
            <span id="contribution-title">CONTRIBUTIONS / LAST YEAR</span>
            {data.contributions.length > 0 && (
              <b>{contributionTotal.toLocaleString()} total</b>
            )}
          </div>
          {weeks.length > 0 ? (
            <div className="contribution-scroll">
              <div
                className="contribution-grid"
                role="img"
                aria-label="GitHub contribution activity for the last year"
              >
                {weeks.map((week, wi) => (
                  <div className="contribution-week" key={`week-${wi}`}>
                    {Array.from({ length: 7 }, (_, di) => {
                      const day = week[di];
                      return (
                        <i
                          key={day?.date ?? `empty-${wi}-${di}`}
                          data-level={day?.level ?? 0}
                          title={
                            day
                              ? `${day.count} contributions on ${day.date}`
                              : undefined
                          }
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="github-empty">
              {data.status === "loading"
                ? "Loading activity…"
                : "Contribution activity unavailable. View the public profile for current data."}
            </p>
          )}
          <div className="contribution-legend">
            <span>LESS</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <i key={level} data-level={level} />
            ))}
            <span>MORE</span>
          </div>
        </section>
        <section className="github-panel" aria-labelledby="language-title">
          <div className="github-panel-head">
            <span id="language-title">LANGUAGES / RECENT 100 REPOSITORIES</span>
          </div>
          {data.languages.length ? (
            <ul className="language-list">
              {data.languages.map(([name, proportion]) => (
                <li key={name}>
                  <span>{name}</span>
                  <b>{Math.round(proportion * 100)}%</b>
                  <i>
                    <span
                      style={{ width: `${Math.max(2, proportion * 100)}%` }}
                    />
                  </i>
                </li>
              ))}
            </ul>
          ) : (
            <p className="github-empty">
              {data.status === "loading"
                ? "Reading primary languages in public repositories…"
                : "Language data unavailable. No values are estimated."}
            </p>
          )}
        </section>
      </div>
      <div className="analytics-bottom">
        <span>
          CURATED PROJECTS IN THIS ARCHIVE{" "}
          <b>{String(projects.length).padStart(2, "0")}</b>
        </span>
        <span>
          PROFILE <b>PUBLIC</b>
        </span>
      </div>
    </div>
  );
}
