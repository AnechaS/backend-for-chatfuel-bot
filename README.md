# 21fundee
Extended report management system for chatfuel

## Install 

```bash
$ npm install
```

## Configuration
create file` /config/default.json
```json
{
  "port": 3000,
  "app": {
    "apiKey": "YOU_API_KEY",
    "apiPublicKey": "YOU_API_PUBLIC_KEY"
  },
  "logging": {
    "logsFolder": "logs",
    "jsonLogs": true
  },
  "db": {
    "uri": "mongodb://localhost:27017/YOU-DATABASE",
    "options": {}
  },
  "chatfuel": {
    "botId": "YOU_BOT_ID",
    "token": "YOU_BOT_TOKEN"
  },
  "cloudinary": {
    "cloudName": "YOU_CLOUD_NAME",
    "apiKey": "YOU_API_KEY",
    "uploadPreset": "YOU_UPLOAD_PRESET"
  }
}
```

## Command

### Start

```bash
$ npm start
```

### Start Server REST API

```bash
npm run server
```

sample request
```bash
$ curl --location --request GET 'http://localhost:3000/health'
```

### Start Server React

```bash
$ npm run client
```
or
```bash
$ cd client
$ npm start
```

After starting the client, you can visit http://localhost:4040 in your browser.

### Test

```bash
$ npm test
```

### ESLint

```bash
$ npm run lint
```