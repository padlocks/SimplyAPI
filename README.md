# SimplyAPI
### An API wrapper for SimplyPlural, written in node.

### Usage and examples
This project has examples of how to use this package under the examples folder. Proper documentation will be created at a later date.

#### Environment Variables
These can be set either in the .env file, in terminal, or in the config vars section of Heroku.
| Setting  | Default | Description        |
| ---------| ------- | ------------------ |
| url  | https://api.apparyllis.com | The base URL for all SimplyPlural API requests. Unless you are running your own fork of Simply Plural, you shouldn't change this.  |
| api_version  | v1 | The target SimplyPlural API version. Unless you are running your own fork of Simply Plural, you shouldn't change this.  |
| token | token_here | Your SimplyPlural account token. Full permissions are necessary to use some features. |
| userId | user_id | Your SimplyPlural account/system ID. You can find it in account info near the bottom. |