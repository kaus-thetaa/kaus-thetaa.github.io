import {writeFile,readFile} from 'node:fs/promises';
const profile=JSON.parse(await readFile(new URL('../data/profile.json',import.meta.url)));
const headers={'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'portfolio-sync'};
if(process.env.GITHUB_TOKEN)headers.Authorization=`Bearer ${process.env.GITHUB_TOKEN}`;
async function api(path){const r=await fetch(`https://api.github.com${path}`,{headers});if(!r.ok)throw new Error(`GitHub returned ${r.status} for ${path}`);return r.json();}
let repos=[];
for(let page=1;;page++){const batch=await api(`/users/${encodeURIComponent(profile.githubUsername)}/repos?type=owner&per_page=100&page=${page}`);repos.push(...batch.filter(r=>!r.private));if(batch.length<100)break;}
repos.sort((a,b)=>b.pushed_at.localeCompare(a.pushed_at));
const output=[];
for(const repo of repos){let latestCommit=null;if(repo.size>0){const commits=await api(`/repos/${repo.full_name}/commits?per_page=1`);const c=commits[0];if(c)latestCommit={message:c.commit.message.split('\n')[0],date:c.commit.committer.date,url:c.html_url,repo:repo.name};}output.push({name:repo.name,description:repo.description,language:repo.language,topics:repo.topics,stars:repo.stargazers_count,pushed_at:repo.pushed_at,url:repo.html_url,archived:repo.archived,latestCommit});}
// Every entry came from the public-only user endpoint and an explicit visibility check.
const latestCommit=output.filter(r=>r.name!==`${profile.githubUsername}.github.io`&&r.name!==profile.githubUsername&&!r.archived).map(r=>r.latestCommit).filter(Boolean).sort((a,b)=>b.date.localeCompare(a.date))[0]||null;
const data={updated:new Date().toISOString(),publicRepoCount:output.length,repos:output,latestCommit};
await writeFile(new URL('../data/github.json',import.meta.url),JSON.stringify(data,null,2)+'\n');
console.log(`Synced ${output.length} public repositories.`);
