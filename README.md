# shepherd-discord-bot
A Discord bot for Rainbow Six Siege Professional Team Shepherd's Discord server

# Features
* A simple but powerful ticket system
  * `.new`
  * `.add`
  * `.remove`
  * `.close`
* Reaction Role
  * `.reaction` is used to update the reaction role message
  * The actual role assignment code is in the raw event (currently in [index.js](index.js))
* An usual welcome message
* `.updatelist`: generate a list based on members of any specific roles and put it in a message (like in an announcement)
* `.ping`: returns Discord API heartbeat and message send time
* `.prune`: prune last *n* messages
* `.info`: prints out runtime information

This repository also features best practices for a Node.js app Dockerfile. Procfile is for Heroku but I no longer use it.

# Usage
I recommend the provided Docker Compose config when deploying to production.

```
$ cp docker-compose.example.yml docker-compose.yml
$ docker-compose up -d
$ docker-compose logs -f
```

# Development
I use nodemon to auto restart the app when code changes. It's set to debug mode when doing `npm test`.
```
$ npm i
$ npm test
```

# Roadmap
I'm planning to make this bot more flexible and useful in everyday Discord usage.  
In terms of the code I'm going to do more DRY. I've found a lot of repeated codes and I'll clean them up.

# License
This open source software is released under [MIT License](LICENSE).
