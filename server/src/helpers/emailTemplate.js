module.exports = {
    welcomeTmp: (name) => {
      return `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kıtırtaş Pizza - Hoş Geldin</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #fff8f0;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background-color: #d62828;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .banner {
            width: 100%;
          }
          .content {
            padding: 30px;
          }
          .content h2 {
            color: #d62828;
          }
          .button {
            display: inline-block;
            padding: 12px 25px;
            margin-top: 20px;
            background-color: #f77f00;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          }
          .footer {
            background-color: #eee;
            color: #666;
            text-align: center;
            padding: 15px;
            font-size: 13px;
          }
          .footer a {
            color: #d62828;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
  
        <div class="container">
          <div class="header">
            <h1>Kıtırtaş Pizza'ya Hoş Geldin, ${name}!</h1>
          </div>
  
          <img class="banner" src="https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg" alt="Pizza Banner">
  
          <div class="content">
            
            <h2>Üyeliğin Başarıyla Oluşturuldu 🍕</h2>
            <p>Artık Kıtırtaş Pizza'nın enfes dünyasında yerin hazır. Sana özel kampanyalar, indirimler ve yepyeni tatlarla dolu bir yolculuk seni bekliyor.</p>
            <p>İlk siparişinde kullanabileceğin <strong>%20 HOŞGELDİN İNDİRİMİ</strong> fırsatını kaçırma!</p>
            <a class="button" href="https://kitirtaspizza.com" target="_blank">Sipariş Vermeye Başla</a>
          </div>
  
          <div class="footer">
            <p>&copy; 2025 Kıtırtaş Pizza | <a href="https://kitirtaspizza.com">Web Sitemizi Ziyaret Et</a></p>
          </div>
        </div>
  
      </body>
      </html>
      `
    }
  }
  