# api-badge
[![API Status](https://api-badge.hackzzila.com/v1?url=https://api-badge.hackzzila.com/v1/ping)](https://github.com/Hackzzila/api-badge)
[![Build Status](https://travis-ci.org/Hackzzila/api-badge.svg?branch=master)](https://travis-ci.org/Hackzzila/api-badge)

Simple API status badges.

To get colors, we record min and max response times, and find where yours sits in the range, and do some math
(courtesy of @appellation) to figure out a color.

## Usage
Firstly you need a route on your API that returns a successful status code (2xx or 3xx) and preferably
does no logic. Then you can put the badge on your README.

```markdown
[![API Status](https://api-badge.hackzzila.com/v1?url=YOUR_PING_URL)](https://github.com/Hackzzila/api-badge)
```
