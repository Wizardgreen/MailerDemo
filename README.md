# MailerDemo
這是一個練習作品，透過一個中心 email 讓大家寄信給想要的對象，輸入對方的 emai，把訊息傳過去。  
因為是練習用，我在首頁上面也直接開放了管理頁面的連結，以方便測試各種功能有沒有正常運作，  
除此之外還串上了 Firebase 跟下方列表的各種東西：  
- connect-flash: 儲存一次性的資料
- csurf: 避免跨站攻擊
- express-validator: 資料驗證  

## 初始化
首先透過 NPM 安裝各種插件
```
npm install
```
建立環境變數 (要你的信箱資訊，才能夠真的把信寄給寄出去)
```
/.env
```

## 用法
```
npm start
```
