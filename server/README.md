# Server

## Install package (ติดตั้งแพ็คเกจ)

```bash
$ npm install
```

ถ้าหากใช้งานจริงบน Server Production แนะนำให้ใช้คำสั่งด้านล่างนี้

```bash
$ npm install --only=prod
```

## Configuration (กำหนดค่าการทำงาน)

กำหนดค่า Options ในไฟล์ `default.json` หรือ `[NODE_ENV].json` ในโฟลเดอร์ config

### Config Options 
- `apiKey`: (String) คีย์ API
- `chatfuel`: (Object) ข้อมูล Chatfuel สามารถดูรายละเอียด[ที่นี้](https://docs.chatfuel.com/en/articles/2706667-dashboard-api)
- `databaseURI`: (String) URI ฐานข้อมูล Mongodb
- `databaseOptions`: (Object) Options การเชื่อมต่อ Mongodb 
- `jsonLogs`: (Boolean) Logger แสดงข้อมูลเป็น JSON
- `logLevel`: (String) Logger ประเภทที่แสดง เช่น error, warn, info, debug, verbose และ silly
- `logsFolder`: (String) โฟลเดอร์ที่อยู่ของไฟล์ log
- `maxLogFiles`: (Number|String) จำนวนไฟล์ log ที่เก็บสูงสุด
- `port`: (Number) เลข Port ที่ Server ทำงาน

### Basic configuration file

```json
  "port": 3000,
  "apiKey": "secret_api_key",
  "databaseURI": "mongodb://example:27017/db",
  "chatfuel": {
    "botId": "chatfuel_bot_id",
    "token": "chatfuel_token"
  }
```

## Run Server (เริ่มทำงาน)

```bash
$ npm start
```
<strong style="color:red">คำชี้แนะ</strong>: ในการทำงานครั้งแรก ข้อมูลผู้ใช้งานจะไม่มีในฐานข้อมูล จึงต้องรันคำสั่ง Seeder เพื่อสร้างข้อมูลผู้ใช้งานเริ่มต้น ดังคำสั่งนี้

```bash
$ npx md-seed run users
```

## Test (ทดสอบ)

```bash
$ npm test
```

คำสั่งดังกล่าวใช้โค้ดที่อยู่ในโฟลเดอร์ `./tests` ซึ่งรันโดย framework unit test ของ `jest`

## Seed (ข้อมูลเริ่มต้นในฐานข้อมูล)

```bash
$ npx md-seed run
```
หรือเรียกใช้ seeders เฉพาะ

```bash
$ npx md-seed run users
```

รันโดย [`mongoose-data-seed`](https://github.com/sharvit/mongoose-data-seed)

## Scripts (โค้ดสคริปต์)

### ซิงค์ข้อมูล Chatfuel Bot

```bash
node ./scripts/sync-chatfuel-bot-data.js
```

## TODO (สิ่งที่จะทำ)

- API Docs
- API Promission User Role
- API Clase ลบข้อมูลได้หลาย id