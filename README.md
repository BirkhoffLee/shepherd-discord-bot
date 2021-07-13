# shepherd-discord-bot
A Discord bot for Rainbow Six Siege Professional Team Shepherd's Discord server. It's no longer being maintained.

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

Procfile is for Heroku but I no longer use it.

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

# License
This open source software is released under [MIT License](LICENSE).
