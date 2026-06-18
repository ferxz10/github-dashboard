from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from collections import defaultdict
from datetime import datetime, timedelta
import asyncio

app = FastAPI(title="GitHub Dashboard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GITHUB_API = "https://api.github.com"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

HEADERS = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
}

if GITHUB_TOKEN:
    HEADERS["Authorization"] = f"Bearer {GITHUB_TOKEN}"


async def github_get(client: httpx.AsyncClient, url: str) -> dict | list:
    response = await client.get(url, headers=HEADERS)
    if response.status_code == 404:
        raise HTTPException(status_code=404, detail="User not found")
    if response.status_code == 403:
        raise HTTPException(status_code=429, detail="Rate limit of GitHub reached. Please try again in a few minutes.")
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error connecting to GitHub")
    return response.json()


@app.get("/api/user/{username}")
async def get_user_profile(username: str):
    async with httpx.AsyncClient(timeout=15.0) as client:
        user = await github_get(client, f"{GITHUB_API}/users/{username}")
        return {
            "login": user.get("login"),
            "name": user.get("name"),
            "avatar_url": user.get("avatar_url"),
            "bio": user.get("bio"),
            "public_repos": user.get("public_repos", 0),
            "followers": user.get("followers", 0),
            "following": user.get("following", 0),
            "created_at": user.get("created_at"),
            "location": user.get("location"),
            "company": user.get("company"),
            "blog": user.get("blog"),
        }


@app.get("/api/repos/{username}")
async def get_user_repos(username: str):
    async with httpx.AsyncClient(timeout=15.0) as client:
        repos = []
        page = 1
        while len(repos) < 100:
            data = await github_get(
                client,
                f"{GITHUB_API}/users/{username}/repos?per_page=100&page={page}&sort=updated"
            )
            if not data:
                break
            repos.extend(data)
            if len(data) < 100:
                break
            page += 1

        top_repos = sorted(repos, key=lambda r: r.get("stargazers_count", 0), reverse=True)[:10]

        lang_count = defaultdict(int)
        lang_bytes = defaultdict(int)
        for repo in repos:
            if repo.get("language"):
                lang_count[repo["language"]] += 1
                lang_bytes[repo["language"]] += repo.get("size", 0)

        total_stars = sum(r.get("stargazers_count", 0) for r in repos)
        total_forks = sum(r.get("forks_count", 0) for r in repos)
        forked = sum(1 for r in repos if r.get("fork"))
        original = len(repos) - forked

        return {
            "total_repos": len(repos),
            "total_stars": total_stars,
            "total_forks": total_forks,
            "original_repos": original,
            "forked_repos": forked,
            "languages": dict(sorted(lang_count.items(), key=lambda x: x[1], reverse=True)),
            "languages_bytes": dict(sorted(lang_bytes.items(), key=lambda x: x[1], reverse=True)),
            "top_repos": [
                {
                    "name": r["name"],
                    "description": r.get("description", ""),
                    "stars": r.get("stargazers_count", 0),
                    "forks": r.get("forks_count", 0),
                    "language": r.get("language"),
                    "url": r.get("html_url"),
                    "updated_at": r.get("updated_at"),
                    "topics": r.get("topics", []),
                }
                for r in top_repos
            ]
        }


@app.get("/api/activity/{username}")
async def get_user_activity(username: str):
    async with httpx.AsyncClient(timeout=15.0) as client:
        events = await github_get(
            client,
            f"{GITHUB_API}/users/{username}/events/public?per_page=100"
        )

        monthly = defaultdict(int)
        event_types = defaultdict(int)
        now = datetime.utcnow()

        for event in events:
            created = event.get("created_at", "")
            if created:
                dt = datetime.fromisoformat(created.replace("Z", "+00:00")).replace(tzinfo=None)
                if (now - dt).days <= 365:
                    month_key = dt.strftime("%Y-%m")
                    monthly[month_key] += 1
                    event_types[event.get("type", "Unknown")] += 1

        months = []
        for i in range(11, -1, -1):
            d = now - timedelta(days=30 * i)
            months.append(d.strftime("%Y-%m"))

        monthly_data = [
            {"month": m, "count": monthly.get(m, 0)}
            for m in months
        ]

        return {
            "monthly_activity": monthly_data,
            "event_types": dict(sorted(event_types.items(), key=lambda x: x[1], reverse=True)[:8]),
            "total_events": len(events),
        }


@app.get("/api/dashboard/{username}")
async def get_full_dashboard(username: str):
    async with httpx.AsyncClient(timeout=20.0) as client:
        try:
            user_task = github_get(client, f"{GITHUB_API}/users/{username}")
            repos_task = github_get(
                client,
                f"{GITHUB_API}/users/{username}/repos?per_page=100&sort=updated"
            )
            events_task = github_get(
                client,
                f"{GITHUB_API}/users/{username}/events/public?per_page=100"
            )

            user, repos, events = await asyncio.gather(user_task, repos_task, events_task)

            lang_count = defaultdict(int)
            for repo in repos:
                if repo.get("language"):
                    lang_count[repo["language"]] += 1

            total_stars = sum(r.get("stargazers_count", 0) for r in repos)
            total_forks = sum(r.get("forks_count", 0) for r in repos)

            top_repos = sorted(repos, key=lambda r: r.get("stargazers_count", 0), reverse=True)[:8]

            monthly = defaultdict(int)
            event_types = defaultdict(int)
            now = datetime.utcnow()

            for event in events:
                created = event.get("created_at", "")
                if created:
                    dt = datetime.fromisoformat(created.replace("Z", "+00:00")).replace(tzinfo=None)
                    if (now - dt).days <= 365:
                        month_key = dt.strftime("%Y-%m")
                        monthly[month_key] += 1
                        event_types[event.get("type", "Unknown")] += 1

            months = []
            for i in range(11, -1, -1):
                d = now - timedelta(days=30 * i)
                months.append(d.strftime("%Y-%m"))

            monthly_data = [{"month": m, "count": monthly.get(m, 0)} for m in months]

            return {
                "profile": {
                    "login": user.get("login"),
                    "name": user.get("name"),
                    "avatar_url": user.get("avatar_url"),
                    "bio": user.get("bio"),
                    "public_repos": user.get("public_repos", 0),
                    "followers": user.get("followers", 0),
                    "following": user.get("following", 0),
                    "created_at": user.get("created_at"),
                    "location": user.get("location"),
                    "company": user.get("company"),
                    "blog": user.get("blog"),
                },
                "stats": {
                    "total_stars": total_stars,
                    "total_forks": total_forks,
                    "original_repos": sum(1 for r in repos if not r.get("fork")),
                    "forked_repos": sum(1 for r in repos if r.get("fork")),
                },
                "languages": dict(sorted(lang_count.items(), key=lambda x: x[1], reverse=True)[:10]),
                "top_repos": [
                    {
                        "name": r["name"],
                        "description": r.get("description") or "",
                        "stars": r.get("stargazers_count", 0),
                        "forks": r.get("forks_count", 0),
                        "language": r.get("language"),
                        "url": r.get("html_url"),
                        "topics": r.get("topics", [])[:3],
                    }
                    for r in top_repos
                ],
                "activity": {
                    "monthly": monthly_data,
                    "event_types": dict(sorted(event_types.items(), key=lambda x: x[1], reverse=True)[:6]),
                }
            }
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok", "message": "GitHub Dashboard API running successfully"}