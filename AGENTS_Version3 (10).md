# GitHub Talent Scout Scraper

This Actor scrapes GitHub repositories for contributor information. It retrieves details like GitHub username, contributions, and profile information such as name, company, and location.

## Features
- Scrapes the top-contributing developers to specified repositories.
- Retrieves detailed contributor data such as:
  - GitHub username
  - Total contributions
  - Profile details (name, company, followers, etc.)

## Input Configuration
- **repositories**: List of GitHub repositories to scrape.
- **token**: GitHub Personal Access Token (PAT) for API authentication.
- **topContributors**: Number of contributors to retrieve from each repository.

## Output Schema
- `repository`: Name of the repository.
- `contributors[].login`: GitHub username.
- `contributors[].contributions`: Total contributions.
- `contributors[].profile.name`: Name of the contributor.
- `contributors[].profile.company`: Contributor's company.

## Example Use Cases
- Find top developers for hiring from open-source projects.
- Assess community activity and contributions to a project.