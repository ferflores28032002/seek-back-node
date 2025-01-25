interface IsVerifiedTemplateProps {
  name: string;
  verifyLink: string;
}

function verificationTemplate(props: IsVerifiedTemplateProps): string {
  const { name, verifyLink } = props;

  return `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                padding: 20px;
                overflow: hidden;
              }
              .header {
                text-align: center;
                color: #444;
                margin-bottom: 20px;
              }
              .header img {
                width: 80px;
                height: auto;
                margin-bottom: 10px;
              }
              .header h1 {
                font-size: 24px;
                margin: 0;
                color: #3B82F6;
              }
              .content {
                text-align: center;
                font-size: 16px;
                line-height: 1.5;
                margin: 20px 0;
              }
              .button {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #3B82F6;
                color: #ffffff;
                text-decoration: none;
                font-weight: bold;
                border-radius: 5px;
                transition: background-color 0.3s;
              }
              .button:hover {
                background-color: #2C6AD4;
              }
              .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #777;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
               
                <h1>¡Hola, ${name}!</h1>
              </div>
              <div class="content">
                <p>Gracias por registrarte en nuestro servicio.</p>
                <p>Para verificar tu cuenta, haz clic en el botón de abajo:</p>
                <a href="${verifyLink}" class="button">Verificar cuenta</a>
              </div>
              <div class="footer">
                <p>Si no has creado esta cuenta, por favor ignora este mensaje.</p>
              </div>
            </div>
          </body>
        </html>
      `;
}

export default verificationTemplate;
